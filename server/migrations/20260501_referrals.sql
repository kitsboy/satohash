CREATE TABLE IF NOT EXISTS referrals (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    referrer_user_id TEXT,
    referred_user_id TEXT,
    credits_awarded INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'redeemed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    redeemed_at DATETIME
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(code);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_user_id);
