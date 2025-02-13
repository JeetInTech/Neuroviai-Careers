/*
  # Create CV system tables and policies

  1. Tables
    - Create cvs table for storing CV data
    - Add cv_credits and subscription_status to profiles
  
  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- First, add new columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS cv_credits integer NOT NULL DEFAULT 2;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'free';

-- Add subscription status constraint
DO $$ 
BEGIN
  ALTER TABLE profiles 
  ADD CONSTRAINT valid_subscription_status 
  CHECK (subscription_status IN ('free', 'premium'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create CVs table with minimal jsonb defaults
CREATE TABLE IF NOT EXISTS cvs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  template text NOT NULL,
  personal_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  education jsonb NOT NULL DEFAULT '[]'::jsonb,
  experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  skills jsonb NOT NULL DEFAULT '[]'::jsonb,
  languages jsonb NOT NULL DEFAULT '[]'::jsonb,
  certifications jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on cvs table
ALTER TABLE cvs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies one by one
DO $$ 
BEGIN
  CREATE POLICY "Users can create their own CVs"
  ON cvs FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can view their own CVs"
  ON cvs FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update their own CVs"
  ON cvs FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can delete their own CVs"
  ON cvs FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;