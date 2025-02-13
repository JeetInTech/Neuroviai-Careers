import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Heart, MessageCircle, Eye, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Post = {
  id: string;
  caption: string;
  created_at: string;
  user: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
  cv: {
    id: string;
    template: string;
    personal_info: {
      full_name: string;
      summary: string;
    };
  };
  likes: number;
  comments: number;
  liked_by_user: boolean;
  post_comments?: {
    id: string;
    content: string;
    created_at: string;
    user: {
      username: string;
      display_name: string;
      avatar_url: string;
    };
  }[];
};

export default function Creators() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  const loadPosts = useCallback(async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('cv_posts')
        .select(`
          id,
          caption,
          created_at,
          user_id,
          user:profiles!inner(username, display_name, avatar_url),
          cv:cvs(
            id,
            template,
            personal_info
          ),
          likes:post_likes(count),
          comments:post_comments(
            id,
            content,
            created_at,
            user:profiles!inner(username, display_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // If user is authenticated, check which posts they've liked
      let likedPosts: string[] = [];
      if (user) {
        const { data: likesData } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', user.id);
        likedPosts = (likesData || []).map(like => like.post_id);
      }

      const formattedPosts = postsData?.map(post => ({
        ...post,
        likes: post.likes?.length || 0,
        comments: post.comments?.length || 0,
        liked_by_user: likedPosts.includes(post.id),
        post_comments: post.comments,
        user: post.user[0],
        cv: post.cv?.[0]
      })) || [];

      setPosts(formattedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.liked_by_user) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .match({ post_id: postId, user_id: user.id });
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
      }

      // Refresh posts
      loadPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleComment = async (postId: string) => {
    if (!user || !newComment.trim()) return;

    try {
      await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        });

      setNewComment('');
      loadPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUseTemplate = (postId: string) => {
    if (!user) return;
    navigate(`/cv/use/${postId}`);
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cv_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id); // Ensure only the post owner can delete

      if (error) throw error;
      
      // Refresh posts after deletion
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CV Showcase</h1>
          {!user && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">
                Sign in to like, comment, and use templates
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Post Header */}
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {post.user?.avatar_url ? (
                      <img
                        src={post.user.avatar_url}
                        alt={post.user?.display_name || 'User'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-gray-400" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{post.user?.display_name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">@{post.user?.username || 'unknown'}</p>
                  </div>
                </div>
                
                {/* Add delete button - only show for user's own posts */}
                {user && post.user?.username === user.user_metadata.username && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this post?')) {
                        handleDeletePost(post.id);
                      }
                    }}
                    className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* CV Preview with Use Template button */}
              <div className="p-6 bg-gray-50 border-b">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {post.cv?.personal_info?.full_name || 'Unnamed CV'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Template by {post.user?.display_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(post.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      user 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!user}
                  >
                    {user ? (
                      <>
                        <Eye className="h-4 w-4" />
                        <span>Use Template</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Login to Use</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Show CV summary if available */}
                {post.cv?.personal_info?.summary && (
                  <div className="prose prose-sm max-w-none text-gray-600 mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Professional Summary</h4>
                    <p>{post.cv.personal_info.summary}</p>
                  </div>
                )}

                {/* Show template info */}
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Template:</span> {post.cv?.template || 'N/A'}
                </div>
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="p-4 border-b">
                  <p className="text-gray-600">{post.caption}</p>
                </div>
              )}

              {/* Interactions Section */}
              <div className="p-4 flex items-center space-x-6">
                <button
                  onClick={() => user ? handleLike(post.id) : undefined}
                  className={`flex items-center space-x-2 ${
                    !user ? 'cursor-not-allowed text-gray-400' :
                    post.liked_by_user ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                  } transition-colors`}
                >
                  <Heart className={`h-5 w-5 ${post.liked_by_user ? 'fill-current' : ''}`} />
                  <span>{post.likes}</span>
                </button>

                <div className="flex items-center space-x-2 text-gray-500">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comments}</span>
                </div>
              </div>

              {/* Comments Section - Show existing comments to all users */}
              {post.post_comments && post.post_comments.length > 0 && (
                <div className="p-4 border-t space-y-4">
                  {post.post_comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {comment.user?.avatar_url ? (
                          <img
                            src={comment.user.avatar_url}
                            alt={comment.user?.display_name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <User className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{comment.user?.display_name}</p>
                        <p className="text-gray-600">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comment Input - Only show to logged in users */}
              {user && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      onClick={() => handleComment(post.id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      disabled={!newComment.trim()}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No CV posts yet. Be the first to share!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}