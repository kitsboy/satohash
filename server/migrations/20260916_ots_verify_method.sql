-- Engine contract v2 (t_da054829): record HOW a confirmation was resolved.
--
-- Before this column, "confirmed" was written whenever the rendered
-- OpenTimestamps.info() text contained the words "Bitcoin block" — a claim, not
-- a check. Rows could therefore be marked confirmed without anything committing
-- to their digest on-chain.
--
-- verify_method values:
--   bitcoind:self-sovereign      resolved against the plane's own Bitcoin node
--   esplora:third-party-explorer resolved against a public explorer (own node down)
--   unverified:<reason>          legacy row that did NOT resolve — surfaced, not hidden
--   NULL                         written before this column existed (daemon reconciles)
ALTER TABLE timestamps ADD COLUMN verify_method TEXT;

CREATE INDEX IF NOT EXISTS idx_verify_method ON timestamps(verify_method);
