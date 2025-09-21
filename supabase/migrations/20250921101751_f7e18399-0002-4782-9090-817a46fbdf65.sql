-- Create trigger for automatic memorial creation when QR code is claimed
CREATE TRIGGER qr_code_claimed_trigger
  AFTER UPDATE ON public.qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_memorial_for_claimed_qr();