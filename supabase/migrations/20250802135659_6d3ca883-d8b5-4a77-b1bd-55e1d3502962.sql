-- Create missing enum types that are referenced in the database
DO $$ BEGIN
    CREATE TYPE worker_status AS ENUM ('pending', 'active', 'inactive', 'suspended');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE service_category AS ENUM ('plumbing', 'electrical', 'carpentry', 'painting', 'roofing', 'building', 'gardening', 'cleaning', 'locksmith', 'other');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Now the trigger function should work correctly since worker_status enum exists
-- Re-create the handle_new_user function to ensure it uses the correct enum types
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