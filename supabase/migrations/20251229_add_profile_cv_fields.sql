-- Add new profile fields for CV upload and LinkedIn
-- Run this migration to add the new columns

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS uploaded_cv_url TEXT,
ADD COLUMN IF NOT EXISTS parsed_cv_data JSONB;

-- Create storage bucket for user CVs if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-cvs', 'user-cvs', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to user-cvs bucket
CREATE POLICY IF NOT EXISTS "Users can upload their own CVs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY IF NOT EXISTS "Users can read their own CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY IF NOT EXISTS "Users can delete their own CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-cvs' AND (storage.foldername(name))[1] = auth.uid()::text);
