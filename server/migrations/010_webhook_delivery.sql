ALTER TABLE webhooks ADD COLUMN last_delivery_status TEXT;
ALTER TABLE webhooks ADD COLUMN last_delivery_at DATETIME;
