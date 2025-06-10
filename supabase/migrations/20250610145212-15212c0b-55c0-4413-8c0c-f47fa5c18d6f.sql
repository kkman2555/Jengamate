
-- Delete all profiles (this will also remove associated auth users due to CASCADE)
DELETE FROM public.profiles;

-- Reset the sequence/auto-increment if any (not needed for UUID but good practice)
-- Note: auth.users will be automatically cleaned up due to the CASCADE relationship
