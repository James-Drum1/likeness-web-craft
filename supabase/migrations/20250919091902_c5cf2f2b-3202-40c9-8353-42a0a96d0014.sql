-- Clear all existing QR codes and their associated memories to start fresh
TRUNCATE TABLE memories CASCADE;
TRUNCATE TABLE qr_codes CASCADE;