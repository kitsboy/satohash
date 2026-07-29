/**
 * Docs API — serves markdown from docs/ (paths preserved).
 * @param {import('express').Express} app
 * @param {object} deps
 */
export function register(app, deps) {
  const { fs, path, DOC_SLUGS } = deps

  const slugs = DOC_SLUGS || {
    'executive-summary': 'docs/marketing/EXECUTIVE-SUMMARY.md',
    marketing: 'docs/marketing/MARKETING.md',
    financials: 'docs/marketing/FINANCIALS.md',
    pitch: 'docs/marketing/PITCH.md',
    'design-tokens': 'docs/DESIGN-TOKENS.md',
    'design-context': 'docs/DESIGN-CONTEXT.md',
    deploy: 'docs/deploy.md',
    architecture: 'docs/architecture.md'
  }

  app.get('/api/docs/manifest', (req, res) => {
    const manifestPath = path.resolve('docs/manifest.json')
    if (fs.existsSync(manifestPath)) {
      res.json(JSON.parse(fs.readFileSync(manifestPath, 'utf-8')))
    } else {
      res.json({ docs: Object.keys(slugs).map((slug) => ({ slug })) })
    }
  })

  app.get('/api/docs/:slug', (req, res) => {
    const rel = slugs[req.params.slug]
    if (!rel) return res.status(404).json({ error: 'Document not found' })
    const full = path.resolve(rel)
    if (!fs.existsSync(full)) return res.status(404).json({ error: 'Document file missing' })
    res.json({
      slug: req.params.slug,
      content: fs.readFileSync(full, 'utf-8'),
      updatedAt: fs.statSync(full).mtime.toISOString()
    })
  })
}
