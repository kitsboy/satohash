# Satohash money rules

Paper only. Do not turn billing on from this file.

## Now

- Stamps are free. `REQUIRE_LIGHTNING` stays false until Cam says the word in the moment.
- No agent creates an invoice, sends a payment link, or holds e-cash.
- A demo checkout must say Demo on the screen. It must not look like a real payment.
- Do not advertise `satohash@giveabit.io`. That name is not in the live list.

## When Cam says go, and only then

- Every sat is labelled **SATOHASH**. Not a shared label with MotoPass, Tadbuy, or the family hub.
- Demo payments and real payments must never look the same.
- Refunds are a new payment in sats, not a promise to reverse Lightning. Write the exact rule before the first charge.
- A paid product still waits on Lenny for the legal entity. No entity, no charge.
- The home Umbrel node is not the cash register until it has sat at the Bitcoin tip for a week. THOR checks proofs today.
- A typed header is not a payment. The server must see a LNbits invoice marked paid, and the preimage must hash to that payment. A mock invoice never clears it.
- Once the paywall is on, the paid path is 20 stamps an hour per IP. The free path stays 5 a minute. Family keys stay on the free path.
