-- Check and fix the handle_new_user function to ensure it properly handles tradesperson signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer')
  );
  
  -- If user is a tradesperson, create worker portfolio with signup data
  IF COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer') = 'tradesperson' THEN
    INSERT INTO public.worker_portfolios (
      user_id, 
      business_name, 
      email, 
      phone, 
      location, 
      status
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'business_name', COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New Business')),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data ->> 'phone', '000-000-0000'),
      COALESCE(NEW.raw_user_meta_data ->> 'location', 'Ireland'),
      'active'::worker_status
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();