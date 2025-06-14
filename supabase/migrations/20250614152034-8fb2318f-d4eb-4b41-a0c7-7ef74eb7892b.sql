
-- Insert admin role for the current user (replace with your actual user ID)
-- You can find your user ID in the Supabase Auth > Users section
-- For now, I'll create a sample admin user entry
INSERT INTO public.user_roles (user_id, role) 
VALUES ('9a29151e-3154-4704-8c5b-0014b79aba32', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
