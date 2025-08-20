-- Remove service_name column from worker_services table
-- and update the handle_new_user function accordingly

-- First, drop the foreign key constraint
ALTER TABLE public.worker_services DROP CONSTRAINT IF EXISTS worker_services_category_fkey;

-- Remove the service_name column
ALTER TABLE public.worker_services DROP COLUMN IF EXISTS service_name;

-- Re-add the foreign key constraint
ALTER TABLE public.worker_services 
ADD CONSTRAINT worker_services_category_fkey 
FOREIGN KEY (category) REFERENCES public.service_categories(name);

-- Update the handle_new_user function to not expect service_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_worker_id uuid;
  v_is_worker boolean;
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, full_name, user_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer'::public.user_type)
  );
  
  v_is_worker := COALESCE((NEW.raw_user_meta_data ->> 'user_type')::public.user_type, 'customer'::public.user_type) = 'worker'::public.user_type;
  
  IF v_is_worker THEN
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
    )
    RETURNING id INTO v_worker_id;

    -- Insert selected locations if provided
    IF (NEW.raw_user_meta_data ? 'locations') THEN
      INSERT INTO public.worker_locations (worker_id, location_id)
      SELECT v_worker_id, (elem.value #>> '{}')::uuid
      FROM jsonb_array_elements(NEW.raw_user_meta_data -> 'locations') AS elem(value)
      WHERE EXISTS (
        SELECT 1 FROM public.locations l WHERE l.id = (elem.value #>> '{}')::uuid
      )
      ON CONFLICT DO NOTHING;
    END IF;

    -- Insert services if provided (only category, description, and pricing)
    IF (NEW.raw_user_meta_data ? 'services') THEN
      INSERT INTO public.worker_services (worker_id, description, category, price_from, price_to)
      SELECT
        v_worker_id,
        NULLIF(elem.value->>'description', ''),
        COALESCE(elem.value->>'category', 'Other'),
        NULLIF(elem.value->>'price_from','')::numeric,
        NULLIF(elem.value->>'price_to','')::numeric
      FROM jsonb_array_elements(NEW.raw_user_meta_data -> 'services') AS elem(value);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$