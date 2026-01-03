-- ============================================
-- Add accent_color and is_grayscale columns to CVs table
-- for color customization feature
-- ============================================

-- Add accent_color column (stores hex color code like '#4F46E5')
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS accent_color text;

-- Add is_grayscale column (boolean for black & white mode)
ALTER TABLE cvs ADD COLUMN IF NOT EXISTS is_grayscale boolean DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN cvs.accent_color IS 'Hex color code for CV accent color (e.g., #4F46E5)';
COMMENT ON COLUMN cvs.is_grayscale IS 'Whether the CV should be displayed in black and white mode';
