import { describe, it, expect } from 'vitest'
import { escapeHtml, extractHeadings, parseDocMeta, renderDocMarkdown } from './renderDocMarkdown'

describe('renderDocMarkdown', () => {
  it('escapes raw HTML', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toContain('&lt;script&gt;')
    const html = renderDocMarkdown('Hello <img src=x onerror=alert(1)>')
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })

  it('renders headings, tables, and code', () => {
    const md = `# Title

## Section

| A | B |
|---|---|
| 1 | 2 |

\`\`\`bash
echo hi
\`\`\`
`
    const html = renderDocMarkdown(md)
    expect(html).toContain('id="title"')
    expect(html).toContain('doc-table')
    expect(html).toContain('echo hi')
    expect(extractHeadings(md).map((h) => h.id)).toEqual(['title', 'section'])
  })

  it('reads version and date from stamped headers', () => {
    const meta = parseDocMeta(
      '> **Live:** https://satohash.io · **Version:** 5.0.0-ELITE (Build 1) · **Updated:** 2026-08-16'
    )
    expect(meta.version).toBe('5.0.0-ELITE')
    expect(meta.updated).toBe('2026-08-16')
  })
})
