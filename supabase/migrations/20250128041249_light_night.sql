/*
  # Portfolio System Setup

  1. New Tables
    - `portfolios`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `template` (text)
      - `title` (text)
      - `about` (text)
      - `skills` (jsonb)
      - `experience` (jsonb)
      - `projects` (jsonb)
      - `certificates` (jsonb)
      - `contact` (jsonb)
      - `is_public` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on portfolios table
    - Add policies for CRUD operations
*/

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

-- Policies
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