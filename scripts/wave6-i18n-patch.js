#!/usr/bin/env node
/**
 * Merge Wave 6–8 i18n keys into all marketing locale files.
 * Run: node scripts/wave6-i18n-patch.js
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', 'src', 'i18n', 'marketing')

const LANGS = ['en', 'es', 'fr', 'de', 'pt', 'sw', 'zh']

const PATCH = {
  en: {
    staticMode: {
      title: 'Browser verification mode',
      body: 'Hashing, vault, and OpenTimestamps stamping run in your browser via public calendars. Optional api.satohash.io adds hosted sync, OG cards, and fleet analytics.',
      trustLink: 'Trust & compliance →',
      stampQueued:
        'Hash saved locally. Browser OTS will retry on sync — or stamp now via public calendars.',
      verifyStructural:
        'Structural .ots check passed. Full Bitcoin attestation: use browser verify or opentimestamps.org.'
    },
    proofTimeline: {
      hashed: 'Hashed locally',
      submitted: 'Submitted to calendar',
      pending: 'Pending Bitcoin block',
      confirmed: 'Confirmed on-chain',
      ariaLabel: 'Proof lifecycle'
    },
    stampPage: {
      motopassLoaded: 'MotoPass hash loaded',
      motopassDesc:
        'Upload the matching file to complete stamping, or stamp hash via public calendars.',
      linkedHashReady: 'MotoPass / linked hash ready — stamp to OpenTimestamps without re-uploading a file.',
      stampHashBtn: 'Stamp hash via public calendars',
      step1Label: 'Drop Your File',
      step1Desc: 'Any format. Stays on your device — never uploaded.',
      step2Label: 'We Hash It Locally',
      step2Desc: 'A unique SHA-256 fingerprint is computed in your browser.',
      step3Label: 'Bitcoin Timestamps It',
      step3Desc: 'The fingerprint is permanently written to the blockchain.',
      takePhoto: 'Take photo',
      chooseFile: 'Choose file'
    },
    verifyPublicPage: {
      validFingerprint: 'Valid fingerprint',
      hashOnlyMessage:
        'Valid SHA-256 fingerprint. Bitcoin attestation not found in local vault — API or .ots file required for full proof.',
      localVault: 'Loaded from your local vault on this device.',
      exportVc: 'Export verifiable credential'
    },
    trustPage: {
      backSecurity: '← Security overview',
      heroTitle: 'Trust Center',
      heroSubtitle:
        'Zero-knowledge architecture, open-source auditability, and global legal compatibility for institutional provenance.',
      complianceTitle: 'Legal & Regulatory Framework',
      securityLink: 'Security deep-dive →',
      procurementTitle: 'Procurement & diligence',
      procurementBody:
        'Download the executive pitch, security overview, and MotoPass integration guide for vendor review.',
      procurementCta: 'View diligence pack',
      printGuide: 'Print verification guide for officials'
    },
    governmentPage: {
      backTrust: '← Trust Center',
      backGovernment: '← Government use',
      learnMore: 'Learn more',
      readyStamp: 'Ready to stamp?',
      readyStampDesc: 'Use passport attestation templates or batch-hash an entire program roster.',
      stampNow: 'Stamp now',
      batchHash: 'Batch hash registry',
      procurementTitle: 'Procurement one-pager',
      procurementBody:
        'Air-gapped hashing, data residency in-browser, chain-of-custody workflows, and MotoPass deep-links for passport programs.'
    },
    governmentUse: {
      title: 'Government & Diplomatic Use',
      titleHighlight: 'Diplomatic Use',
      subtitle:
        'Zero-knowledge timestamps for passports, national IDs, land titles, and distressed-asset programs. Documents never leave the device — only SHA-256 fingerprints reach OpenTimestamps calendars.',
      passport: { title: 'Passport & travel programs', body: 'MotoPass hashes application payloads client-side; Satohash anchors fingerprints to Bitcoin without uploading biometrics.' },
      distressed: { title: 'Distressed sovereign assets', body: 'Listings carry content hashes and optional .ots proofs for cross-border trade transparency.' },
      custody: { title: 'Chain of custody', body: 'Holder → witness → agency workflow with timestamped handoff records.' },
      admissibility: { title: 'Evidence admissibility', body: 'Jurisdiction matrix for hash-based evidence (UETA, eIDAS, UK, Seychelles).' }
    },
    motopassVerifyPage: {
      title: 'Verify MotoPass application hash',
      subtitle:
        'Paste SHA-256 hashes from motopass.giveabit.io applications. Satohash validates format and links to independent verification.',
      placeholder: 'One 64-character hex hash per line…',
      validate: 'Validate hashes',
      publicVerify: 'Public verify page',
      verifyTool: 'Verify tool (?hash=)',
      completeStamp: 'Complete stamp',
      toastNeedHash: 'Paste at least one valid SHA-256 hash'
    },
    batchHashPage: {
      title: 'Batch hash registry',
      subtitle:
        'Register hundreds of passport or asset fingerprints locally. Export CSV for agency audit; stamp individually from vault when ready.',
      placeholder: 'One SHA-256 per line…',
      register: 'Register hashes',
      exportCsv: 'Export CSV',
      importCsv: 'Import CSV'
    },
    chainOfCustodyPage: { title: 'Chain of custody timestamp', subtitle: 'Record holder, witness, and agency handoffs with Bitcoin-anchored hashes.' },
    evidenceAdmissibilityPage: { title: 'Evidence admissibility guide', subtitle: 'Jurisdiction matrix for hash-based evidence under UETA, eIDAS, UK, and cross-border law.' },
    distressedAssetPage: {
      title: 'Distressed asset attestation',
      subtitle: 'Hash listing metadata for sovereign asset trades. Pair with hosted .ots from MotoPass distressed listings.',
      stampListing: 'Stamp listing hash',
      compareHosted: 'Compare to hosted proof',
      hostedPlaceholder: 'Hosted .ots URL on motopass or CDN'
    },
    templateDetailPage: { notFound: 'Template not found', loadError: 'Could not load template', demoBadge: 'Demo data' },
    legalPages: {
      privacyTitle: 'Privacy Policy',
      termsTitle: 'Terms of Service',
      cryptoTitle: 'Cryptocurrency Notice'
    }
  },
  es: {
    staticMode: { title: 'Modo de verificación en navegador', body: 'El hash, la bóveda y el sellado OpenTimestamps se ejecutan en su navegador mediante calendarios públicos.', trustLink: 'Confianza y cumplimiento →', stampQueued: 'Hash guardado localmente. OTS del navegador reintentará al sincronizar.', verifyStructural: 'Comprobación estructural .ots aprobada. Atestación Bitcoin completa: use verificación en navegador u opentimestamps.org.' },
    proofTimeline: { hashed: 'Hasheado localmente', submitted: 'Enviado al calendario', pending: 'Bloque Bitcoin pendiente', confirmed: 'Confirmado en cadena', ariaLabel: 'Ciclo de vida de la prueba' },
    trustPage: { backSecurity: '← Resumen de seguridad', heroTitle: 'Centro de Confianza', heroSubtitle: 'Arquitectura de conocimiento cero, auditoría de código abierto y compatibilidad legal global.', complianceTitle: 'Marco legal y regulatorio', securityLink: 'Profundidad de seguridad →', procurementTitle: 'Adquisiciones y diligencia', procurementBody: 'Descargue el pitch ejecutivo y la guía de integración MotoPass para revisión de proveedores.', procurementCta: 'Ver paquete de diligencia', printGuide: 'Guía de verificación para funcionarios' },
    governmentPage: { backTrust: '← Centro de Confianza', backGovernment: '← Uso gubernamental', learnMore: 'Saber más', readyStamp: '¿Listo para sellar?', readyStampDesc: 'Use plantillas de pasaporte o registro por lotes.', stampNow: 'Sellar ahora', batchHash: 'Registro por lotes', procurementTitle: 'Resumen de adquisiciones', procurementBody: 'Hashing air-gap, residencia de datos en navegador, cadena de custodia y enlaces MotoPass.' },
    governmentUse: { title: 'Uso Gubernamental y Diplomático', titleHighlight: 'Diplomático', subtitle: 'Sellos de conocimiento cero para pasaportes, identidades y activos en distress. Los documentos nunca salen del dispositivo.', passport: { title: 'Pasaportes y viajes', body: 'MotoPass hashea solicitudes en el cliente; Satohash ancla huellas en Bitcoin sin biometría.' }, distressed: { title: 'Activos soberanos en distress', body: 'Listados con hashes de contenido y pruebas .ots opcionales.' }, custody: { title: 'Cadena de custodia', body: 'Flujo titular → testigo → agencia con registros sellados.' }, admissibility: { title: 'Admisibilidad de pruebas', body: 'Matriz jurisdiccional (UETA, eIDAS, UK, Seychelles).' } },
    motopassVerifyPage: { title: 'Verificar hash de solicitud MotoPass', subtitle: 'Pegue hashes SHA-256 de motopass.giveabit.io.', placeholder: 'Un hash hex de 64 caracteres por línea…', validate: 'Validar hashes', publicVerify: 'Página pública', verifyTool: 'Herramienta (?hash=)', completeStamp: 'Completar sello', toastNeedHash: 'Pegue al menos un hash SHA-256 válido' },
    batchHashPage: { title: 'Registro por lotes', subtitle: 'Registre cientos de huellas localmente. Exporte CSV para auditoría.', placeholder: 'Un SHA-256 por línea…', register: 'Registrar hashes', exportCsv: 'Exportar CSV', importCsv: 'Importar CSV' }
  },
  fr: {
    staticMode: { title: 'Mode vérification navigateur', body: 'Hachage, coffre et horodatage OTS via calendriers publics dans votre navigateur.', trustLink: 'Confiance et conformité →', stampQueued: 'Hash enregistré localement.', verifyStructural: 'Vérification structurelle .ots réussie.' },
    proofTimeline: { hashed: 'Hashé localement', submitted: 'Soumis au calendrier', pending: 'Bloc Bitcoin en attente', confirmed: 'Confirmé on-chain', ariaLabel: 'Cycle de vie de la preuve' },
    trustPage: { backSecurity: '← Aperçu sécurité', heroTitle: 'Centre de Confiance', heroSubtitle: 'Architecture zéro connaissance et compatibilité juridique mondiale.', complianceTitle: 'Cadre juridique', securityLink: 'Approfondissement sécurité →', procurementTitle: 'Achats et diligence', procurementBody: 'Téléchargez le pitch exécutif et le guide MotoPass.', procurementCta: 'Pack diligence', printGuide: 'Guide pour agents frontière' },
    governmentPage: { backTrust: '← Centre de Confiance', backGovernment: '← Usage gouvernemental', learnMore: 'En savoir plus', readyStamp: 'Prêt à tamponner ?', readyStampDesc: 'Modèles passeport ou registre par lots.', stampNow: 'Tamponner', batchHash: 'Registre par lots', procurementTitle: 'Fiche achats', procurementBody: 'Hachage air-gap, données en navigateur, chaîne de custody MotoPass.' },
    governmentUse: { title: 'Usage Gouvernemental et Diplomatique', titleHighlight: 'Diplomatique', subtitle: 'Horodatages zéro connaissance pour passeports et actifs souverains.', passport: { title: 'Passeports et voyages', body: 'MotoPass hache côté client; Satohash ancre sur Bitcoin.' }, distressed: { title: 'Actifs en détresse', body: 'Listings avec hashes et preuves .ots.' }, custody: { title: 'Chaîne de custody', body: 'Titulaire → témoin → agence.' }, admissibility: { title: 'Admissibilité des preuves', body: 'Matrice UETA, eIDAS, UK, Seychelles.' } },
    motopassVerifyPage: { title: 'Vérifier hash MotoPass', subtitle: 'Collez les hashes SHA-256 de motopass.giveabit.io.', placeholder: 'Un hash hex par ligne…', validate: 'Valider', publicVerify: 'Page publique', verifyTool: 'Outil (?hash=)', completeStamp: 'Compléter', toastNeedHash: 'Collez au moins un hash valide' },
    batchHashPage: { title: 'Registre par lots', subtitle: 'Enregistrez des centaines de fingerprints localement.', placeholder: 'Un SHA-256 par ligne…', register: 'Enregistrer', exportCsv: 'Exporter CSV', importCsv: 'Importer CSV' }
  },
  de: {
    staticMode: { title: 'Browser-Verifizierungsmodus', body: 'Hashing, Tresor und OTS-Stempelung laufen im Browser über öffentliche Kalender.', trustLink: 'Vertrauen & Compliance →', stampQueued: 'Hash lokal gespeichert.', verifyStructural: 'Strukturelle .ots-Prüfung bestanden.' },
    proofTimeline: { hashed: 'Lokal gehasht', submitted: 'An Kalender gesendet', pending: 'Bitcoin-Block ausstehend', confirmed: 'On-Chain bestätigt', ariaLabel: 'Proof-Lebenszyklus' },
    trustPage: { backSecurity: '← Sicherheitsübersicht', heroTitle: 'Trust Center', heroSubtitle: 'Zero-Knowledge-Architektur und globale Rechtskompatibilität.', complianceTitle: 'Rechtsrahmen', securityLink: 'Sicherheit im Detail →', procurementTitle: 'Beschaffung', procurementBody: 'Executive Pitch und MotoPass-Leitfaden herunterladen.', procurementCta: 'Diligence-Paket', printGuide: 'Verifizierungsleitfaden für Beamte' },
    governmentPage: { backTrust: '← Trust Center', backGovernment: '← Behörden', learnMore: 'Mehr erfahren', readyStamp: 'Bereit zum Stempeln?', readyStampDesc: 'Passvorlagen oder Batch-Hash nutzen.', stampNow: 'Jetzt stempeln', batchHash: 'Batch-Register', procurementTitle: 'Beschaffungsübersicht', procurementBody: 'Air-Gap-Hashing, Daten im Browser, MotoPass-Deep-Links.' },
    governmentUse: { title: 'Behörden & Diplomatischer Einsatz', titleHighlight: 'Diplomatisch', subtitle: 'Zero-Knowledge-Zeitstempel für Pässe und Staatsanlagen.', passport: { title: 'Reisepässe & Programme', body: 'MotoPass hasht clientseitig; Satohash verankert auf Bitcoin.' }, distressed: { title: 'Distressed Assets', body: 'Listings mit Content-Hashes und .ots.' }, custody: { title: 'Chain of Custody', body: 'Inhaber → Zeuge → Behörde.' }, admissibility: { title: 'Beweisadmissibilität', body: 'Matrix UETA, eIDAS, UK, Seychelles.' } },
    motopassVerifyPage: { title: 'MotoPass-Hash prüfen', subtitle: 'SHA-256-Hashes von motopass.giveabit.io einfügen.', placeholder: 'Ein 64-Zeichen-Hex pro Zeile…', validate: 'Hashes prüfen', publicVerify: 'Öffentliche Seite', verifyTool: 'Tool (?hash=)', completeStamp: 'Stempel abschließen', toastNeedHash: 'Mindestens einen gültigen Hash einfügen' },
    batchHashPage: { title: 'Batch-Hash-Register', subtitle: 'Hunderte Fingerabdrücke lokal registrieren.', placeholder: 'Ein SHA-256 pro Zeile…', register: 'Registrieren', exportCsv: 'CSV exportieren', importCsv: 'CSV importieren' }
  },
  pt: {
    staticMode: { title: 'Modo de verificação no navegador', body: 'Hash, cofre e carimbo OTS via calendários públicos no seu navegador.', trustLink: 'Confiança e conformidade →', stampQueued: 'Hash salvo localmente.', verifyStructural: 'Verificação estrutural .ots aprovada.' },
    proofTimeline: { hashed: 'Hash local', submitted: 'Enviado ao calendário', pending: 'Bloco Bitcoin pendente', confirmed: 'Confirmado on-chain', ariaLabel: 'Ciclo de vida da prova' },
    trustPage: { backSecurity: '← Visão de segurança', heroTitle: 'Centro de Confiança', heroSubtitle: 'Arquitetura zero-conhecimento e compatibilidade legal global.', complianceTitle: 'Marco legal', securityLink: 'Segurança em detalhe →', procurementTitle: 'Aquisições', procurementBody: 'Baixe o pitch executivo e guia MotoPass.', procurementCta: 'Pacote de diligência', printGuide: 'Guia para agentes' },
    governmentPage: { backTrust: '← Centro de Confiança', backGovernment: '← Uso governamental', learnMore: 'Saiba mais', readyStamp: 'Pronto para carimbar?', readyStampDesc: 'Modelos de passaporte ou registro em lote.', stampNow: 'Carimbar agora', batchHash: 'Registro em lote', procurementTitle: 'Resumo de aquisições', procurementBody: 'Hashing air-gap, dados no navegador, MotoPass.' },
    governmentUse: { title: 'Uso Governamental e Diplomático', titleHighlight: 'Diplomático', subtitle: 'Carimbos zero-conhecimento para passaportes e ativos soberanos.', passport: { title: 'Passaportes e viagens', body: 'MotoPass faz hash no cliente; Satohash ancora no Bitcoin.' }, distressed: { title: 'Ativos distressed', body: 'Listagens com hashes e .ots.' }, custody: { title: 'Cadeia de custódia', body: 'Titular → testemunha → agência.' }, admissibility: { title: 'Admissibilidade', body: 'Matriz UETA, eIDAS, UK, Seychelles.' } },
    motopassVerifyPage: { title: 'Verificar hash MotoPass', subtitle: 'Cole hashes SHA-256 de motopass.giveabit.io.', placeholder: 'Um hash hex por linha…', validate: 'Validar', publicVerify: 'Página pública', verifyTool: 'Ferramenta (?hash=)', completeStamp: 'Completar', toastNeedHash: 'Cole pelo menos um hash válido' },
    batchHashPage: { title: 'Registro em lote', subtitle: 'Registre centenas de fingerprints localmente.', placeholder: 'Um SHA-256 por linha…', register: 'Registrar', exportCsv: 'Exportar CSV', importCsv: 'Importar CSV' }
  },
  sw: {
    staticMode: { title: 'Hali ya uthibitishaji kwenye kivinjari', body: 'Hashing, vault na OTS hufanyika kwenye kivinjari kupitia kalenda za umma.', trustLink: 'Uaminifu na utii →', stampQueued: 'Hash imehifadhiwa ndani.', verifyStructural: 'Ukaguzi wa muundo wa .ots umepita.' },
    proofTimeline: { hashed: 'Ime-hash ndani', submitted: 'Imewasilishwa kwenye kalenda', pending: 'Block ya Bitcoin inasubiri', confirmed: 'Imethibitishwa on-chain', ariaLabel: 'Mzunguko wa uthibitisho' },
    trustPage: { backSecurity: '← Muhtasari wa usalama', heroTitle: 'Kituo cha Uaminifu', heroSubtitle: 'Usanifu wa ujuzi wa sifuri na utangamano wa kisheria.', complianceTitle: 'Mfumo wa kisheria', securityLink: 'Usalama kwa kina →', procurementTitle: 'Ununuzi', procurementBody: 'Pakua pitch na mwongozo wa MotoPass.', procurementCta: 'Kifurushi cha diligence', printGuide: 'Mwongozo wa wakuu wa mpaka' },
    governmentPage: { backTrust: '← Kituo cha Uaminifu', backGovernment: '← Matumizi ya serikali', learnMore: 'Jifunze zaidi', readyStamp: 'Tayari kuhifadhi?', readyStampDesc: 'Violezo vya pasipoti au batch hash.', stampNow: 'Hifadhi sasa', batchHash: 'Rejista ya batch', procurementTitle: 'Muhtasari wa ununuzi', procurementBody: 'Hashing air-gap, data kwenye kivinjari, MotoPass.' },
    governmentUse: { title: 'Matumizi ya Serikali na Kidiplomasia', titleHighlight: 'Kidiplomasia', subtitle: 'Muhuri wa ujuzi wa sifuri kwa pasipoti na mali za serikali.', passport: { title: 'Pasipoti na safari', body: 'MotoPass ina-hash upande wa mteja; Satohash inafunga kwenye Bitcoin.' }, distressed: { title: 'Mali distressed', body: 'Orodha zenye hashes na .ots.' }, custody: { title: 'Mnyororo wa usimamizi', body: 'Mmiliki → shahidi → wakala.' }, admissibility: { title: 'Ukubalike wa ushahidi', body: 'Matrix UETA, eIDAS, UK, Seychelles.' } },
    motopassVerifyPage: { title: 'Thibitisha hash ya MotoPass', subtitle: 'Bandika hashes SHA-256 kutoka motopass.giveabit.io.', placeholder: 'Hash hex moja kwa kila mstari…', validate: 'Thibitisha', publicVerify: 'Ukurasa wa umma', verifyTool: 'Zana (?hash=)', completeStamp: 'Kamilisha', toastNeedHash: 'Bandika angalau hash moja halali' },
    batchHashPage: { title: 'Rejista ya batch hash', subtitle: 'Sajili mamia ya fingerprints ndani.', placeholder: 'SHA-256 moja kwa mstari…', register: 'Sajili', exportCsv: 'Hamisha CSV', importCsv: 'Ingiza CSV' }
  },
  zh: {
    staticMode: { title: '浏览器验证模式', body: '哈希、保险库和 OTS 盖章通过公共日历在浏览器中运行。', trustLink: '信任与合规 →', stampQueued: '哈希已本地保存。', verifyStructural: '结构性 .ots 检查通过。' },
    proofTimeline: { hashed: '本地哈希', submitted: '已提交日历', pending: '等待比特币区块', confirmed: '链上确认', ariaLabel: '证明生命周期' },
    trustPage: { backSecurity: '← 安全概览', heroTitle: '信任中心', heroSubtitle: '零知识架构与全球法律兼容性。', complianceTitle: '法律与监管框架', securityLink: '安全深度解读 →', procurementTitle: '采购与尽职调查', procurementBody: '下载执行推介和 MotoPass 集成指南。', procurementCta: '查看尽职调查包', printGuide: '边境官员验证指南' },
    governmentPage: { backTrust: '← 信任中心', backGovernment: '← 政府用途', learnMore: '了解更多', readyStamp: '准备盖章？', readyStampDesc: '使用护照模板或批量哈希。', stampNow: '立即盖章', batchHash: '批量哈希登记', procurementTitle: '采购一页纸', procurementBody: '气隙哈希、浏览器内数据驻留、MotoPass 深度链接。' },
    governmentUse: { title: '政府与外交用途', titleHighlight: '外交用途', subtitle: '护照和主权资产的零知识时间戳。文件永不离开设备。', passport: { title: '护照与旅行项目', body: 'MotoPass 客户端哈希；Satohash 锚定到比特币。' }, distressed: { title: '困境资产', body: '列表含内容哈希和 .ots 证明。' }, custody: { title: '保管链', body: '持有人 → 见证人 → 机构。' }, admissibility: { title: '证据可采性', body: 'UETA、eIDAS、英国、塞舌尔矩阵。' } },
    motopassVerifyPage: { title: '验证 MotoPass 申请哈希', subtitle: '粘贴 motopass.giveabit.io 的 SHA-256 哈希。', placeholder: '每行一个 64 字符十六进制哈希…', validate: '验证哈希', publicVerify: '公开验证页', verifyTool: '工具 (?hash=)', completeStamp: '完成盖章', toastNeedHash: '请粘贴至少一个有效哈希' },
    batchHashPage: { title: '批量哈希登记', subtitle: '本地登记数百个指纹。导出 CSV 供审计。', placeholder: '每行一个 SHA-256…', register: '登记哈希', exportCsv: '导出 CSV', importCsv: '导入 CSV' }
  }
}

function deepMerge(target, source) {
  for (const k of Object.keys(source)) {
    if (source[k] && typeof source[k] === 'object' && !Array.isArray(source[k])) {
      target[k] = deepMerge(target[k] || {}, source[k])
    } else {
      target[k] = source[k]
    }
  }
  return target
}

for (const lang of LANGS) {
  const path = join(root, `pages.${lang}.json`)
  const data = JSON.parse(readFileSync(path, 'utf8'))
  const patch = PATCH[lang] || PATCH.en
  deepMerge(data, patch)
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
  console.log('patched', path)
}

// FAQ institutional category + items (en only structure, copy to others)
const faqPatch = {
  en: { categories: { institutional: 'Institutional' }, items: [
    { id: 'procurement', category: 'institutional', q: 'How do we procure Satohash for government use?', a: 'Satohash runs as a static SPA on Cloudflare Pages with browser-only hashing. No document custody. Review our Trust Center, security overview, and MotoPass integration guide for diligence.' },
    { id: 'dataResidency', category: 'institutional', q: 'Where is data stored?', a: 'Document bytes never leave the user device. Only SHA-256 hashes and optional .ots proofs are stored in localStorage or your API when deployed.' },
    { id: 'airGap', category: 'institutional', q: 'Can we use Satohash air-gapped?', a: 'Yes. Hash files offline, transfer hashes via QR or CSV, and stamp via browser OTS calendars without api.satohash.io.' },
    { id: 'chainOfCustody', category: 'institutional', q: 'Does Satohash support chain of custody?', a: 'Use /chain-of-custody to record holder, witness, and agency handoffs with Bitcoin-anchored hashes.' }
  ]},
  es: { categories: { institutional: 'Institucional' }, items: [
    { id: 'procurement', category: 'institutional', q: '¿Cómo adquirimos Satohash para gobierno?', a: 'SPA estática con hashing en navegador. Sin custodia de documentos. Revise el Centro de Confianza y la guía MotoPass.' },
    { id: 'dataResidency', category: 'institutional', q: '¿Dónde se almacenan los datos?', a: 'Los archivos no salen del dispositivo. Solo hashes SHA-256 y pruebas .ots opcionales.' },
    { id: 'airGap', category: 'institutional', q: '¿Uso air-gap?', a: 'Sí. Hashee offline y selle vía calendarios OTS del navegador.' },
    { id: 'chainOfCustody', category: 'institutional', q: '¿Cadena de custodia?', a: 'Use /chain-of-custody para registros de entrega con hashes anclados a Bitcoin.' }
  ]},
  fr: { categories: { institutional: 'Institutionnel' }, items: [
    { id: 'procurement', category: 'institutional', q: 'Comment acquérir Satohash ?', a: 'SPA statique, hachage navigateur, pas de garde de documents.' },
    { id: 'dataResidency', category: 'institutional', q: 'Où sont les données ?', a: 'Les fichiers restent sur l\'appareil. Seuls les hashes et .ots.' },
    { id: 'airGap', category: 'institutional', q: 'Usage air-gap ?', a: 'Oui, hachage hors ligne et calendriers OTS navigateur.' },
    { id: 'chainOfCustody', category: 'institutional', q: 'Chaîne de custody ?', a: 'Utilisez /chain-of-custody pour les transferts horodatés.' }
  ]},
  de: { categories: { institutional: 'Institutionell' }, items: [
    { id: 'procurement', category: 'institutional', q: 'Beschaffung für Behörden?', a: 'Statische SPA, Browser-Hashing, keine Dokumentenhaltung.' },
    { id: 'dataResidency', category: 'institutional', q: 'Datenresidenz?', a: 'Dateien verlassen das Gerät nicht. Nur Hashes und .ots.' },
    { id: 'airGap', category: 'institutional', q: 'Air-Gap?', a: 'Ja, offline hashen und Browser-OTS-Kalender.' },
    { id: 'chainOfCustody', category: 'institutional', q: 'Chain of Custody?', a: '/chain-of-custody für Übergaben mit Bitcoin-Hashes.' }
  ]},
  pt: { categories: { institutional: 'Institucional' }, items: [
    { id: 'procurement', category: 'institutional', q: 'Como adquirir para governo?', a: 'SPA estática, hashing no navegador, sem custódia.' },
    { id: 'dataResidency', category: 'institutional', q: 'Onde ficam os dados?', a: 'Arquivos não saem do dispositivo.' },
    { id: 'airGap', category: 'institutional', q: 'Uso air-gap?', a: 'Sim, hash offline e calendários OTS.' },
    { id: 'chainOfCustody', category: 'institutional', q: 'Cadeia de custódia?', a: 'Use /chain-of-custody para handoffs.' }
  ]},
  sw: { categories: { institutional: 'Taasisi' }, items: [
    { id: 'procurement', category: 'institutional', q: 'Ununuzi kwa serikali?', a: 'SPA tuli, hashing kwenye kivinjari, hakuna uhifadhi wa hati.' },
    { id: 'dataResidency', category: 'institutional', q: 'Data iko wapi?', a: 'Faili haziondoki kwenye kifaa.' },
    { id: 'airGap', category: 'institutional', q: 'Air-gap?', a: 'Ndiyo, hash nje ya mtandao na kalenda OTS.' },
    { id: 'chainOfCustody', category: 'institutional', q: 'Mnyororo wa usimamizi?', a: 'Tumia /chain-of-custody kwa uhamisho.' }
  ]},
  zh: { categories: { institutional: '机构' }, items: [
    { id: 'procurement', category: 'institutional', q: '政府如何采购？', a: '静态 SPA，浏览器哈希，无文档托管。' },
    { id: 'dataResidency', category: 'institutional', q: '数据存储在哪？', a: '文件不离开设备，仅哈希和 .ots。' },
    { id: 'airGap', category: 'institutional', q: '可气隙使用？', a: '可以，离线哈希后通过浏览器 OTS 日历盖章。' },
    { id: 'chainOfCustody', category: 'institutional', q: '保管链？', a: '使用 /chain-of-custody 记录交接。' }
  ]}
}

for (const lang of LANGS) {
  const path = join(root, `faq.${lang}.json`)
  const data = JSON.parse(readFileSync(path, 'utf8'))
  const p = faqPatch[lang]
  data.categories = { ...data.categories, ...p.categories }
  const ids = new Set(data.items.map((i) => i.id))
  for (const item of p.items) {
    if (!ids.has(item.id)) data.items.push(item)
  }
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n')
  console.log('patched faq', path)
}

console.log('done')