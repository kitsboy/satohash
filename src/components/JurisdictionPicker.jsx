const JURISDICTIONS = [
  { id: 'us-ueta', label: 'United States (UETA / ESIGN)', framework: 'UETA' },
  { id: 'eu-eidas', label: 'European Union (eIDAS)', framework: 'eIDAS' },
  { id: 'uk', label: 'United Kingdom', framework: 'Common Law' },
  { id: 'ch', label: 'Switzerland', framework: 'ZertES' },
  { id: 'sc', label: 'Seychelles (Give A Bit HQ)', framework: 'IBA' },
  { id: 'un', label: 'UN / Cross-border', framework: 'Hague' }
]

export default function JurisdictionPicker({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label
        className="text-[10px] font-black tracking-widest uppercase"
        style={{ color: 'var(--text-secondary)' }}
      >
        Jurisdiction
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border px-4 py-3 text-sm"
        style={{
          borderColor: 'var(--border)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)'
        }}
      >
        {JURISDICTIONS.map((j) => (
          <option key={j.id} value={j.id}>
            {j.label}
          </option>
        ))}
      </select>
      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
        Template disclaimer adjusts for {JURISDICTIONS.find((j) => j.id === value)?.framework}. Not
        legal advice.
      </p>
    </div>
  )
}

export { JURISDICTIONS }
