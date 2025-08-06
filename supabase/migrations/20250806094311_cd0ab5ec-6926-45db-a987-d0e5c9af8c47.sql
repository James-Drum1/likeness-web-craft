-- Update the handle_new_user function to use 'worker' instead of 'tradesperson'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer'::public.user_type)
  );
  
  -- If user is a worker, create worker portfolio with signup data
  IF COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer'::public.user_type) = 'worker'::public.user_type THEN
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
      'active'::public.worker_status
    );
  END IF;
  
  RETURN NEW;
END;
$$;