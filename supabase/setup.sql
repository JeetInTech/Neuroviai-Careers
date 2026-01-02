-- ============================================
-- CV FORGE - COMPLETE DATABASE SETUP
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROFILES TABLE
-- ============================================

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  address text,
  phone text,
  username text UNIQUE,
  display_name text,
  cv_credits integer NOT NULL DEFAULT 2,
  subscription_status text NOT NULL DEFAULT 'free',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
  CONSTRAINT username_format CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$'),
  CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('free', 'premium', 'enterprise'))
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email,
    username,
    display_name
  )
  VALUES (
    new.id, 
    new.email,
    LOWER(SPLIT_PART(new.email, '@', 1)),
    SPLIT_PART(new.email, '@', 1)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. CVS TABLE
-- ============================================

CREATE TABLE cvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template text NOT NULL,
  target_role text,
  ats_score integer,
  personal_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  languages jsonb NOT NULL DEFAULT '[]'::jsonb,
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  projects jsonb DEFAULT '[]'::jsonb,
  custom_sections jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own CVs"
  ON cvs FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own CVs"
  ON cvs FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own CVs"
  ON cvs FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own CVs"
  ON cvs FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 3. PORTFOLIOS TABLE (Legacy support)
-- ============================================

CREATE TABLE portfolios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    template text NOT NULL,
    title text NOT NULL,
    about text,
    skills jsonb DEFAULT '[]'::jsonb,
    experience jsonb DEFAULT '[]'::jsonb,
    projects jsonb DEFAULT '[]'::jsonb,
    certificates jsonb DEFAULT '[]'::jsonb,
    contact jsonb DEFAULT '{}'::jsonb,
    is_public boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own portfolios" 
    ON portfolios FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Public portfolios are viewable" 
    ON portfolios FOR SELECT 
    USING (is_public = true);

CREATE POLICY "Users can create own portfolios" 
    ON portfolios FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios" 
    ON portfolios FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolios" 
    ON portfolios FOR DELETE 
    USING (auth.uid() = user_id);

-- ============================================
-- 4. CV POSTS TABLE (Social features)
-- ============================================

CREATE TABLE cv_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    cv_id uuid REFERENCES cvs(id) ON DELETE CASCADE NOT NULL,
    caption text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE cv_posts ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- 5. POST LIKES TABLE
-- ============================================

CREATE TABLE post_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES cv_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    created_at timestamptz DEFAULT now(),
    UNIQUE(post_id, user_id)
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- 6. POST COMMENTS TABLE
-- ============================================

CREATE TABLE post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid REFERENCES cv_posts(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

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

-- ============================================
-- 7. STORAGE BUCKET FOR AVATARS
-- ============================================
-- Note: Create this bucket manually in Supabase Dashboard
-- Go to Storage > Create bucket > Name: "avatars" > Make it public

-- Storage policies (run after creating the bucket)
/*
CREATE POLICY "Avatar uploads require authentication"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = SPLIT_PART(name, '/', 1))
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = SPLIT_PART(name, '/', 1));

CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');
*/

-- ============================================
-- SETUP COMPLETE!
-- ============================================
