export type Profile = {
  id: string;
  email: string;
  username: string;
  display_name: string;
  full_name: string | null;
  avatar_url: string | null;
  address: string | null;
  phone: string | null;
  updated_at: string;
  cv_credits: number;
  subscription_status: 'free' | 'premium';
};

export type CV = {
  id: string;
  user_id: string;
  template: string;
  personal_info: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    photo_url?: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    start_date: string;
    end_date: string;
    description: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
  }>;
  skills: Array<{
    name: string;
    level: number;
    category: string;
  }>;
  languages: Array<{
    name: string;
    proficiency: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  created_at: string;
  updated_at: string;
};

export type CVPost = {
  id: string;
  user_id: string;
  cv_id: string;
  caption: string;
  created_at: string;
  updated_at: string;
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type PostComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      cvs: {
        Row: CV;
        Insert: Omit<CV, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CV, 'id' | 'user_id'>>;
      };
      cv_posts: {
        Row: CVPost;
        Insert: Omit<CVPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CVPost, 'id' | 'user_id'>>;
      };
      post_likes: {
        Row: PostLike;
        Insert: Omit<PostLike, 'id' | 'created_at'>;
        Update: never;
      };
      post_comments: {
        Row: PostComment;
        Insert: Omit<PostComment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PostComment, 'id' | 'user_id' | 'post_id'>>;
      };
    };
  };
};