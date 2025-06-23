
-- Add missing columns to inquiries table
ALTER TABLE inquiries 
ADD COLUMN project_type text,
ADD COLUMN project_description text,
ADD COLUMN specifications text,
ADD COLUMN contact_person text,
ADD COLUMN phone_number text;
