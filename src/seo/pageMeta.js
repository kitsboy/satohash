import { LANG_CODES } from '../i18n/language.js'

/** Localized SEO titles & descriptions — Build 37 */
export const SUPPORTED_LOCALES = LANG_CODES

export const HREFLANG = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  pt: 'pt',
  sw: 'sw',
  zh: 'zh-Hans'
}

const OG_LOCALE = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  pt: 'pt_BR',
  sw: 'sw_KE',
  zh: 'zh_CN'
}

export const pageMeta = {
  landing: {
    en: {
      title: 'Stamp Documents on Bitcoin — Free Proof of Existence',
      description:
        'Drop any file. Get a Bitcoin-anchored proof of existence in under 60 seconds. Free, private, zero-knowledge. Your file never leaves your device.'
    },
    es: {
      title: 'Sella Documentos en Bitcoin — Prueba Gratuita de Existencia',
      description:
        'Sube cualquier archivo. Obtén una prueba de existencia anclada en Bitcoin en menos de 60 segundos. Gratis, privado, conocimiento cero.'
    },
    fr: {
      title: 'Tamponnez des Documents sur Bitcoin — Preuve Gratuite',
      description:
        "Déposez un fichier. Obtenez une preuve d'existence ancrée sur Bitcoin en moins de 60 secondes. Gratuit, privé, zéro connaissance."
    },
    de: {
      title: 'Dokumente auf Bitcoin versiegeln — Kostenloser Existenznachweis',
      description:
        'Datei ablegen. Bitcoin-verankerten Existenznachweis in unter 60 Sekunden. Kostenlos, privat, Zero-Knowledge.'
    },
    pt: {
      title: 'Carimbe Documentos no Bitcoin — Prova Gratuita de Existência',
      description:
        'Envie qualquer arquivo. Obtenha prova de existência ancorada no Bitcoin em menos de 60 segundos. Grátis, privado, zero-conhecimento.'
    },
    sw: {
      title: 'Weka Muhuri wa Hati kwenye Bitcoin — Ushahidi wa Bure',
      description:
        'Weka faili yoyote. Pata ushahidi wa kuwepo uliofungwa kwenye Bitcoin ndani ya sekunde 60. Bure, faragha, ujuzi wa sifuri.'
    },
    zh: {
      title: '在比特币上盖章文档 — 免费存在证明',
      description:
        '拖放任意文件。60秒内获得比特币锚定的存在证明。免费、私密、零知识。文件永不离开您的设备。'
    }
  },
  faq: {
    en: {
      title: 'FAQ — Bitcoin Document Notarization',
      description:
        'Answers about OpenTimestamps, zero-knowledge stamping, legal validity, NIP-05 identity, and the Satohash API.'
    },
    es: {
      title: 'Preguntas Frecuentes — Notarización Bitcoin',
      description:
        'Respuestas sobre OpenTimestamps, sellado zero-knowledge, validez legal, identidad NIP-05 y la API de Satohash.'
    },
    fr: {
      title: 'FAQ — Notarisation de Documents Bitcoin',
      description:
        'Réponses sur OpenTimestamps, tamponnage zéro connaissance, validité légale, identité NIP-05 et API Satohash.'
    },
    de: {
      title: 'FAQ — Bitcoin-Dokumentennotarisierung',
      description:
        'Antworten zu OpenTimestamps, Zero-Knowledge-Stempelung, Rechtsgültigkeit, NIP-05-Identität und Satohash-API.'
    },
    pt: {
      title: 'FAQ — Notarização de Documentos em Bitcoin',
      description:
        'Respostas sobre OpenTimestamps, carimbo zero-conhecimento, validade legal, identidade NIP-05 e API Satohash.'
    },
    sw: {
      title: 'Maswali — Uthibitishaji wa Hati za Bitcoin',
      description:
        'Majibu kuhusu OpenTimestamps, muhuri wa ujuzi wa sifuri, uhalali wa kisheria, utambulisho wa NIP-05 na API ya Satohash.'
    },
    zh: {
      title: '常见问题 — 比特币文件公证',
      description: '关于 OpenTimestamps、零知识盖章、法律效力、NIP-05 身份和 Satohash API 的解答。'
    }
  },
  pricing: {
    en: {
      title: 'Pricing — Free Bitcoin Timestamping',
      description:
        'Satohash basic stamping is free. Compare Free, Pro, and Enterprise tiers for API, BOLT-12, and institutional features.'
    },
    es: {
      title: 'Precios — Sellado Gratuito en Bitcoin',
      description:
        'El sellado básico de Satohash es gratis. Compare planes Free, Pro y Enterprise para API, BOLT-12 y funciones institucionales.'
    },
    fr: {
      title: 'Tarifs — Tamponnage Bitcoin Gratuit',
      description:
        "Le tamponnage de base Satohash est gratuit. Comparez Free, Pro et Enterprise pour l'API, BOLT-12 et les fonctions institutionnelles."
    },
    de: {
      title: 'Preise — Kostenlose Bitcoin-Zeitstempel',
      description:
        'Basis-Stempelung bei Satohash ist kostenlos. Vergleichen Sie Free, Pro und Enterprise für API, BOLT-12 und institutionelle Funktionen.'
    },
    pt: {
      title: 'Preços — Carimbo Gratuito no Bitcoin',
      description:
        'Carimbo básico Satohash é grátis. Compare planos Free, Pro e Enterprise para API, BOLT-12 e recursos institucionais.'
    },
    sw: {
      title: 'Bei — Muhuri wa Bure wa Bitcoin',
      description:
        'Muhuri wa msingi wa Satohash ni bure. Linganisha Free, Pro na Enterprise kwa API, BOLT-12 na vipengele vya taasisi.'
    },
    zh: {
      title: '定价 — 免费比特币时间戳',
      description:
        'Satohash 基础盖章免费。比较 Free、Pro 和 Enterprise 套餐的 API、BOLT-12 和企业功能。'
    }
  },
  comparison: {
    en: {
      title: 'Compare Satohash vs Notary & Timestamp Tools',
      description:
        'Feature matrix: Satohash vs traditional notary, Adobe Sign, DocuSign, and raw OpenTimestamps.'
    },
    es: {
      title: 'Comparar Satohash vs Notaría y Herramientas',
      description:
        'Matriz de funciones: Satohash vs notaría tradicional, Adobe Sign, DocuSign y OpenTimestamps.'
    },
    fr: {
      title: 'Comparer Satohash vs Notaire et Outils',
      description:
        'Matrice de fonctionnalités : Satohash vs notaire traditionnel, Adobe Sign, DocuSign et OpenTimestamps.'
    },
    de: {
      title: 'Satohash vs Notar & Zeitstempel-Tools',
      description:
        'Feature-Matrix: Satohash vs traditioneller Notar, Adobe Sign, DocuSign und OpenTimestamps.'
    },
    pt: {
      title: 'Compare Satohash vs Cartório e Ferramentas',
      description:
        'Matriz de recursos: Satohash vs cartório tradicional, Adobe Sign, DocuSign e OpenTimestamps.'
    },
    sw: {
      title: 'Linganisha Satohash na Notari na Zana',
      description:
        'Jedwali la vipengele: Satohash vs notari ya kawaida, Adobe Sign, DocuSign na OpenTimestamps.'
    },
    zh: {
      title: '对比 Satohash 与公证和时间戳工具',
      description: '功能矩阵：Satohash 与传统公证、Adobe Sign、DocuSign 和 OpenTimestamps 对比。'
    }
  },
  security: {
    en: {
      title: 'Security — Zero-Knowledge Bitcoin Proofs',
      description:
        'How Satohash protects your documents: client-side hashing, OpenTimestamps, Nostr identity, and institutional-grade security.'
    },
    es: {
      title: 'Seguridad — Pruebas Bitcoin Zero-Knowledge',
      description:
        'Cómo Satohash protege sus documentos: hash local, OpenTimestamps, identidad Nostr y seguridad institucional.'
    },
    fr: {
      title: 'Sécurité — Preuves Bitcoin Zéro Connaissance',
      description:
        'Comment Satohash protège vos documents : hachage local, OpenTimestamps, identité Nostr et sécurité institutionnelle.'
    },
    de: {
      title: 'Sicherheit — Zero-Knowledge Bitcoin-Beweise',
      description:
        'Wie Satohash Ihre Dokumente schützt: clientseitiges Hashing, OpenTimestamps, Nostr-Identität und institutionelle Sicherheit.'
    },
    pt: {
      title: 'Segurança — Provas Bitcoin Zero-Conhecimento',
      description:
        'Como o Satohash protege seus documentos: hash local, OpenTimestamps, identidade Nostr e segurança institucional.'
    },
    sw: {
      title: 'Usalama — Ushahidi wa Bitcoin wa Ujuzi wa Sifuri',
      description:
        'Jinsi Satohash inavyolinda hati zako: hashing ya kifaa, OpenTimestamps, utambulisho wa Nostr na usalama wa taasisi.'
    },
    zh: {
      title: '安全 — 零知识比特币证明',
      description: 'Satohash 如何保护您的文档：客户端哈希、OpenTimestamps、Nostr 身份和企业级安全。'
    }
  },
  guides: {
    en: {
      title: 'Guides — How to Stamp & Verify Documents',
      description:
        'Step-by-step guides for stamping documents, verifying proofs, multi-party contracts, and API integration.'
    },
    es: {
      title: 'Guías — Cómo Sellar y Verificar Documentos',
      description:
        'Guías paso a paso para sellar documentos, verificar pruebas, contratos multiparte e integración API.'
    },
    fr: {
      title: 'Guides — Tamponner et Vérifier des Documents',
      description:
        'Guides pas à pas pour tamponner, vérifier, contrats multiparte et intégration API.'
    },
    de: {
      title: 'Anleitungen — Dokumente Stempeln & Verifizieren',
      description:
        'Schritt-für-Schritt-Anleitungen zum Stempeln, Verifizieren, Mehrparteienverträge und API-Integration.'
    },
    pt: {
      title: 'Guias — Como Carimbar e Verificar Documentos',
      description:
        'Guias passo a passo para carimbar documentos, verificar provas, contratos multiparte e integração API.'
    },
    sw: {
      title: 'Miongozo — Jinsi ya Kuweka Muhuri na Kuthibitisha',
      description:
        'Miongozo ya hatua kwa hatua kwa kuweka muhuri, kuthibitisha ushahidi, mikataba ya pande nyingi na API.'
    },
    zh: {
      title: '指南 — 如何盖章和验证文档',
      description: '盖章、验证证明、多方合同和 API 集成的分步指南。'
    }
  },
  glossary: {
    en: {
      title: 'Glossary — Bitcoin Notarization Terms',
      description:
        'Definitions for SHA-256, OpenTimestamps, Merkle trees, NIP-05, BOLT-12, and blockchain proof terminology.'
    },
    es: {
      title: 'Glosario — Términos de Notarización Bitcoin',
      description:
        'Definiciones de SHA-256, OpenTimestamps, árboles Merkle, NIP-05, BOLT-12 y terminología blockchain.'
    },
    fr: {
      title: 'Glossaire — Termes de Notarisation Bitcoin',
      description:
        'Définitions de SHA-256, OpenTimestamps, arbres Merkle, NIP-05, BOLT-12 et terminologie blockchain.'
    },
    de: {
      title: 'Glossar — Bitcoin-Notarisierungsbegriffe',
      description:
        'Definitionen für SHA-256, OpenTimestamps, Merkle-Bäume, NIP-05, BOLT-12 und Blockchain-Terminologie.'
    },
    pt: {
      title: 'Glossário — Termos de Notarização Bitcoin',
      description:
        'Definições de SHA-256, OpenTimestamps, árvores Merkle, NIP-05, BOLT-12 e terminologia blockchain.'
    },
    sw: {
      title: 'Kamusi — Istilahi za Uthibitishaji wa Bitcoin',
      description:
        'Ufafanuzi wa SHA-256, OpenTimestamps, miti ya Merkle, NIP-05, BOLT-12 na istilahi za blockchain.'
    },
    zh: {
      title: '术语表 — 比特币公证术语',
      description: 'SHA-256、OpenTimestamps、Merkle 树、NIP-05、BOLT-12 和区块链证明术语的定义。'
    }
  },
  integrations: {
    en: {
      title: 'Integrations & API — Satohash',
      description:
        'REST API, webhooks, WordPress shortcodes, Proof DNA embed widgets, and CLI for Bitcoin-anchored proofs.'
    },
    es: {
      title: 'Integraciones y API — Satohash',
      description:
        'API REST, webhooks, shortcodes WordPress, widgets Proof DNA y CLI para pruebas ancladas en Bitcoin.'
    },
    fr: {
      title: 'Intégrations et API — Satohash',
      description:
        'API REST, webhooks, shortcodes WordPress, widgets Proof DNA et CLI pour preuves ancrées sur Bitcoin.'
    },
    de: {
      title: 'Integrationen & API — Satohash',
      description:
        'REST-API, Webhooks, WordPress-Shortcodes, Proof-DNA-Widgets und CLI für Bitcoin-verankerte Beweise.'
    },
    pt: {
      title: 'Integrações e API — Satohash',
      description:
        'API REST, webhooks, shortcodes WordPress, widgets Proof DNA e CLI para provas ancoradas no Bitcoin.'
    },
    sw: {
      title: 'Ujumuishaji na API — Satohash',
      description:
        'API ya REST, webhooks, shortcodes za WordPress, wijeti za Proof DNA na CLI kwa ushahidi wa Bitcoin.'
    },
    zh: {
      title: '集成与 API — Satohash',
      description:
        'REST API、webhooks、WordPress 短代码、Proof DNA 嵌入组件和 CLI，用于比特币锚定证明。'
    }
  },
  docs: {
    en: {
      title: 'Documentation — Satohash Protocol',
      description:
        '22 docs across architecture, API, SEO, i18n, deployment, and the four-plane Satohash protocol.'
    },
    es: {
      title: 'Documentación — Protocolo Satohash',
      description:
        '22 documentos sobre arquitectura, API, SEO, i18n, despliegue y el protocolo de cuatro planos Satohash.'
    },
    fr: {
      title: 'Documentation — Protocole Satohash',
      description:
        '22 documents sur architecture, API, SEO, i18n, déploiement et le protocole quatre plans Satohash.'
    },
    de: {
      title: 'Dokumentation — Satohash-Protokoll',
      description:
        '22 Dokumente zu Architektur, API, SEO, i18n, Deployment und dem Vier-Ebenen-Satohash-Protokoll.'
    },
    pt: {
      title: 'Documentação — Protocolo Satohash',
      description:
        '22 documentos sobre arquitetura, API, SEO, i18n, implantação e o protocolo de quatro planos Satohash.'
    },
    sw: {
      title: 'Nyaraka — Itifaki ya Satohash',
      description:
        'Nyaraka 22 kuhusu usanifu, API, SEO, i18n, usambazaji na itifaki ya pande nne ya Satohash.'
    },
    zh: {
      title: '文档 — Satohash 协议',
      description: '22 篇文档涵盖架构、API、SEO、i18n、部署和 Satohash 四层协议。'
    }
  },
  templates: {
    en: {
      title: 'Notary Templates — 14 Free Bitcoin-Ready Forms',
      description:
        'Browse 14 legal templates: NDAs, wills, leases, employment contracts. Pre-fill and anchor to Bitcoin instantly.'
    },
    es: {
      title: 'Plantillas Notariales — 14 Formularios Gratis',
      description:
        'Explore 14 plantillas legales: NDAs, testamentos, arrendamientos, contratos laborales. Anclar a Bitcoin al instante.'
    },
    fr: {
      title: 'Modèles Notariaux — 14 Formulaires Gratuits',
      description:
        'Parcourez 14 modèles juridiques : NDA, testaments, baux, contrats de travail. Ancrez sur Bitcoin instantanément.'
    },
    de: {
      title: 'Notarvorlagen — 14 Kostenlose Bitcoin-Formulare',
      description:
        '14 Rechtsvorlagen: NDAs, Testamente, Mietverträge, Arbeitsverträge. Sofort auf Bitcoin verankern.'
    },
    pt: {
      title: 'Modelos Notariais — 14 Formulários Gratuitos',
      description:
        'Navegue 14 modelos legais: NDAs, testamentos, arrendamentos, contratos de trabalho. Ancore no Bitcoin instantaneamente.'
    },
    sw: {
      title: 'Violezo vya Notari — Fomu 14 za Bure',
      description:
        'Vinjari violezo 14 vya kisheria: NDAs, matakwa, kukodisha, mikataba ya kazi. Funga kwenye Bitcoin mara moja.'
    },
    zh: {
      title: '公证模板 — 14 个免费表格',
      description: '浏览 14 个法律模板：保密协议、遗嘱、租赁、雇佣合同。即时锚定到比特币。'
    }
  },
  identity: {
    en: {
      title: 'NIP-05 Identity — Verifiable Nostr Signer',
      description:
        'Link your Nostr key to a human-readable NIP-05 handle. Verify kimi@giveabit.io or register yourname@satohash.io.'
    },
    es: {
      title: 'Identidad NIP-05 — Firmante Nostr Verificable',
      description:
        'Vincule su clave Nostr a un identificador NIP-05. Verifique kimi@giveabit.io o registre tunombre@satohash.io.'
    },
    fr: {
      title: 'Identité NIP-05 — Signataire Nostr Vérifiable',
      description:
        'Liez votre clé Nostr à un identifiant NIP-05. Vérifiez kimi@giveabit.io ou enregistrez votrenom@satohash.io.'
    },
    de: {
      title: 'NIP-05-Identität — Verifizierbarer Nostr-Signer',
      description:
        'Verknüpfen Sie Ihren Nostr-Schlüssel mit einem NIP-05-Handle. Verifizieren Sie kimi@giveabit.io oder registrieren Sie ihrname@satohash.io.'
    },
    pt: {
      title: 'Identidade NIP-05 — Signatário Nostr Verificável',
      description:
        'Vincule sua chave Nostr a um identificador NIP-05. Verifique kimi@giveabit.io ou registre seunome@satohash.io.'
    },
    sw: {
      title: 'Utambulisho wa NIP-05 — Saini ya Nostr Inayothibitishwa',
      description:
        'Unganisha ufunguo wako wa Nostr na kitambulisho cha NIP-05. Thibitisha kimi@giveabit.io au sajili jina@satohash.io.'
    },
    zh: {
      title: 'NIP-05 身份 — 可验证的 Nostr 签名者',
      description:
        '将您的 Nostr 密钥链接到可读的 NIP-05 标识。验证 kimi@giveabit.io 或注册 yourname@satohash.io。'
    }
  },
  widgets: {
    en: {
      title: 'Proof DNA Widgets — Embeddable Verification Badges',
      description:
        'Embed verifiable Proof DNA badges on any website. One line of HTML + our widget script. Deterministic visuals from SHA-256 hash.'
    },
    es: {
      title: 'Widgets Proof DNA — Insignias de Verificación',
      description:
        'Incruste insignias Proof DNA verificables en cualquier sitio. Una línea de HTML + nuestro script. Visuales deterministas desde hash SHA-256.'
    },
    fr: {
      title: 'Widgets Proof DNA — Badges de Vérification',
      description:
        'Intégrez des badges Proof DNA vérifiables sur tout site. Une ligne HTML + notre script. Visuels déterministes depuis le hash SHA-256.'
    },
    de: {
      title: 'Proof-DNA-Widgets — Einbettbare Verifizierungs-Badges',
      description:
        'Betten Sie verifizierbare Proof-DNA-Badges ein. Eine HTML-Zeile + unser Widget-Skript. Deterministische Visuals aus SHA-256-Hash.'
    },
    pt: {
      title: 'Widgets Proof DNA — Selos de Verificação',
      description:
        'Incorpore selos Proof DNA verificáveis em qualquer site. Uma linha HTML + nosso script. Visuais determinísticos do hash SHA-256.'
    },
    sw: {
      title: 'Wijeti za Proof DNA — Beji za Uthibitishaji',
      description:
        'Pachika beji za Proof DNA zinazothibitishwa kwenye tovuti yoyote. Mstari mmoja wa HTML + script yetu.'
    },
    zh: {
      title: 'Proof DNA 组件 — 可嵌入验证徽章',
      description:
        '在任何网站嵌入可验证的 Proof DNA 徽章。一行 HTML + 组件脚本。从 SHA-256 哈希生成确定性视觉效果。'
    }
  },
  notFound: {
    en: {
      title: 'Page Not Found',
      description:
        'The page you requested does not exist. Return to Satohash to stamp documents on Bitcoin.'
    },
    es: {
      title: 'Página No Encontrada',
      description:
        'La página solicitada no existe. Vuelva a Satohash para sellar documentos en Bitcoin.'
    },
    fr: {
      title: 'Page Introuvable',
      description:
        "La page demandée n'existe pas. Retournez sur Satohash pour tamponner des documents sur Bitcoin."
    },
    de: {
      title: 'Seite Nicht Gefunden',
      description:
        'Die angeforderte Seite existiert nicht. Kehren Sie zu Satohash zurück, um Dokumente auf Bitcoin zu stempeln.'
    },
    pt: {
      title: 'Página Não Encontrada',
      description:
        'A página solicitada não existe. Volte ao Satohash para carimbar documentos no Bitcoin.'
    },
    sw: {
      title: 'Ukurasa Haupatikani',
      description: 'Ukurasa ulioombwa haupo. Rudi Satohash kuweka muhuri wa hati kwenye Bitcoin.'
    },
    zh: {
      title: '页面未找到',
      description: '您请求的页面不存在。返回 Satohash 在比特币上盖章文档。'
    }
  }
}

export function getPageMeta(page, lang = 'en') {
  const entry = pageMeta[page]
  if (!entry) return null
  return entry[lang] || entry.en
}

export function getOgLocale(lang = 'en') {
  return OG_LOCALE[lang] || OG_LOCALE.en
}
