-- Create table to link workers with multiple locations
CREATE TABLE public.worker_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id uuid NOT NULL REFERENCES public.worker_portfolios(id) ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (worker_id, location_id)
);

-- Enable Row Level Security
ALTER TABLE public.worker_locations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Everyone can view worker locations for active workers"
ON public.worker_locations
FOR SELECT
USING (
  worker_id IN (
    SELECT wp.id FROM public.worker_portfolios wp
    WHERE wp.status = 'active'::public.worker_status
  )
);

CREATE POLICY "Workers can manage their own locations"
ON public.worker_locations
FOR ALL
USING (
  worker_id IN (
    SELECT wp.id FROM public.worker_portfolios wp
    WHERE wp.user_id = auth.uid()
  )
);

-- Update handle_new_user to also insert worker locations from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
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

    -- Insert selected locations if provided (expects array of UUIDs in raw_user_meta_data.locations)
    IF (NEW.raw_user_meta_data ? 'locations') THEN
      INSERT INTO public.worker_locations (worker_id, location_id)
      SELECT v_worker_id, (elem.value #>> '{}')::uuid
      FROM jsonb_array_elements(NEW.raw_user_meta_data -> 'locations') AS elem(value)
      WHERE EXISTS (
        SELECT 1 FROM public.locations l WHERE l.id = (elem.value #>> '{}')::uuid
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;