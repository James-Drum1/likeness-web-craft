-- Complete fix for QR code claiming issue

-- 1. Fix existing data inconsistency: Update QR codes that have memorials but wrong status
UPDATE public.qr_codes 
SET 
  status = 'claimed',
  claimed_by = m.owner_id,
  claimed_at = m.created_at
FROM public.memorials m 
WHERE public.qr_codes.id = m.id 
  AND public.qr_codes.status = 'unclaimed';

-- 2. Ensure the trigger is properly attached to qr_codes table
DROP TRIGGER IF EXISTS qr_code_claimed_trigger ON public.qr_codes;

CREATE TRIGGER qr_code_claimed_trigger
  AFTER UPDATE ON public.qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_memorial_for_claimed_qr();

-- 3. Add constraint to prevent memorial creation without proper QR claiming
ALTER TABLE public.memorials 
DROP CONSTRAINT IF EXISTS memorials_owner_claimed_check;

-- Note: We can't add this constraint yet due to existing data, but we'll enforce it in the application logic

-- 4. Create a function to safely claim QR codes with better error handling
CREATE OR REPLACE FUNCTION public.claim_qr_code(qr_code_id text, user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  qr_record record;
BEGIN
  -- Check if QR code exists and is unclaimed
  SELECT * INTO qr_record FROM public.qr_codes WHERE id = qr_code_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'QR code not found');
  END IF;
  
  IF qr_record.status = 'claimed' THEN
    RETURN jsonb_build_object('success', false, 'error', 'QR code already claimed');
  END IF;
  
  -- Claim the QR code
  UPDATE public.qr_codes 
  SET 
    status = 'claimed',
    claimed_by = user_id,
    claimed_at = now()
  WHERE id = qr_code_id AND status = 'unclaimed';
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'QR code could not be claimed');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'message', 'QR code claimed successfully');
END;
$$;