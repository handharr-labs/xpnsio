-- Migration: Allow anonymous uploads to the payment-proofs storage bucket
-- This is required for participants (unauthenticated users) to submit payment proof
-- on the public split-bill and trip pages.
--
-- The bucket must exist in Supabase Storage before applying this migration.
-- Run in Supabase Dashboard > SQL Editor, or via `supabase db push`.

-- ─── Storage bucket ──────────────────────────────────────────────────────────
-- Ensure the bucket exists and is public (read-only public access is fine;
-- writes are gated by the INSERT policy below).
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ─── Storage RLS policies ────────────────────────────────────────────────────

-- 1. Allow anyone (authenticated or anon) to upload files.
--    Participants are not logged in, so we cannot restrict by auth.uid().
--    We allow INSERT to all roles (anon + authenticated).
--    The path structure is enforced at the application layer:
--      split-bill proofs: {billId}/{participantId}-{timestamp}.{ext}
--      trip proofs:       trips/{tripId}/{settlementId}-{timestamp}.{ext}
DROP POLICY IF EXISTS "Allow public upload to payment-proofs" ON storage.objects;
CREATE POLICY "Allow public upload to payment-proofs"
  ON storage.objects
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'payment-proofs');

-- 2. Allow public read access so proofs can be viewed by the bill creator.
DROP POLICY IF EXISTS "Allow public read from payment-proofs" ON storage.objects;
CREATE POLICY "Allow public read from payment-proofs"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'payment-proofs');

-- 3. Allow authenticated users (bill/trip creators) to delete proof files
--    (e.g. when deleting a bill). Anon users cannot delete.
DROP POLICY IF EXISTS "Allow authenticated delete from payment-proofs" ON storage.objects;
CREATE POLICY "Allow authenticated delete from payment-proofs"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'payment-proofs');
