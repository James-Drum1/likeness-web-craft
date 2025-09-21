-- Fix SECURITY DEFINER functions with explicit search_path and adjust RLS for claiming QR codes

-- 1) Ensure functions use a fixed search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT role FROM public.profiles WHERE id = auth.uid());
END;
$$;

CREATE OR REPLACE FUNCTION public.create_memorial_for_claimed_qr()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create memorial if QR code was just claimed (status changed to 'claimed')
  IF NEW.status = 'claimed' AND OLD.status = 'unclaimed' AND NEW.claimed_by IS NOT NULL THEN
    INSERT INTO public.memorials (
      id,
      owner_id,
      title,
      description,
      is_public,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.claimed_by,
      'Memorial Page',
      'This memorial is being set up by the owner.',
      true,
      now(),
      now()
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2) Update RLS so users can claim QR codes (transition unclaimed -> claimed)
DROP POLICY IF EXISTS "Users can update QR codes they're claiming" ON public.qr_codes;

CREATE POLICY "Users can claim QR codes"
ON public.qr_codes
FOR UPDATE
USING (status = 'unclaimed' AND auth.uid() IS NOT NULL)
WITH CHECK (status = 'claimed' AND claimed_by = auth.uid());
