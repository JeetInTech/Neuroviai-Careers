/*
  # Add social features for CV sharing

  1. New Tables
    - `cv_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `cv_id` (uuid, references cvs)
      - `caption` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `post_likes`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references cv_posts)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
    
    - `post_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, references cv_posts)
      - `user_id` (uuid, references profiles)
      - `content` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- CV Posts Table
CREATE TABLE cv_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    cv_id uuid REFERENCES cvs(id) ON DELETE CASCADE NOT NULL,
    caption text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE cv_posts ENABLE ROW LEVEL SECURITY;

-- Post Likes Table
CREATE TABLE post_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES cv_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Post Comments Table
CREATE TABLE post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES cv_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

-- Policies for cv_posts
CREATE POLICY "Anyone can view cv_posts"
    ON cv_posts FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Users can create own cv_posts"
    ON cv_posts FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cv_posts"
    ON cv_posts FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cv_posts"
    ON cv_posts FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for post_likes
CREATE POLICY "Anyone can view post_likes"
    ON post_likes FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Authenticated users can create post_likes"
    ON post_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own post_likes"
    ON post_likes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policies for post_comments
CREATE POLICY "Anyone can view post_comments"
    ON post_comments FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Authenticated users can create post_comments"
    ON post_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own post_comments"
    ON post_comments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own post_comments"
    ON post_comments FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);