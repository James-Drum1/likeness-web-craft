-- Make the specified user an admin
UPDATE public.profiles 
SET user_type = 'admin'::user_type, updated_at = now()
WHERE user_id = 'b6947273-8e2e-4ccd-874f-f0bcfe9a79a6';