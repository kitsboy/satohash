/** Lightweight markdown → HTML for in-app /docs viewer. Escapes first. */

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function slugifyHeading(text) {
  return String(text)
    .replace(/<[^>]+>/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\w\u00C0-\u024f\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function extractHeadings(md) {
  const headings = []
  const lines = String(md || '')
    .replace(/```[\s\S]*?```/g, '')
    .split('\n')
  for (const line of lines) {
    const m = line.match(/^(#{1,3})\s+(.+)/)
    if (!m) continue
    const text = m[2].replace(/\*\*/g, '').trim()
    headings.push({ level: m[1].length, text, id: slugifyHeading(text) })
  }
  return headings
}

export function parseDocMeta(md) {
  const text = String(md || '')
  const updated =
    text.match(/\*\*Updated:\*\*\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/) ||
    text.match(/last_updated:\s*([0-9]{4}-[0-9]{2}-[0-9]{2}|YYYY-MM-DD)/i)
  const version = text.match(/\*\*Version:\*\*\s*([^\s·<]+)/) || text.match(/version:\s*([^\s]+)/i)
  return {
    updated: updated && updated[1] !== 'YYYY-MM-DD' ? updated[1] : null,
    version: version ? version[1] : null
  }
}

function inline(s) {
  return escapeHtml(s)
    .replace(
      /\[([^\]]+)\]\((https?:[^)\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="doc-link">$1</a>'
    )
    .replace(/\[([^\]]+)\]\((\/[^)\s]+)\)/g, '<a href="$2" class="doc-link">$1</a>')
    .replace(/`([^`]+)`/g, '<code class="doc-code">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,;:!?]|$)/g, '$1<em>$2</em>')
}

function renderTable(rows) {
  const htmlRows = rows.map((row, i) => {
    const cells = row
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim())
    const tag = i === 0 ? 'th' : 'td'
    if (i === 1 && cells.every((c) => /^:?-+:?$/.test(c))) return ''
    return `<tr>${cells.map((c) => `<${tag}>${inline(c)}</${tag}>`).join('')}</tr>`
  })
  return `<div class="doc-table-wrap"><table class="doc-table">${htmlRows.join('')}</table></div>`
}

export function renderDocMarkdown(md) {
  let src = String(md || '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^> \*\*Live:\*\*[\s\S]*?Synced by.*$/m, '')
    .replace(/^---\n[\s\S]*?\n---\n/, '')

  const fences = []
  src = src.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const i = fences.length
    fences.push(
      `<pre class="doc-pre"><code class="lang-${escapeHtml(lang || 'text')}">${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`
    )
    return `\n%%FENCE${i}%%\n`
  })

  const lines = src.split('\n')
  const out = []
  let i = 0
  let para = []

  const flushPara = () => {
    if (!para.length) return
    const text = para.join(' ').trim()
    if (text) out.push(`<p class="doc-p">${inline(text)}</p>`)
    para = []
  }

  while (i < lines.length) {
    const line = lines[i]
    const fence = line.match(/^%%FENCE(\d+)%%$/)
    if (fence) {
      flushPara()
      out.push(fences[Number(fence[1])])
      i += 1
      continue
    }

    if (/^\s*$/.test(line)) {
      flushPara()
      i += 1
      continue
    }

    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      flushPara()
      out.push('<hr class="doc-hr" />')
      i += 1
      continue
    }

    const h = line.match(/^(#{1,3})\s+(.+)/)
    if (h) {
      flushPara()
      const level = h[1].length
      const text = h[2].replace(/\*\*/g, '').trim()
      const id = slugifyHeading(text)
      out.push(`<h${level} id="${id}" class="doc-h${level}">${inline(text)}</h${level}>`)
      i += 1
      continue
    }

    if (line.trim().startsWith('|') && i + 1 < lines.length && /^\s*\|?\s*:?-/.test(lines[i + 1])) {
      flushPara()
      const rows = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i])
        i += 1
      }
      out.push(renderTable(rows))
      continue
    }

    if (/^>\s?/.test(line)) {
      flushPara()
      const quotes = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quotes.push(lines[i].replace(/^>\s?/, ''))
        i += 1
      }
      out.push(`<blockquote class="doc-quote">${inline(quotes.join(' '))}</blockquote>`)
      continue
    }

    if (/^\s*[-*]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      flushPara()
      const ordered = /^\s*\d+\.\s+/.test(line)
      const items = []
      while (
        i < lines.length &&
        (ordered ? /^\s*\d+\.\s+/.test(lines[i]) : /^\s*[-*]\s+/.test(lines[i]))
      ) {
        items.push(lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, ''))
        i += 1
      }
      const tag = ordered ? 'ol' : 'ul'
      out.push(
        `<${tag} class="doc-list">${items.map((item) => `<li>${inline(item)}</li>`).join('')}</${tag}>`
      )
      continue
    }

    para.push(line.trim())
    i += 1
  }
  flushPara()

  return out.join('\n')
}
