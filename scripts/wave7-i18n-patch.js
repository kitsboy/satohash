#!/usr/bin/env node
/** Wave 7 — items 146-200 i18n keys */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n', 'marketing')
const LANGS = ['en', 'es', 'fr', 'de', 'pt', 'sw', 'zh']

const PATCH = {
  en: {
    legalPages: {
      termsTitle: 'Terms of Service',
      privacyTitle: 'Privacy Policy',
      cryptoTitle: 'Cryptocurrency Notice',
      disclaimer: 'Not legal advice. Consult qualified counsel in your jurisdiction.',
      lastUpdated: 'Last updated',
      backLegal: '← Legal'
    },
    chainOfCustodyPage: {
      title: 'Chain of custody',
      subtitle: 'Record holder, witness, and agency handoffs with Bitcoin-anchored hashes.',
      fields: { holder: 'Holder name', witness: 'Witness', agency: 'Receiving agency' },
      recordStep: 'Record custody step',
      exportJson: 'Export custody log',
      history: 'Custody history'
    },
    stampPage: {
      modes: { single: 'Single file', capsule: 'Capsule', redact: 'ZK-Redact', deposition: 'Deposition' },
      takePhoto: 'Take photo',
      chooseFile: 'Choose file',
      confirmedToast: 'Confirmed on Bitcoin!',
      stampFailed: 'Stamping failed',
      feeUnavailable: 'Fee estimates unavailable'
    },
    vaultPage: {
      securityAge: { motion: 'In Motion', operational: 'Operational', archival: 'Archival' },
      loadMore: 'Load more stamps',
      actions: { badge: 'Badge', raw: 'Raw', ots: 'OTS', verify: 'Verify' },
      empty: { title: 'No proofs yet', body: 'Stamp a document to see it here.' }
    },
    widgetsPage: {
      preview: { v3Title: 'v3 white-label preview' },
      embed: {
        v3Label: 'Proof DNA v3 (white-label)',
        attrs: {
          hash: 'data-hash — 64-char SHA-256 hex (required)',
          size: 'data-size — sm | md',
          verify: 'data-verify — custom verification URL',
          label: 'data-label — accessible badge title',
          theme: 'data-theme — noir | light (v3 only)',
          domain: 'data-domain — white-label partner domain (v3)'
        }
      }
    },
    vaultPage: {
      revoke: {
        title: 'Revoke proof',
        body: 'This permanently marks the record as revoked. The Bitcoin anchor remains immutable.',
        confirm: 'Confirm revoke',
        cancel: 'Cancel'
      }
    },
    comparisonPage: { mobileHint: 'Swipe to compare columns on small screens.' },
    nav: { government: 'Government', batchHash: 'Batch hash', widgets: 'Widgets' }
  },
  es: {
    legalPages: { termsTitle: 'Términos de Servicio', privacyTitle: 'Política de Privacidad', cryptoTitle: 'Aviso de Criptomonedas', disclaimer: 'No es asesoramiento legal.', lastUpdated: 'Última actualización', backLegal: '← Legal' },
    chainOfCustodyPage: { title: 'Cadena de custodia', subtitle: 'Registre entregas con hashes anclados a Bitcoin.', fields: { holder: 'Titular', witness: 'Testigo', agency: 'Agencia receptora' }, recordStep: 'Registrar paso', exportJson: 'Exportar registro', history: 'Historial' },
    stampPage: { modes: { single: 'Archivo único', capsule: 'Cápsula', redact: 'ZK-Redact', deposition: 'Deposición' }, takePhoto: 'Tomar foto', chooseFile: 'Elegir archivo', confirmedToast: '¡Confirmado en Bitcoin!', stampFailed: 'Sellado fallido', feeUnavailable: 'Tarifas no disponibles' },
    vaultPage: { securityAge: { motion: 'En movimiento', operational: 'Operacional', archival: 'Archivo' }, loadMore: 'Cargar más', actions: { badge: 'Insignia', raw: 'Raw', ots: 'OTS', verify: 'Verificar' }, empty: { title: 'Sin pruebas', body: 'Selle un documento para verlo aquí.' } },
    widgetsPage: { preview: { v3Title: 'v3 preview' }, embed: { v3Label: 'Proof DNA v3', attrs: { hash: 'data-hash', size: 'data-size', verify: 'data-verify', label: 'data-label', theme: 'data-theme', domain: 'data-domain' } } },
    comparisonPage: { mobileHint: 'Desliza para comparar columnas.' },
    nav: { government: 'Gobierno', batchHash: 'Hash por lotes', widgets: 'Widgets' }
  },
  fr: {
    legalPages: { termsTitle: 'Conditions d\'Utilisation', privacyTitle: 'Politique de Confidentialité', cryptoTitle: 'Avis Cryptomonnaie', disclaimer: 'Pas un conseil juridique.', lastUpdated: 'Dernière mise à jour', backLegal: '← Légal' },
    chainOfCustodyPage: { title: 'Chaîne de custody', subtitle: 'Enregistrez les transferts avec hashes Bitcoin.', fields: { holder: 'Détenteur', witness: 'Témoin', agency: 'Agence' }, recordStep: 'Enregistrer', exportJson: 'Exporter', history: 'Historique' },
    stampPage: { modes: { single: 'Fichier unique', capsule: 'Capsule', redact: 'ZK-Redact', deposition: 'Déposition' }, takePhoto: 'Prendre photo', chooseFile: 'Choisir fichier', confirmedToast: 'Confirmé sur Bitcoin !', stampFailed: 'Échec', feeUnavailable: 'Frais indisponibles' },
    vaultPage: { securityAge: { motion: 'En cours', operational: 'Opérationnel', archival: 'Archivage' }, loadMore: 'Charger plus', actions: { badge: 'Badge', raw: 'Raw', ots: 'OTS', verify: 'Vérifier' }, empty: { title: 'Aucune preuve', body: 'Tamponnez un document.' } },
    widgetsPage: { preview: { v3Title: 'v3 preview' }, embed: { v3Label: 'Proof DNA v3', attrs: { hash: 'data-hash', size: 'data-size', verify: 'data-verify', label: 'data-label', theme: 'data-theme', domain: 'data-domain' } } },
    comparisonPage: { mobileHint: 'Desliza para comparar columnas.' },
    nav: { government: 'Gouvernement', batchHash: 'Hash par lots', widgets: 'Widgets' }
  },
  de: {
    legalPages: { termsTitle: 'Nutzungsbedingungen', privacyTitle: 'Datenschutz', cryptoTitle: 'Krypto-Hinweis', disclaimer: 'Keine Rechtsberatung.', lastUpdated: 'Zuletzt aktualisiert', backLegal: '← Rechtliches' },
    chainOfCustodyPage: { title: 'Chain of Custody', subtitle: 'Übergaben mit Bitcoin-Hashes erfassen.', fields: { holder: 'Inhaber', witness: 'Zeuge', agency: 'Behörde' }, recordStep: 'Schritt erfassen', exportJson: 'Exportieren', history: 'Verlauf' },
    stampPage: { modes: { single: 'Einzeldatei', capsule: 'Kapsel', redact: 'ZK-Redact', deposition: 'Deposition' }, takePhoto: 'Foto aufnehmen', chooseFile: 'Datei wählen', confirmedToast: 'Auf Bitcoin bestätigt!', stampFailed: 'Stempeln fehlgeschlagen', feeUnavailable: 'Gebühren nicht verfügbar' },
    vaultPage: { securityAge: { motion: 'In Bewegung', operational: 'Betrieb', archival: 'Archiv' }, loadMore: 'Mehr laden', actions: { badge: 'Badge', raw: 'Raw', ots: 'OTS', verify: 'Prüfen' }, empty: { title: 'Keine Nachweise', body: 'Dokument stempeln.' } },
    widgetsPage: { preview: { v3Title: 'v3 preview' }, embed: { v3Label: 'Proof DNA v3', attrs: { hash: 'data-hash', size: 'data-size', verify: 'data-verify', label: 'data-label', theme: 'data-theme', domain: 'data-domain' } } },
    comparisonPage: { mobileHint: 'Desliza para comparar columnas.' },
    nav: { government: 'Behörden', batchHash: 'Batch-Hash', widgets: 'Widgets' }
  },
  pt: {
    legalPages: { termsTitle: 'Termos de Serviço', privacyTitle: 'Política de Privacidade', cryptoTitle: 'Aviso de Criptomoeda', disclaimer: 'Não é aconselhamento jurídico.', lastUpdated: 'Última atualização', backLegal: '← Legal' },
    chainOfCustodyPage: { title: 'Cadeia de custódia', subtitle: 'Registre handoffs com hashes Bitcoin.', fields: { holder: 'Titular', witness: 'Testemunha', agency: 'Agência' }, recordStep: 'Registrar passo', exportJson: 'Exportar', history: 'Histórico' },
    stampPage: { modes: { single: 'Arquivo único', capsule: 'Cápsula', redact: 'ZK-Redact', deposition: 'Deposição' }, takePhoto: 'Tirar foto', chooseFile: 'Escolher arquivo', confirmedToast: 'Confirmado no Bitcoin!', stampFailed: 'Falha ao carimbar', feeUnavailable: 'Taxas indisponíveis' },
    vaultPage: { securityAge: { motion: 'Em movimento', operational: 'Operacional', archival: 'Arquivo' }, loadMore: 'Carregar mais', actions: { badge: 'Badge', raw: 'Raw', ots: 'OTS', verify: 'Verificar' }, empty: { title: 'Sem provas', body: 'Carimbe um documento.' } },
    widgetsPage: { preview: { v3Title: 'v3 preview' }, embed: { v3Label: 'Proof DNA v3', attrs: { hash: 'data-hash', size: 'data-size', verify: 'data-verify', label: 'data-label', theme: 'data-theme', domain: 'data-domain' } } },
    comparisonPage: { mobileHint: 'Desliza para comparar columnas.' },
    nav: { government: 'Governo', batchHash: 'Hash em lote', widgets: 'Widgets' }
  },
  sw: {
    legalPages: { termsTitle: 'Masharti ya Huduma', privacyTitle: 'Sera ya Faragha', cryptoTitle: 'Taarifa ya Crypto', disclaimer: 'Si ushauri wa kisheria.', lastUpdated: 'Imesasishwa', backLegal: '← Kisheria' },
    chainOfCustodyPage: { title: 'Mnyororo wa usimamizi', subtitle: 'Rekodi uhamisho na hashes za Bitcoin.', fields: { holder: 'Mmiliki', witness: 'Shahidi', agency: 'Wakala' }, recordStep: 'Rekodi hatua', exportJson: 'Hamisha', history: 'Historia' },
    stampPage: { modes: { single: 'Faili moja', capsule: 'Kapsuli', redact: 'ZK-Redact', deposition: 'Ushahidi' }, takePhoto: 'Piga picha', chooseFile: 'Chagua faili', confirmedToast: 'Imethibitishwa kwenye Bitcoin!', stampFailed: 'Imeshindwa', feeUnavailable: 'Ada hazipatikani' },
    vaultPage: { securityAge: { motion: 'Inaendelea', operational: 'Inafanya kazi', archival: 'Hifadhi' }, loadMore: 'Pakia zaidi', actions: { badge: 'Beji', raw: 'Raw', ots: 'OTS', verify: 'Thibitisha' }, empty: { title: 'Hakuna uthibitisho', body: 'Weka muhuri wa hati.' } },
    widgetsPage: { preview: { v3Title: 'v3 preview' }, embed: { v3Label: 'Proof DNA v3', attrs: { hash: 'data-hash', size: 'data-size', verify: 'data-verify', label: 'data-label', theme: 'data-theme', domain: 'data-domain' } } },
    comparisonPage: { mobileHint: 'Desliza para comparar columnas.' },
    nav: { government: 'Serikali', batchHash: 'Batch hash', widgets: 'Widgets' }
  },
  zh: {
    legalPages: { termsTitle: '服务条款', privacyTitle: '隐私政策', cryptoTitle: '加密货币声明', disclaimer: '非法律建议。', lastUpdated: '最后更新', backLegal: '← 法律' },
    chainOfCustodyPage: { title: '保管链', subtitle: '用比特币锚定哈希记录交接。', fields: { holder: '持有人', witness: '见证人', agency: '接收机构' }, recordStep: '记录步骤', exportJson: '导出日志', history: '历史记录' },
    stampPage: { modes: { single: '单文件', capsule: '胶囊', redact: 'ZK-脱敏', deposition: '证词' }, takePhoto: '拍照', chooseFile: '选择文件', confirmedToast: '已在比特币上确认！', stampFailed: '盖章失败', feeUnavailable: '费用不可用' },
    vaultPage: { securityAge: { motion: '进行中', operational: '运行中', archival: '归档' }, loadMore: '加载更多', actions: { badge: '徽章', raw: '原始', ots: 'OTS', verify: '验证' }, empty: { title: '暂无证明', body: '盖章文档后将显示在此。' } },
    widgetsPage: { preview: { v3Title: 'v3 preview' }, embed: { v3Label: 'Proof DNA v3', attrs: { hash: 'data-hash', size: 'data-size', verify: 'data-verify', label: 'data-label', theme: 'data-theme', domain: 'data-domain' } } },
    comparisonPage: { mobileHint: 'Desliza para comparar columnas.' },
    nav: { government: '政府', batchHash: '批量哈希', widgets: '小组件' }
  }
}

function deepMerge(t, s) {
  for (const k of Object.keys(s)) {
    if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k])) {
      const base = typeof t[k] === 'object' && t[k] && !Array.isArray(t[k]) ? t[k] : {}
      t[k] = deepMerge(base, s[k])
    } else t[k] = s[k]
  }
  return t
}

for (const lang of LANGS) {
  const p = join(root, `pages.${lang}.json`)
  const data = JSON.parse(readFileSync(p, 'utf8'))
  deepMerge(data, PATCH[lang])
  writeFileSync(p, JSON.stringify(data, null, 2) + '\n')
  console.log('patched', p)
}