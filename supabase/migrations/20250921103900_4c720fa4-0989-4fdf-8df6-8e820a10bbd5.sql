-- Fix the duplicate memorial creation issue

-- 1. Update the trigger function to prevent duplicate memorials
CREATE OR REPLACE FUNCTION public.create_memorial_for_claimed_qr()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create memorial if QR code was just claimed (status changed to 'claimed')
  -- AND no memorial exists yet
  IF NEW.status = 'claimed' AND OLD.status = 'unclaimed' AND NEW.claimed_by IS NOT NULL THEN
    -- Check if memorial already exists
    IF NOT EXISTS (SELECT 1 FROM public.memorials WHERE id = NEW.id) THEN
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
  END IF;
  
  RETURN NEW;
END;
$$;

-- 2. Fix the existing data inconsistency (fixed syntax)
UPDATE public.qr_codes 
SET 
  status = 'claimed',
  claimed_by = m.owner_id,
  claimed_at = COALESCE(public.qr_codes.claimed_at, m.created_at)
FROM public.memorials m 
WHERE public.qr_codes.id = m.id 
  AND public.qr_codes.status != 'claimed';