
-- Add admin role for user with email dd396515@gmail.com
INSERT INTO public.user_roles (user_id, role) 
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'dd396515@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
