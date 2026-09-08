/**
 * On-device File for /stamp?template=<id>. Selection only — not a legal form.
 */
export function createTemplateStampFile(id, now = new Date()) {
  const raw = String(id ?? '')
  const safe = (raw || 'unknown').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'unknown'
  const body = `Satohash template: ${raw}\nGenerated: ${now.toISOString()}\nThis file was created on-device to timestamp the template selection. It is not a legal form.`
  return new File([body], `satohash-template-${safe}.txt`, { type: 'text/plain' })
}
