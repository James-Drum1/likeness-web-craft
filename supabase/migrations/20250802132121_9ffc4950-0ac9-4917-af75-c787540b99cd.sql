-- Update the handle_new_user function to automatically activate tradesperson accounts during testing phase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer')
  );
  
  -- If user is a tradesperson, automatically create an active worker portfolio during testing phase
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
      COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'New Business'),
      NEW.email,
      '000-000-0000',
      'Ireland',
      'active'::worker_status  -- Automatically activate during testing phase
    );
  END IF;
  
  RETURN NEW;
END;
$function$