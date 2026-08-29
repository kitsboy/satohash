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
      title: 'Prove Any File Existed — Free Bitcoin Proof of Existence',
      description:
        'Drop a file. It never leaves your device. Get a permanent, Bitcoin-anchored proof of existence in minutes — free, private, verifiable by anyone, forever.'
    },
    es: {
      title: 'Prueba que un Archivo Existió — Gratis en Bitcoin',
      description:
        'Suelta un archivo; nunca sale de tu dispositivo. Prueba de existencia anclada en Bitcoin — gratis, privada, verificable por cualquiera, para siempre.'
    },
    fr: {
      title: 'Prouvez Qu’un Fichier a Existé — Gratuit sur Bitcoin',
      description:
        "Déposez un fichier. Il ne quitte jamais votre appareil. Preuve d'existence ancrée sur Bitcoin — gratuite, privée, vérifiable par tous, pour toujours."
    },
    de: {
      title: 'Beweisen, Dass eine Datei Existierte — Kostenlos',
      description:
        'Datei ablegen. Sie verlässt nie Ihr Gerät. Bitcoin-verankerter Existenznachweis — kostenlos, privat, für immer überprüfbar.'
    },
    pt: {
      title: 'Prove que um Arquivo Existiu — Grátis no Bitcoin',
      description:
        'Solte um arquivo. Ele nunca sai do seu dispositivo. Prova de existência ancorada no Bitcoin — grátis, privada, verificável por qualquer um, para sempre.'
    },
    sw: {
      title: 'Thibitisha Faili Lilipokuwepo — Bure kwenye Bitcoin',
      description:
        'Weka faili. Haliondoki kwenye kifaa chako. Ushahidi wa kuwepo uliofungwa kwenye Bitcoin — bure, faragha, unathibitishwa na mtu yeyote, milele.'
    },
    zh: {
      title: '证明任意文件曾经存在 — 免费比特币存在证明',
      description:
        '拖放任意文件。文件永不离开您的设备。几分钟内获得永久锚定于比特币的存在证明——免费、私密、任何人皆可验证，永久有效。'
    }
  },
  faq: {
    en: {
      title: 'FAQ — Bitcoin Proof of Existence, Honest Answers',
      description:
        'Straight answers on OpenTimestamps, zero-knowledge stamping, legal admissibility, NIP-05 identity, and the Satohash API. No hype, no overclaiming.'
    },
    es: {
      title: 'Preguntas Frecuentes — Prueba de Existencia en Bitcoin',
      description:
        'Respuestas directas sobre OpenTimestamps, sellado cero-conocimiento, admisibilidad legal, identidad NIP-05 y la API de Satohash. Sin exageraciones.'
    },
    fr: {
      title: 'FAQ — Preuve d’Existence Bitcoin, Réponses Honnêtes',
      description:
        "Réponses claires sur OpenTimestamps, tamponnage zéro connaissance, admissibilité légale, identité NIP-05 et API Satohash. Sans survente."
    },
    de: {
      title: 'FAQ — Bitcoin-Existenznachweis, Ehrliche Antworten',
      description:
        'Klare Antworten zu OpenTimestamps, Zero-Knowledge-Stempelung, rechtlicher Zulässigkeit, NIP-05-Identität und Satohash-API. Ohne Übertreibung.'
    },
    pt: {
      title: 'FAQ — Prova de Existência no Bitcoin, Respostas Honestas',
      description:
        'Respostas diretas sobre OpenTimestamps, carimbo zero-conhecimento, admissibilidade legal, identidade NIP-05 e API Satohash. Sem exageros.'
    },
    sw: {
      title: 'Maswali — Ushahidi wa Kuwepo kwenye Bitcoin',
      description:
        'Majibu ya moja kwa moja kuhusu OpenTimestamps, muhuri wa ujuzi wa sifuri, ukubalike wa kisheria, utambulisho wa NIP-05 na API ya Satohash.'
    },
    zh: {
      title: '常见问题 — 比特币存在证明，如实解答',
      description: '关于 OpenTimestamps、零知识盖章、法律可采性、NIP-05 身份和 Satohash API 的坦诚解答，不夸大承诺。'
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
      title: 'Guides — How to Prove a Document Existed',
      description:
        'Step-by-step, plain-English guides: cryptographic proof, OpenTimestamps, OTS vs notary, and why Bitcoin is the ultimate truth layer.'
    },
    es: {
      title: 'Guías — Cómo Probar que un Documento Existió',
      description:
        'Guías paso a paso en lenguaje claro: prueba criptográfica, OpenTimestamps, OTS vs notaría y por qué Bitcoin es la capa definitiva de la verdad.'
    },
    fr: {
      title: 'Guides — Comment Prouver qu’un Document a Existé',
      description:
        'Guides pas à pas en français clair : preuve cryptographique, OpenTimestamps, OTS vs notaire et pourquoi Bitcoin est la couche de vérité ultime.'
    },
    de: {
      title: 'Anleitungen — Existenz von Dokumenten Beweisen',
      description:
        'Schritt-für-Schritt-Anleitungen: kryptografischer Beweis, OpenTimestamps, OTS vs Notar und warum Bitcoin die ultimative Wahrheitsschicht ist.'
    },
    pt: {
      title: 'Guias — Como Provar que um Documento Existiu',
      description:
        'Guias passo a passo em linguagem clara: prova criptográfica, OpenTimestamps, OTS vs cartório e por que o Bitcoin é a camada definitiva da verdade.'
    },
    sw: {
      title: 'Miongozo — Jinsi ya Kuthibitisha Hati Ilipokuwepo',
      description:
        'Miongozo ya hatua kwa hatua: uthibitisho wa kriptografia, OpenTimestamps, OTS dhidi ya notari na kwa nini Bitcoin ni safu kuu ya ukweli.'
    },
    zh: {
      title: '指南 — 如何证明文档曾经存在',
      description: '一步步的简明指南：加密证明、OpenTimestamps、OTS 与公证对比，以及为何比特币是终极真相层。'
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
      title: 'Notary Templates — 16 Free Bitcoin-Ready Forms',
      description:
        'Browse 16 legal templates: NDAs, wills, leases, passport attestation, employment contracts. Pre-fill and anchor to Bitcoin instantly.'
    },
    es: {
      title: 'Plantillas Notariales — 16 Formularios Gratis',
      description:
        'Explore 16 plantillas legales: NDAs, testamentos, pasaportes, arrendamientos. Anclar a Bitcoin al instante.'
    },
    fr: {
      title: 'Modèles Notariaux — 16 Formulaires Gratuits',
      description:
        'Parcourez 16 modèles juridiques : NDA, testaments, passeports, baux. Ancrez sur Bitcoin instantanément.'
    },
    de: {
      title: 'Notarvorlagen — 16 Kostenlose Bitcoin-Formulare',
      description:
        '16 Rechtsvorlagen: NDAs, Testamente, Pässe, Mietverträge. Sofort auf Bitcoin verankern.'
    },
    pt: {
      title: 'Modelos Notariais — 16 Formulários Gratuitos',
      description:
        'Navegue 16 modelos legais: NDAs, testamentos, passaportes, arrendamentos. Ancore no Bitcoin instantaneamente.'
    },
    sw: {
      title: 'Violezo vya Notari — Fomu 16 za Bure',
      description:
        'Vinjari violezo 16 vya kisheria: NDAs, pasipoti, matakwa, kukodisha. Funga kwenye Bitcoin mara moja.'
    },
    zh: {
      title: '公证模板 — 16 个免费表格',
      description: '浏览 16 个法律模板：保密协议、护照证明、遗嘱、租赁。即时锚定到比特币。'
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
  about: {
    en: {
      title: 'About Satohash — Sovereign Proof Protocol',
      description:
        'The Satohash protocol whitepaper: Bitcoin-anchored proof of existence, zero-knowledge architecture, and institutional-grade digital truth.'
    },
    es: {
      title: 'Acerca de Satohash — Protocolo de Prueba Soberana',
      description:
        'El whitepaper del protocolo Satohash: prueba de existencia anclada en Bitcoin, arquitectura de conocimiento cero y verdad digital institucional.'
    },
    fr: {
      title: 'À propos de Satohash — Protocole de Preuve Souveraine',
      description:
        "Le livre blanc Satohash : preuve d'existence ancrée sur Bitcoin, architecture zéro connaissance et vérité numérique institutionnelle."
    },
    de: {
      title: 'Über Satohash — Souveränes Proof-Protokoll',
      description:
        'Das Satohash-Whitepaper: Bitcoin-verankerter Existenznachweis, Zero-Knowledge-Architektur und institutionelle digitale Wahrheit.'
    },
    pt: {
      title: 'Sobre Satohash — Protocolo de Prova Soberana',
      description:
        'O whitepaper do protocolo Satohash: prova de existência ancorada no Bitcoin, arquitetura zero-conhecimento e verdade digital institucional.'
    },
    sw: {
      title: 'Kuhusu Satohash — Itifaki ya Ushahidi wa Uhuru',
      description:
        'Waraka mweupe wa Satohash: ushahidi wa kuwepo uliofungwa kwenye Bitcoin, usanifu wa ujuzi wa sifuri, na ukweli wa kidijitali wa kitaasisi.'
    },
    zh: {
      title: '关于 Satohash — 主权证明协议',
      description: 'Satohash 协议白皮书：比特币锚定存在证明、零知识架构和机构级数字真相。'
    }
  },
  pitch: {
    en: {
      title: 'Satohash — Bitcoin as a Sovereign Civic Notary',
      description:
        'Prove a file existed, never show the file. Bitcoin anchors the fingerprint; OpenTimestamps makes it free and verifiable forever.'
    },
    es: {
      title: 'Satohash — Bitcoin como Notario Cívico Soberano',
      description:
        'Demuestra que un archivo existió sin mostrarlo. Bitcoin ancla la huella; OpenTimestamps lo hace gratis y verificable para siempre.'
    },
    fr: {
      title: 'Satohash — Bitcoin, Notaire Civique Souverain',
      description:
        "Prouvez qu'un fichier a existé sans le montrer. Bitcoin ancre l'empreinte ; OpenTimestamps la rend gratuite et vérifiable pour toujours."
    },
    de: {
      title: 'Satohash — Bitcoin als Souveräner Bürger-Notar',
      description:
        'Beweisen Sie, dass eine Datei existierte, ohne sie zu zeigen. Bitcoin verankert den Fingerabdruck; OpenTimestamps macht es kostenlos und für immer prüfbar.'
    },
    pt: {
      title: 'Satohash — Bitcoin como Notário Cívico Soberano',
      description:
        'Prove que um arquivo existiu sem mostrá-lo. O Bitcoin ancora a impressão digital; o OpenTimestamps torna tudo grátis e verificável para sempre.'
    },
    sw: {
      title: 'Satohash — Bitcoin kama Notari wa Kijamii',
      description:
        'Thibitisha faili lilipokuwepo bila kuonyesha faili. Bitcoin hufunga alama; OpenTimestamps hufanya bure na kuthibitishwa milele.'
    },
    zh: {
      title: 'Satohash — 比特币作为主权公民公证人',
      description:
        '证明文件曾经存在，而无需展示文件。比特币锚定指纹；OpenTimestamps 使其免费且永久可验证。相信数学，而非中间人。'
    }
  },
  trust: {
    en: {
      title: 'Trust Center — Security, Privacy & Compliance',
      description:
        'Satohash trust center: zero-knowledge guarantees, legal frameworks (eIDAS, ESIGN), open-source auditability, and data handling.'
    },
    es: {
      title: 'Centro de Confianza — Seguridad, Privacidad y Cumplimiento',
      description:
        'Centro de confianza Satohash: garantías de conocimiento cero, marcos legales (eIDAS, ESIGN), código abierto auditable y manejo de datos.'
    },
    fr: {
      title: 'Centre de Confiance — Sécurité et Conformité',
      description:
        'Centre de confiance Satohash : garanties zéro connaissance, cadres juridiques (eIDAS, ESIGN), audit open source et traitement des données.'
    },
    de: {
      title: 'Trust Center — Sicherheit, Datenschutz & Compliance',
      description:
        'Satohash Trust Center: Zero-Knowledge-Garantien, Rechtsrahmen (eIDAS, ESIGN), Open-Source-Auditierbarkeit und Datenverarbeitung.'
    },
    pt: {
      title: 'Centro de Confiança — Segurança, Privacidade e Conformidade',
      description:
        'Centro de confiança Satohash: garantias zero-conhecimento, frameworks legais (eIDAS, ESIGN), código aberto auditável e tratamento de dados.'
    },
    sw: {
      title: 'Kituo cha Uaminifu — Usalama, Faragha na Uzingatiaji',
      description:
        'Kituo cha uaminifu cha Satohash: dhamana za ujuzi wa sifuri, mifumo ya kisheria (eIDAS, ESIGN), ukaguzi wa chanzo huria na ushughulikiaji wa data.'
    },
    zh: {
      title: '信任中心 — 安全、隐私与合规',
      description:
        'Satohash 信任中心：零知识保证、法律框架（eIDAS、ESIGN）、开源可审计性和数据处理。'
    }
  },
  access: {
    en: {
      title: 'Sovereign Access Gateway — Nostr Identity Login',
      description:
        'Create or import a Nostr keypair. Zero-knowledge authentication — your private key never leaves your device.'
    },
    es: {
      title: 'Puerta de Acceso Soberana — Identidad Nostr',
      description:
        'Cree o importe un par de claves Nostr. Autenticación de conocimiento cero — su clave privada nunca sale de su dispositivo.'
    },
    fr: {
      title: "Passerelle d'Accès Souveraine — Identité Nostr",
      description:
        'Créez ou importez une paire de clés Nostr. Authentification zéro connaissance — votre clé privée ne quitte jamais votre appareil.'
    },
    de: {
      title: 'Souveränes Zugangsportal — Nostr-Identitätslogin',
      description:
        'Erstellen oder importieren Sie ein Nostr-Schlüsselpaar. Zero-Knowledge-Authentifizierung — Ihr privater Schlüssel verlässt nie Ihr Gerät.'
    },
    pt: {
      title: 'Portal de Acesso Soberano — Identidade Nostr',
      description:
        'Crie ou importe um par de chaves Nostr. Autenticação zero-conhecimento — sua chave privada nunca sai do seu dispositivo.'
    },
    sw: {
      title: 'Lango la Ufikiaji wa Uhuru — Utambulisho wa Nostr',
      description:
        'Unda au leta jozi ya funguo za Nostr. Uthibitishaji wa ujuzi wa sifuri — ufunguo wako wa faragha haondoki kwenye kifaa chako.'
    },
    zh: {
      title: '主权访问网关 — Nostr 身份登录',
      description: '创建或导入 Nostr 密钥对。零知识认证 — 您的私钥永不离开设备。'
    }
  },
  contribute: {
    en: {
      title: 'Contribute to Satohash — Open Source',
      description:
        'Join the Satohash community. Report issues, submit PRs, improve docs, and add translations. MIT-licensed, no CLA.'
    },
    es: {
      title: 'Contribuir a Satohash — Código Abierto',
      description:
        'Únase a la comunidad Satohash. Reporte problemas, envíe PRs, mejore documentación y añada traducciones. Licencia MIT, sin CLA.'
    },
    fr: {
      title: 'Contribuer à Satohash — Open Source',
      description:
        'Rejoignez la communauté Satohash. Signalez des bugs, soumettez des PR, améliorez la doc et ajoutez des traductions. Licence MIT, sans CLA.'
    },
    de: {
      title: 'Zu Satohash beitragen — Open Source',
      description:
        'Werden Sie Teil der Satohash-Community. Issues melden, PRs einreichen, Docs verbessern und Übersetzungen hinzufügen. MIT-Lizenz, kein CLA.'
    },
    pt: {
      title: 'Contribuir para Satohash — Código Aberto',
      description:
        'Junte-se à comunidade Satohash. Reporte problemas, envie PRs, melhore docs e adicione traduções. Licença MIT, sem CLA.'
    },
    sw: {
      title: 'Changia Satohash — Chanzo Huria',
      description:
        'Jiunge na jamii ya Satohash. Ripoti matatizo, tuma PR, boresha hati na ongeza tafsiri. Leseni MIT, hakuna CLA.'
    },
    zh: {
      title: '贡献 Satohash — 开源',
      description: '加入 Satohash 社区。报告问题、提交 PR、改进文档、添加翻译。MIT 许可，无需 CLA。'
    }
  },
  developer: {
    en: {
      title: 'Developer API — Satohash Integration',
      description:
        'API keys, webhooks, REST endpoints, and code samples for integrating Bitcoin-anchored proof of existence into your apps.'
    },
    es: {
      title: 'API para Desarrolladores — Integración Satohash',
      description:
        'Claves API, webhooks, endpoints REST y ejemplos de código para integrar prueba de existencia anclada en Bitcoin.'
    },
    fr: {
      title: 'API Développeur — Intégration Satohash',
      description:
        "Clés API, webhooks, endpoints REST et exemples de code pour intégrer la preuve d'existence ancrée sur Bitcoin."
    },
    de: {
      title: 'Developer-API — Satohash-Integration',
      description:
        'API-Schlüssel, Webhooks, REST-Endpunkte und Codebeispiele für Bitcoin-verankerten Existenznachweis in Ihren Apps.'
    },
    pt: {
      title: 'API do Desenvolvedor — Integração Satohash',
      description:
        'Chaves API, webhooks, endpoints REST e exemplos de código para integrar prova de existência ancorada no Bitcoin.'
    },
    sw: {
      title: 'API ya Msanidi — Ujumuishaji wa Satohash',
      description:
        'Funguo za API, webhooks, endpoints za REST na mifano ya msimbo kwa kuunganisha ushahidi wa kuwepo uliofungwa kwenye Bitcoin.'
    },
    zh: {
      title: '开发者 API — Satohash 集成',
      description: 'API 密钥、Webhook、REST 端点和代码示例，将比特币锚定存在证明集成到您的应用中。'
    }
  },
  stamp: {
    en: {
      title: 'Stamp — Bitcoin Document Timestamping',
      description:
        'Hash and anchor any file to Bitcoin in under 60 seconds. Single file, time capsule, ZK-redact, or deposition modes — your file never leaves your device.'
    },
    es: {
      title: 'Sellar — Sellado de Documentos en Bitcoin',
      description:
        'Hashea y ancla cualquier archivo en Bitcoin en menos de 60 segundos. Modos archivo único, cápsula, ZK-redact o deposición.'
    },
    fr: {
      title: 'Tamponner — Horodatage Bitcoin',
      description:
        'Hachez et ancrez tout fichier sur Bitcoin en moins de 60 secondes. Modes fichier unique, capsule, ZK-redact ou déposition.'
    },
    de: {
      title: 'Stempeln — Bitcoin-Dokumentenstempel',
      description:
        'Hashen und verankern Sie jede Datei in unter 60 Sekunden auf Bitcoin. Einzeldatei, Zeitkapsel, ZK-Redact oder Deposition.'
    },
    pt: {
      title: 'Carimbar — Carimbo de Documentos Bitcoin',
      description:
        'Faça hash e ancore qualquer arquivo no Bitcoin em menos de 60 segundos. Modos arquivo único, cápsula, ZK-redact ou depoimento.'
    },
    sw: {
      title: 'Weka Muhuri — Muhuri wa Hati kwenye Bitcoin',
      description:
        'Hash na fungia faili yoyote kwenye Bitcoin ndani ya sekunde 60. Hali za faili moja, kapsuli, ZK-redact au ushahidi.'
    },
    zh: {
      title: '盖章 — 比特币文档时间戳',
      description: '60秒内在比特币上哈希并锚定任意文件。单文件、时间胶囊、ZK脱敏或取证模式。'
    }
  },
  vault: {
    en: {
      title: 'Proof Vault — Manage Bitcoin Anchors',
      description:
        'Browse, search, export, and revoke your Bitcoin-anchored proofs. Filter by status, type, and date.'
    },
    es: {
      title: 'Bóveda de Pruebas — Gestión de Anclas Bitcoin',
      description: 'Explore, busque, exporte y revoque sus pruebas ancladas en Bitcoin.'
    },
    fr: {
      title: 'Coffre de Preuves — Gérer les Ancres Bitcoin',
      description: 'Parcourez, recherchez, exportez et révoquez vos preuves ancrées sur Bitcoin.'
    },
    de: {
      title: 'Beweis-Tresor — Bitcoin-Anker verwalten',
      description: 'Durchsuchen, exportieren und widerrufen Sie Ihre Bitcoin-verankerten Beweise.'
    },
    pt: {
      title: 'Cofre de Provas — Gerenciar Âncoras Bitcoin',
      description: 'Navegue, pesquise, exporte e revogue suas provas ancoradas no Bitcoin.'
    },
    sw: {
      title: 'Hifadhi ya Ushahidi — Simamia Vifungo vya Bitcoin',
      description: 'Vinjari, tafuta, hamisha na batilisha ushahidi wako uliofungwa kwenye Bitcoin.'
    },
    zh: {
      title: '证明保险库 — 管理比特币锚定',
      description: '浏览、搜索、导出和撤销您的比特币锚定证明。'
    }
  },
  dashboard: {
    en: {
      title: 'Dashboard — Satohash Command Center',
      description:
        'Your stamping overview: recent proofs, network status, quick actions, and protocol health at a glance.'
    },
    es: {
      title: 'Panel — Centro de Control Satohash',
      description: 'Resumen de sellado: pruebas recientes, estado de red y acciones rápidas.'
    },
    fr: {
      title: 'Tableau de Bord — Centre de Commande Satohash',
      description:
        "Vue d'ensemble du tamponnage : preuves récentes, état du réseau et actions rapides."
    },
    de: {
      title: 'Dashboard — Satohash Kommandozentrale',
      description: 'Stempelübersicht: aktuelle Beweise, Netzwerkstatus und Schnellaktionen.'
    },
    pt: {
      title: 'Painel — Centro de Comando Satohash',
      description: 'Visão geral: provas recentes, status da rede e ações rápidas.'
    },
    sw: {
      title: 'Dashibodi — Kituo cha Amri cha Satohash',
      description:
        'Muhtasari wa muhuri: ushahidi wa hivi karibuni, hali ya mtandao na vitendo vya haraka.'
    },
    zh: {
      title: '仪表板 — Satohash 指挥中心',
      description: '盖章概览：最近证明、网络状态和快捷操作。'
    }
  },
  verify: {
    en: {
      title: 'Verify — Check Bitcoin Proof',
      description:
        'Verify any SHA-256 hash or .ots proof file against the Bitcoin blockchain. Independent, independently verifiable validation.'
    },
    es: {
      title: 'Verificar — Comprobar Prueba Bitcoin',
      description:
        'Verifique cualquier hash SHA-256 o archivo .ots contra la blockchain de Bitcoin.'
    },
    fr: {
      title: 'Vérifier — Contrôler une Preuve Bitcoin',
      description: 'Vérifiez tout hash SHA-256 ou fichier .ots contre la blockchain Bitcoin.'
    },
    de: {
      title: 'Verifizieren — Bitcoin-Beweis prüfen',
      description: 'Prüfen Sie jeden SHA-256-Hash oder .ots-Datei gegen die Bitcoin-Blockchain.'
    },
    pt: {
      title: 'Verificar — Checar Prova Bitcoin',
      description: 'Verifique qualquer hash SHA-256 ou arquivo .ots contra a blockchain Bitcoin.'
    },
    sw: {
      title: 'Thibitisha — Angalia Ushahidi wa Bitcoin',
      description:
        'Thibitisha hash yoyote ya SHA-256 au faili ya .ots dhidi ya blockchain ya Bitcoin.'
    },
    zh: {
      title: '验证 — 检查比特币证明',
      description: '对照比特币区块链验证任何 SHA-256 哈希或 .ots 证明文件。'
    }
  },
  batch: {
    en: {
      title: 'Batch Stamp — Up to 100 Files',
      description:
        'Stamp up to 100 documents in one session. Per-file progress, bulk export, and shared Merkle aggregation.'
    },
    es: {
      title: 'Sello por Lotes — Hasta 100 Archivos',
      description: 'Selle hasta 100 documentos en una sesión con progreso por archivo.'
    },
    fr: {
      title: "Tamponnage par Lot — Jusqu'à 100 Fichiers",
      description: "Tamponnez jusqu'à 100 documents en une session avec progression par fichier."
    },
    de: {
      title: 'Batch-Stempel — Bis zu 100 Dateien',
      description: 'Stempeln Sie bis zu 100 Dokumente in einer Sitzung mit Fortschritt pro Datei.'
    },
    pt: {
      title: 'Carimbo em Lote — Até 100 Arquivos',
      description: 'Carimbe até 100 documentos em uma sessão com progresso por arquivo.'
    },
    sw: {
      title: 'Muhuri wa Kundi — Faili 100',
      description: 'Weka muhuri hadi faili 100 katika kipindi kimoja na maendeleo kwa kila faili.'
    },
    zh: {
      title: '批量盖章 — 最多100个文件',
      description: '一次会话中盖章最多100个文档，显示每个文件的进度。'
    }
  },
  settings: {
    en: {
      title: 'Settings — Profile & Security',
      description:
        'Manage Nostr identity, API keys, webhooks, mesh nodes, billing, and notification preferences.'
    },
    es: {
      title: 'Configuración — Perfil y Seguridad',
      description: 'Gestione identidad Nostr, claves API, webhooks y preferencias.'
    },
    fr: {
      title: 'Paramètres — Profil et Sécurité',
      description: 'Gérez identité Nostr, clés API, webhooks et préférences.'
    },
    de: {
      title: 'Einstellungen — Profil & Sicherheit',
      description: 'Verwalten Sie Nostr-Identität, API-Schlüssel, Webhooks und Einstellungen.'
    },
    pt: {
      title: 'Configurações — Perfil e Segurança',
      description: 'Gerencie identidade Nostr, chaves API, webhooks e preferências.'
    },
    sw: {
      title: 'Mipangilio — Wasifu na Usalama',
      description: 'Simamia utambulisho wa Nostr, funguo za API, webhooks na mapendeleo.'
    },
    zh: {
      title: '设置 — 个人资料与安全',
      description: '管理 Nostr 身份、API 密钥、Webhook 和通知偏好。'
    }
  },
  explorer: {
    en: {
      title: 'Block Explorer — Bitcoin Proof Chain',
      description:
        'Explore stamped proofs chronologically, by Merkle tree, or verification path. Noir institutional chain intelligence.'
    },
    es: {
      title: 'Explorador de Bloques — Cadena de Pruebas Bitcoin',
      description:
        'Explore pruebas selladas cronológicamente, por árbol Merkle o ruta de verificación.'
    },
    fr: {
      title: 'Explorateur — Chaîne de Preuves Bitcoin',
      description:
        'Explorez les preuves tamponnées chronologiquement, par arbre Merkle ou chemin de vérification.'
    },
    de: {
      title: 'Block-Explorer — Bitcoin-Beweiskette',
      description:
        'Erkunden Sie gestempelte Beweise chronologisch, per Merkle-Baum oder Verifizierungspfad.'
    },
    pt: {
      title: 'Explorador — Cadeia de Provas Bitcoin',
      description:
        'Explore provas carimbadas cronologicamente, por árvore Merkle ou caminho de verificação.'
    },
    sw: {
      title: 'Kichunguzi — Mnyororo wa Ushahidi wa Bitcoin',
      description:
        'Chunguza ushahidi uliofungwa kwa wakati, kwa mti wa Merkle au njia ya uthibitishaji.'
    },
    zh: {
      title: '区块浏览器 — 比特币证明链',
      description: '按时间、Merkle 树或验证路径探索已盖章证明。'
    }
  },
  atlas: {
    en: {
      title: 'Atlas — Global Proof Map',
      description:
        'Geographic visualization of Bitcoin-anchored proofs worldwide. Jurisdiction intelligence and network coverage.'
    },
    es: {
      title: 'Atlas — Mapa Global de Pruebas',
      description: 'Visualización geográfica de pruebas ancladas en Bitcoin en todo el mundo.'
    },
    fr: {
      title: 'Atlas — Carte Mondiale des Preuves',
      description: 'Visualisation géographique des preuves ancrées sur Bitcoin dans le monde.'
    },
    de: {
      title: 'Atlas — Globale Beweiskarte',
      description: 'Geografische Visualisierung Bitcoin-verankerter Beweise weltweit.'
    },
    pt: {
      title: 'Atlas — Mapa Global de Provas',
      description: 'Visualização geográfica de provas ancoradas no Bitcoin mundialmente.'
    },
    sw: {
      title: 'Atlasi — Ramani ya Ushahidi Duniani',
      description: 'Uonyeshaji wa kijiografia wa ushahidi uliofungwa kwenye Bitcoin duniani kote.'
    },
    zh: { title: '地图集 — 全球证明地图', description: '全球比特币锚定证明的地理可视化。' }
  },
  contracts: {
    en: {
      title: 'Smart Contracts — Legal Templates',
      description:
        'Create, edit, and timestamp legal agreements. Nostr-signed contracts with Bitcoin proof of existence.'
    },
    es: {
      title: 'Contratos Inteligentes — Plantillas Legales',
      description: 'Cree, edite y selle acuerdos legales con prueba de existencia en Bitcoin.'
    },
    fr: {
      title: 'Contrats — Modèles Juridiques',
      description: 'Créez, modifiez et tamponnez des accords juridiques avec preuve Bitcoin.'
    },
    de: {
      title: 'Verträge — Rechtsvorlagen',
      description: 'Erstellen, bearbeiten und stempeln Sie Rechtsvereinbarungen mit Bitcoin-Beweis.'
    },
    pt: {
      title: 'Contratos — Modelos Jurídicos',
      description: 'Crie, edite e carimbe acordos legais com prova de existência no Bitcoin.'
    },
    sw: {
      title: 'Mikataba — Violezo vya Kisheria',
      description: 'Unda, hariri na weka muhuri wa makubaliano ya kisheria na ushahidi wa Bitcoin.'
    },
    zh: {
      title: '智能合约 — 法律模板',
      description: '创建、编辑和时间戳法律协议，附带比特币存在证明。'
    }
  },
  snapper: {
    en: {
      title: 'Web Capture — Archive Any URL',
      description:
        'Capture and timestamp any web page as cryptographic proof. SHA-256 hash anchored to Bitcoin permanently.'
    },
    es: {
      title: 'Captura Web — Archivar Cualquier URL',
      description:
        'Capture y selle cualquier página web como prueba criptográfica anclada en Bitcoin.'
    },
    fr: {
      title: 'Capture Web — Archiver Toute URL',
      description:
        'Capturez et tamponnez toute page web comme preuve cryptographique ancrée sur Bitcoin.'
    },
    de: {
      title: 'Web-Capture — Jede URL archivieren',
      description: 'Erfassen und stempeln Sie jede Webseite als kryptografischen Bitcoin-Beweis.'
    },
    pt: {
      title: 'Captura Web — Arquivar Qualquer URL',
      description: 'Capture e carimbe qualquer página web como prova criptográfica no Bitcoin.'
    },
    sw: {
      title: 'Nasa Wavuti — Hifadhi URL Yoyote',
      description:
        'Nasa na weka muhuri wa ukurasa wowote wa wavuti kama ushahidi wa kriptografia kwenye Bitcoin.'
    },
    zh: {
      title: '网页捕获 — 归档任意 URL',
      description: '捕获任意网页并加盖时间戳，作为永久锚定在比特币上的加密证明。'
    }
  },
  mesh: {
    en: {
      title: 'Witness Mesh — Distributed Anchoring',
      description:
        'Peer-to-peer witness network for redundant Bitcoin proof anchoring. Node status and mesh verification.'
    },
    es: {
      title: 'Malla de Testigos — Anclaje Distribuido',
      description: 'Red de testigos P2P para anclaje redundante de pruebas Bitcoin.'
    },
    fr: {
      title: 'Maillage de Témoins — Ancrage Distribué',
      description: 'Réseau P2P de témoins pour ancrage redondant de preuves Bitcoin.'
    },
    de: {
      title: 'Witness-Mesh — Verteiltes Verankern',
      description: 'P2P-Zeugennetzwerk für redundante Bitcoin-Beweisverankerung.'
    },
    pt: {
      title: 'Malha de Testemunhas — Ancoragem Distribuída',
      description: 'Rede P2P de testemunhas para ancoragem redundante de provas Bitcoin.'
    },
    sw: {
      title: 'Mtandao wa Mashahidi — Kufungia Kilichosambazwa',
      description: 'Mtandao wa mashahidi wa P2P kwa kufungia ushahidi wa Bitcoin kwa njia ya ziada.'
    },
    zh: {
      title: '见证网格 — 分布式锚定',
      description: '点对点见证网络，实现冗余的比特币证明锚定。'
    }
  },
  forum: {
    en: {
      title: 'Community Forum — Satohash Discussions',
      description:
        'Discuss proofs, legal use cases, API integrations, and protocol updates with the Satohash community.'
    },
    es: {
      title: 'Foro Comunitario — Discusiones Satohash',
      description:
        'Discuta pruebas, casos legales, integraciones API y actualizaciones del protocolo.'
    },
    fr: {
      title: 'Forum Communautaire — Discussions Satohash',
      description:
        'Discutez preuves, cas juridiques, intégrations API et mises à jour du protocole.'
    },
    de: {
      title: 'Community-Forum — Satohash-Diskussionen',
      description: 'Diskutieren Sie Beweise, Rechtsfälle, API-Integrationen und Protokoll-Updates.'
    },
    pt: {
      title: 'Fórum da Comunidade — Discussões Satohash',
      description: 'Discuta provas, casos legais, integrações API e atualizações do protocolo.'
    },
    sw: {
      title: 'Jukwaa la Jamii — Majadiliano ya Satohash',
      description:
        'Jadili ushahidi, matumizi ya kisheria, ujumuishaji wa API na masasisho ya itifaki.'
    },
    zh: {
      title: '社区论坛 — Satohash 讨论',
      description: '与社区讨论证明、法律用例、API 集成和协议更新。'
    }
  },
  protocolStats: {
    en: {
      title: 'Protocol Stats — Network Intelligence',
      description:
        'Live Satohash protocol metrics: total stamps, confirmations, mempool fees, and relay health.'
    },
    es: {
      title: 'Estadísticas del Protocolo — Inteligencia de Red',
      description: 'Métricas en vivo: sellos totales, confirmaciones, comisiones y salud de relays.'
    },
    fr: {
      title: 'Stats Protocole — Intelligence Réseau',
      description: 'Métriques en direct : tampons totaux, confirmations, frais et santé des relais.'
    },
    de: {
      title: 'Protokoll-Statistiken — Netzwerk-Intelligenz',
      description: 'Live-Metriken: Stempel, Bestätigungen, Gebühren und Relay-Gesundheit.'
    },
    pt: {
      title: 'Estatísticas do Protocolo — Inteligência de Rede',
      description: 'Métricas ao vivo: carimbos, confirmações, taxas e saúde dos relays.'
    },
    sw: {
      title: 'Takwimu za Itifaki — Akili ya Mtandao',
      description: 'Vipimo vya moja kwa moja: muhuri, uthibitishaji, ada na afya ya relays.'
    },
    zh: {
      title: '协议统计 — 网络情报',
      description: '实时指标：总盖章数、确认数、手续费和中继健康状态。'
    }
  },
  legalPrivacy: {
    en: {
      title: 'Privacy Policy',
      description:
        'How Satohash handles your data. Zero-knowledge stamping — files never leave your device.'
    },
    es: {
      title: 'Política de Privacidad',
      description:
        'Cómo Satohash maneja sus datos. Sellado zero-knowledge — los archivos nunca salen de su dispositivo.'
    },
    fr: {
      title: 'Politique de Confidentialité',
      description:
        'Comment Satohash traite vos données. Tamponnage zéro connaissance — fichiers jamais envoyés.'
    },
    de: {
      title: 'Datenschutzrichtlinie',
      description:
        'Wie Satohash Ihre Daten behandelt. Zero-Knowledge-Stempelung — Dateien verlassen nie Ihr Gerät.'
    },
    pt: {
      title: 'Política de Privacidade',
      description:
        'Como o Satohash trata seus dados. Carimbo zero-conhecimento — arquivos nunca saem do dispositivo.'
    },
    sw: {
      title: 'Sera ya Faragha',
      description:
        'Jinsi Satohash inavyoshughulikia data yako. Muhuri wa ujuzi wa sifuri — faili haziondoki kwenye kifaa chako.'
    },
    zh: {
      title: '隐私政策',
      description: 'Satohash 如何处理您的数据。零知识盖章 — 文件永不离开您的设备。'
    }
  },
  legalTerms: {
    en: {
      title: 'Terms of Service',
      description:
        'Satohash terms of use, liability limits, and service agreement for Bitcoin document notarization.'
    },
    es: {
      title: 'Términos de Servicio',
      description: 'Términos de uso de Satohash, límites de responsabilidad y acuerdo de servicio.'
    },
    fr: {
      title: "Conditions d'Utilisation",
      description:
        "Conditions d'utilisation Satohash, limites de responsabilité et accord de service."
    },
    de: {
      title: 'Nutzungsbedingungen',
      description: 'Satohash-Nutzungsbedingungen, Haftungsgrenzen und Servicevereinbarung.'
    },
    pt: {
      title: 'Termos de Serviço',
      description: 'Termos de uso do Satohash, limites de responsabilidade e acordo de serviço.'
    },
    sw: {
      title: 'Masharti ya Huduma',
      description:
        'Masharti ya matumizi ya Satohash, mipaka ya uwajibikaji na makubaliano ya huduma.'
    },
    zh: { title: '服务条款', description: 'Satohash 使用条款、责任限制和比特币文档公证服务协议。' }
  },
  nostrHealth: {
    en: {
      title: 'Nostr Relay Health',
      description: 'Live status of Satohash Nostr relays — uptime, latency, and publish health.'
    },
    es: {
      title: 'Salud de Relés Nostr',
      description: 'Estado en vivo de los relés Nostr de Satohash.'
    },
    fr: {
      title: 'Santé des Relais Nostr',
      description: 'État en direct des relais Nostr Satohash.'
    },
    de: { title: 'Nostr-Relay-Gesundheit', description: 'Live-Status der Satohash-Nostr-Relays.' },
    pt: {
      title: 'Saúde dos Relays Nostr',
      description: 'Status ao vivo dos relays Nostr do Satohash.'
    },
    sw: {
      title: 'Afya ya Relays za Nostr',
      description: 'Hali ya moja kwa moja ya relays za Nostr za Satohash.'
    },
    zh: { title: 'Nostr 中继健康', description: 'Satohash Nostr 中继的实时状态。' }
  },
  mobileSigner: {
    en: {
      title: 'Mobile Signer — Remote Co-Signing',
      description: 'Pair your phone as a secure co-signer for institutional document workflows.'
    },
    es: {
      title: 'Firmante Móvil — Co-firma Remota',
      description: 'Empareje su teléfono como co-firmante seguro.'
    },
    fr: {
      title: 'Signataire Mobile — Co-signature',
      description: 'Associez votre téléphone comme co-signataire sécurisé.'
    },
    de: {
      title: 'Mobiler Signierer — Remote Co-Signing',
      description: 'Telefon als sicherer Co-Signer koppeln.'
    },
    pt: {
      title: 'Assinante Móvel — Co-assinatura',
      description: 'Emparelhe o telefone como co-assinante seguro.'
    },
    sw: { title: 'Msaini wa Simu', description: 'Oanisha simu yako kama msaini wa pamoja salama.' },
    zh: { title: '移动签名器', description: '将手机配对为安全的联合签名设备。' }
  },
  verificationShield: {
    en: {
      title: 'Verification Shield — Public Proof',
      description: 'Holographic public proof-of-existence page with Bitcoin anchor details.'
    },
    es: {
      title: 'Escudo de Verificación',
      description: 'Página pública de prueba de existencia anclada en Bitcoin.'
    },
    fr: {
      title: 'Bouclier de Vérification',
      description: "Page publique de preuve d'existence ancrée sur Bitcoin."
    },
    de: {
      title: 'Verifizierungsschild',
      description: 'Öffentliche Existenznachweis-Seite mit Bitcoin-Anker.'
    },
    pt: {
      title: 'Escudo de Verificação',
      description: 'Página pública de prova de existência no Bitcoin.'
    },
    sw: {
      title: 'Ngao ya Uthibitishaji',
      description: 'Ukurasa wa umma wa ushahidi wa kuwepo uliofungwa kwenye Bitcoin.'
    },
    zh: { title: '验证盾', description: '比特币锚定存在证明的公开验证页面。' }
  },
  templateDetail: {
    en: {
      title: 'Template Preview — Demo Mode',
      description: 'Preview a Satohash legal template with pre-filled demo data and Bitcoin export.'
    },
    es: {
      title: 'Vista Previa de Plantilla',
      description: 'Vista previa con datos de demostración y exportación Bitcoin.'
    },
    fr: {
      title: 'Aperçu du Modèle',
      description: 'Aperçu avec données de démo et export Bitcoin.'
    },
    de: { title: 'Vorlagen-Vorschau', description: 'Vorschau mit Demo-Daten und Bitcoin-Export.' },
    pt: {
      title: 'Pré-visualização do Modelo',
      description: 'Pré-visualização com dados de demonstração.'
    },
    sw: {
      title: 'Hakiki ya Kiolezo',
      description: 'Hakiki na data ya onyesho na usafirishaji wa Bitcoin.'
    },
    zh: { title: '模板预览', description: '使用预填演示数据预览 Satohash 法律模板。' }
  },
  government: {
    en: {
      title: 'Government & Diplomatic Document Timestamping',
      description:
        'Zero-knowledge Bitcoin timestamps for passports, national IDs, and distressed sovereign assets. MotoPass integration.'
    },
    es: {
      title: 'Sellado Gubernamental y Diplomático',
      description:
        'Sellos Bitcoin de conocimiento cero para pasaportes, identidades y activos soberanos. Integración MotoPass.'
    },
    fr: {
      title: 'Horodatage Gouvernemental et Diplomatique',
      description:
        'Horodatages zéro connaissance pour passeports et actifs souverains. Intégration MotoPass.'
    },
    de: {
      title: 'Behördliche & Diplomatische Zeitstempel',
      description:
        'Zero-Knowledge-Bitcoin-Zeitstempel für Pässe und Staatsanlagen. MotoPass-Integration.'
    },
    pt: {
      title: 'Carimbo Governamental e Diplomático',
      description:
        'Carimbos Bitcoin zero-conhecimento para passaportes e ativos soberanos. Integração MotoPass.'
    },
    sw: {
      title: 'Muhuri wa Serikali na Kidiplomasia',
      description:
        'Mihuri ya Bitcoin ya ujuzi wa sifuri kwa pasipoti na mali za serikali. MotoPass.'
    },
    zh: {
      title: '政府与外交文件时间戳',
      description: '护照和主权资产的零知识比特币时间戳。MotoPass 集成。'
    }
  },
  motopassVerify: {
    en: {
      title: 'Verify MotoPass Application Hash',
      description:
        'Validate SHA-256 fingerprints from motopass.giveabit.io and link to Satohash verification.'
    },
    es: {
      title: 'Verificar Hash de Solicitud MotoPass',
      description: 'Valide huellas SHA-256 de motopass.giveabit.io.'
    },
    fr: {
      title: 'Vérifier Hash MotoPass',
      description: 'Validez les empreintes SHA-256 de motopass.giveabit.io.'
    },
    de: {
      title: 'MotoPass-Antrags-Hash prüfen',
      description: 'SHA-256-Fingerabdrücke von motopass.giveabit.io validieren.'
    },
    pt: {
      title: 'Verificar Hash MotoPass',
      description: 'Valide fingerprints SHA-256 de motopass.giveabit.io.'
    },
    sw: {
      title: 'Thibitisha Hash ya MotoPass',
      description: 'Thibitisha fingerprints SHA-256 kutoka motopass.giveabit.io.'
    },
    zh: {
      title: '验证 MotoPass 申请哈希',
      description: '验证 motopass.giveabit.io 的 SHA-256 指纹。'
    }
  },
  batchHash: {
    en: {
      title: 'Batch Hash Registry',
      description:
        'Register hundreds of document fingerprints locally and export CSV for agency audit.'
    },
    es: {
      title: 'Registro por Lotes',
      description: 'Registre cientos de huellas localmente y exporte CSV.'
    },
    fr: {
      title: 'Registre par Lots',
      description: 'Enregistrez des centaines de fingerprints et exportez CSV.'
    },
    de: {
      title: 'Batch-Hash-Register',
      description: 'Hunderte Fingerabdrücke lokal registrieren und CSV exportieren.'
    },
    pt: {
      title: 'Registro em Lote',
      description: 'Registre centenas de fingerprints e exporte CSV.'
    },
    sw: {
      title: 'Rejista ya Batch Hash',
      description: 'Sajili mamia ya fingerprints na hamisha CSV.'
    },
    zh: { title: '批量哈希登记', description: '本地登记数百个指纹并导出 CSV。' }
  },
  chainOfCustody: {
    en: {
      title: 'Chain of Custody Timestamp',
      description: 'Record holder, witness, and agency handoffs with Bitcoin-anchored hashes.'
    },
    es: {
      title: 'Cadena de Custodia',
      description: 'Registre entregas con hashes anclados a Bitcoin.'
    },
    fr: {
      title: 'Chaîne de Custody',
      description: 'Enregistrez les transferts avec hashes Bitcoin.'
    },
    de: {
      title: 'Chain of Custody',
      description: 'Übergaben mit Bitcoin-verankerten Hashes erfassen.'
    },
    pt: {
      title: 'Cadeia de Custódia',
      description: 'Registre handoffs com hashes ancorados no Bitcoin.'
    },
    sw: {
      title: 'Mnyororo wa Usimamizi',
      description: 'Rekodi uhamisho na hashes zilizofungwa kwenye Bitcoin.'
    },
    zh: { title: '保管链时间戳', description: '用比特币锚定哈希记录交接。' }
  },
  evidenceAdmissibility: {
    en: {
      title: 'Evidence Admissibility Guide',
      description:
        'Jurisdiction matrix for hash-based evidence under UETA, eIDAS, UK, and cross-border law.'
    },
    es: {
      title: 'Guía de Admisibilidad',
      description: 'Matriz jurisdiccional UETA, eIDAS, UK y derecho transfronterizo.'
    },
    fr: {
      title: "Guide d'Admissibilité",
      description: 'Matrice juridictionnelle UETA, eIDAS, UK.'
    },
    de: {
      title: 'Beweisadmissibilität',
      description: 'Jurisdiktionsmatrix UETA, eIDAS, UK und grenzüberschreitendes Recht.'
    },
    pt: { title: 'Guia de Admissibilidade', description: 'Matriz jurisdicional UETA, eIDAS, UK.' },
    sw: {
      title: 'Mwongozo wa Ukubalike',
      description: 'Matrix ya UETA, eIDAS, UK na sheria za mipaka.'
    },
    zh: { title: '证据可采性指南', description: 'UETA、eIDAS、英国及跨境法律司法管辖区矩阵。' }
  },
  distressedAsset: {
    en: {
      title: 'Distressed Asset Attestation',
      description:
        'Hash sovereign asset listings and verify hosted OpenTimestamps proofs from MotoPass.'
    },
    es: {
      title: 'Atestación de Activos',
      description: 'Hashee listados soberanos y verifique .ots alojados de MotoPass.'
    },
    fr: {
      title: "Attestation d'Actifs",
      description: 'Hashez les listings souverains et vérifiez les .ots MotoPass.'
    },
    de: {
      title: 'Distressed-Asset-Bescheinigung',
      description: 'Hashen Sie Listings und verifizieren Sie gehostete MotoPass-.ots.'
    },
    pt: {
      title: 'Atestação de Ativos',
      description: 'Hash listagens soberanas e verifique .ots hospedados MotoPass.'
    },
    sw: {
      title: 'Uthibitisho wa Mali',
      description: 'Hash orodha za serikali na thibitisha .ots za MotoPass.'
    },
    zh: { title: '困境资产证明', description: '哈希主权资产列表并验证 MotoPass 托管的 .ots。' }
  },
  legalCrypto: {
    en: {
      title: 'Cryptocurrency & Blockchain Notice',
      description:
        'How Satohash uses Bitcoin and OpenTimestamps — no custody, no wallet required for basic stamping.'
    },
    es: {
      title: 'Aviso de Criptomonedas',
      description: 'Uso de Bitcoin y OpenTimestamps sin custodia de fondos.'
    },
    fr: {
      title: 'Avis Cryptomonnaie',
      description: 'Bitcoin et OpenTimestamps sans garde de portefeuille.'
    },
    de: {
      title: 'Kryptowährungs-Hinweis',
      description: 'Bitcoin und OpenTimestamps ohne Wallet-Pflicht.'
    },
    pt: {
      title: 'Aviso de Criptomoeda',
      description: 'Bitcoin e OpenTimestamps sem custódia de carteira.'
    },
    sw: {
      title: 'Taarifa ya Crypto',
      description: 'Bitcoin na OpenTimestamps bila uhifadhi wa pochi.'
    },
    zh: {
      title: '加密货币声明',
      description: 'Satohash 如何使用比特币和 OpenTimestamps，无需托管钱包。'
    }
  },
  watch: {
    en: {
      title: 'Watch — Satohash Explainer',
      description:
        '80-second Kimi explainer: hash a file on your device, timestamp it with OpenTimestamps, prove it on Bitcoin. 10-second teaser also on the page.'
    },
    es: {
      title: 'Ver — Explicador Satohash',
      description:
        'Explicador de 80 segundos: hashea en tu dispositivo y ancla la prueba en Bitcoin.'
    },
    fr: {
      title: 'Regarder — Explainer Satohash',
      description: 'Explainer de 80 secondes : hachez sur l’appareil, ancrez sur Bitcoin.'
    },
    de: {
      title: 'Ansehen — Satohash-Erklärer',
      description: '80-Sekunden-Erklärer: lokal hashen, auf Bitcoin verankern.'
    },
    pt: {
      title: 'Assistir — Explainer Satohash',
      description: 'Explainer de 80 segundos: hash no dispositivo, âncora no Bitcoin.'
    },
    sw: {
      title: 'Tazama — Maelezo ya Satohash',
      description: 'Maelezo ya sekunde 80: hash kwenye kifaa, funga kwenye Bitcoin.'
    },
    zh: {
      title: '观看 — Satohash 讲解',
      description: '八十秒讲解：在设备上哈希，锚定到比特币。'
    }
  },
  status: {
    en: {
      title: 'Status — Live API & Bitcoin Node',
      description:
        'Public Satohash status: API readiness, own bitcoind tip, calendars, free stamps (paywall off).'
    },
    es: {
      title: 'Estado — API y nodo Bitcoin en vivo',
      description: 'Estado público: API, nodo Bitcoin propio, calendarios, sellos gratis.'
    },
    fr: {
      title: 'Statut — API et nœud Bitcoin',
      description: 'Statut public : API, nœud Bitcoin, calendriers, tamponnage gratuit.'
    },
    de: {
      title: 'Status — Live-API & Bitcoin-Node',
      description: 'Öffentlicher Status: API, eigener Bitcoin-Node, Kalender, freie Stempel.'
    },
    pt: {
      title: 'Status — API e nó Bitcoin ao vivo',
      description: 'Status público: API, nó Bitcoin próprio, calendários, carimbos grátis.'
    },
    sw: {
      title: 'Hali — API na nodi ya Bitcoin',
      description: 'Hali ya umma: API, nodi ya Bitcoin, kalenda, muhuri wa bure.'
    },
    zh: {
      title: '状态 — 实时 API 与比特币节点',
      description: '公开状态：API、自有比特币节点、日历、免费盖章。'
    }
  },
  counsel: {
    en: {
      title: 'For counsel — What a Satohash stamp is',
      description:
        'OpenTimestamps / Bitcoin proof of existence for eIDAS, ESIGN, and UETA readers. Pending is not confirmed.'
    },
    es: {
      title: 'Para abogados — Qué es un sello Satohash',
      description:
        'Prueba de existencia OpenTimestamps / Bitcoin para lectores eIDAS, ESIGN y UETA.'
    },
    fr: {
      title: 'Pour les avocats — Qu’est-ce qu’un tampon Satohash',
      description: 'Preuve d’existence OpenTimestamps / Bitcoin pour lecteurs eIDAS, ESIGN et UETA.'
    },
    de: {
      title: 'Für Anwälte — Was ein Satohash-Stempel ist',
      description: 'OpenTimestamps-/Bitcoin-Existenznachweis für eIDAS, ESIGN und UETA.'
    },
    pt: {
      title: 'Para advogados — O que é um carimbo Satohash',
      description: 'Prova de existência OpenTimestamps / Bitcoin para leitores eIDAS, ESIGN e UETA.'
    },
    sw: {
      title: 'Kwa mawakili — Muhuri wa Satohash ni nini',
      description: 'Ushahidi wa OpenTimestamps / Bitcoin kwa eIDAS, ESIGN na UETA.'
    },
    zh: {
      title: '致律师 — Satohash 盖章是什么',
      description: '面向 eIDAS、ESIGN、UETA 读者的 OpenTimestamps / 比特币存在证明。'
    }
  },
  network: {
    en: {
      title: 'Network — Calendars, Bitcoin, Family Clients',
      description:
        'Live OpenTimestamps calendars, own-node Bitcoin height, recent stamps, and family client attribution.'
    },
    es: {
      title: 'Red — Calendarios, Bitcoin, clientes familia',
      description:
        'Calendarios OpenTimestamps, altura Bitcoin, sellos recientes y clientes familia.'
    },
    fr: {
      title: 'Réseau — Calendriers, Bitcoin, clients famille',
      description:
        'Calendriers OpenTimestamps, hauteur Bitcoin, tampons récents et clients famille.'
    },
    de: {
      title: 'Netzwerk — Kalender, Bitcoin, Familien-Clients',
      description: 'OpenTimestamps-Kalender, Bitcoin-Höhe, letzte Stempel und Familien-Clients.'
    },
    pt: {
      title: 'Rede — Calendários, Bitcoin, clientes família',
      description:
        'Calendários OpenTimestamps, altura Bitcoin, carimbos recentes e clientes família.'
    },
    sw: {
      title: 'Mtandao — Kalenda, Bitcoin, wateja wa familia',
      description: 'Kalenda za OpenTimestamps, urefu wa Bitcoin, muhuri wa hivi karibuni na wateja.'
    },
    zh: {
      title: '网络 — 日历、比特币、家族客户端',
      description: 'OpenTimestamps 日历、自有节点高度、最近盖章与家族客户端。'
    }
  },
  howSatohashWorks: {
    en: {
      title: 'How Satohash Works — Free & Technical Deep-Dive',
      description:
        'Why it is free: a million fingerprints fold into one shared Bitcoin anchor. The plain-English answer plus the full OpenTimestamps technical deep-dive.'
    },
    es: {
      title: 'Cómo Funciona Satohash — Gratis y Técnico',
      description:
        'Por qué es gratis: un millón de huellas se pliegan en un único ancla compartida de Bitcoin. La respuesta clara más el detalle técnico de OpenTimestamps.'
    },
    fr: {
      title: 'Comment Satohash Fonctionne — Gratuit et Technique',
      description:
        "Pourquoi c'est gratuit : un million d'empreintes se replient en un seul ancre Bitcoin. L'explication simple plus la plongée technique OpenTimestamps."
    },
    de: {
      title: 'Wie Satohash Funktioniert — Kostenlos & Technisch',
      description:
        'Warum es kostenlos ist: Eine Million Fingerabdrücke falten sich in einen gemeinsamen Bitcoin-Anker. Die einfache Erklärung plus der technische Deep-Dive.'
    },
    pt: {
      title: 'Como o Satohash Funciona — Grátis e Técnico',
      description:
        'Por que é grátis: um milhão de impressões digitais se dobram em uma única âncora de Bitcoin. A resposta simples e o detalhe técnico do OpenTimestamps.'
    },
    sw: {
      title: 'Satohash Inavyofanya Kazi — Bure na Kiufundi',
      description:
        'Kwa nini ni bure: alama milioni moja hukunjwa kuwa nanga moja ya pamoja ya Bitcoin. Maelezo rahisi pamoja na maelezo ya kina ya OpenTimestamps.'
    },
    zh: {
      title: 'Satohash 如何运作 — 免费与技术详解',
      description:
        '为何免费：一百万指纹折叠进一个共享的比特币锚点。简明解答加 OpenTimestamps 完整技术详解。'
    }
  },
  supportAndGuidance: {
    en: {
      title: 'Request Support & Guidance — Open Civic Tool',
      description:
        'An honest request to legal, technical, and funding communities: help us harden Satohash, a free, open, Bitcoin-anchored civic tool for truth.'
    },
    es: {
      title: 'Pide Apoyo y Orientación — Herramienta Cívica',
      description:
        'Una petición honesta a comunidades jurídicas, técnicas y de financiación: ayúdanos a fortalecer Satohash, una herramienta cívica anclada en Bitcoin.'
    },
    fr: {
      title: 'Demander Soutien et Aide — Outil Civique Ouvert',
      description:
        "Une demande honnête aux juristes, techniciens et bailleurs de fonds : aidez-nous à renforcer Satohash, un outil civique libre, ouvert et ancré sur Bitcoin."
    },
    de: {
      title: 'Unterstützung & Beratung Anfordern — Bürger-Tool',
      description:
        'Eine ehrliche Bitte an Rechts-, Technik- und Fördergemeinschaften: helfen Sie, Satohash zu härten — ein freies, offenes Bitcoin-Bürger-Tool für Wahrheit.'
    },
    pt: {
      title: 'Peça Apoio e Orientação — Ferramenta Cívica',
      description:
        'Um pedido honesto a comunidades jurídicas, técnicas e de financiamento: ajude a fortalecer o Satohash, uma ferramenta cívica ancorada no Bitcoin.'
    },
    sw: {
      title: 'Omba Msaada na Mwongozo — Chombo Huria cha Kijamii',
      description:
        'Ombi la uaminifu kwa jamii za kisheria, kiufundi na za ufadhili: tusaidie kuimarisha Satohash, chombo huria, wazi, kilichofungwa kwenye Bitcoin kwa ukweli.'
    },
    zh: {
      title: '请求支持与指导 — 开放的公民工具',
      description:
        '向法律、技术和资助界发出的坦诚请求：帮助我们加固 Satohash——一个免费、开放、锚定于比特币的公民真相工具。'
    }
  },
  marketing: {
    en: {
      title: 'Marketing — Positioning the Sovereign Truth Layer',
      description:
        'Satohash marketing: positioning, the three emotional beats, channels, and assets for a free, honest, Bitcoin-anchored civic tool.'
    },
    es: {
      title: 'Marketing — Posicionando la Capa de Verdad Soberana',
      description:
        'Marketing de Satohash: posicionamiento, los tres latidos emocionales, canales y recursos para una herramienta cívica libre, honesta y anclada en Bitcoin.'
    },
    fr: {
      title: 'Marketing — Positionner la Couche de Vérité Souveraine',
      description:
        'Marketing Satohash : positionnement, les trois battements émotionnels, canaux et ressources d’un outil civique libre, honnête et ancré sur Bitcoin.'
    },
    de: {
      title: 'Marketing — Die Souveräne Wahrheitsebene Positionieren',
      description:
        'Satohash-Marketing: Positionierung, die drei emotionalen Beats, Kanäle und Assets für ein freies, ehrliches, Bitcoin-verankertes Bürger-Tool.'
    },
    pt: {
      title: 'Marketing — Posicionando a Camada de Verdade Soberana',
      description:
        'Marketing do Satohash: posicionamento, os três batimentos emocionais, canais e recursos para uma ferramenta cívica livre, honesta e ancorada no Bitcoin.'
    },
    sw: {
      title: 'Uuzaji — Kuweka Safu ya Ukweli wa Uhuru',
      description:
        'Uuzaji wa Satohash: uwekaji, mipigo mitatu ya kihisia, njia na rasilimali za chombo huria, cha uaminifu kilichofungwa kwenye Bitcoin.'
    },
    zh: {
      title: '营销 — 定位主权真相层',
      description:
        'Satohash 营销：为一个免费、诚实、锚定比特币的公民工具做定位、三大情感节拍、渠道与素材。'
    }
  },
  executiveSummary: {
    en: {
      title: 'Executive Summary — Satohash, Proof of Truth',
      description:
        'Why Satohash exists: a free, sovereign, Bitcoin-anchored proof of existence via OpenTimestamps. Hash locally, stamp in minutes, verify forever.'
    },
    es: {
      title: 'Resumen Ejecutivo — Satohash, Prueba de Verdad',
      description:
        'Por qué existe Satohash: prueba de existencia gratuita y anclada en Bitcoin vía OpenTimestamps. Hashea local, sella en minutos, verifica para siempre.'
    },
    fr: {
      title: 'Résumé Exécutif — Satohash, Preuve de Vérité',
      description:
        "Pourquoi Satohash existe : preuve d'existence gratuite, souveraine et ancrée sur Bitcoin via OpenTimestamps. Hachez localement, vérifiez pour toujours."
    },
    de: {
      title: 'Executive Summary — Satohash, Beweis der Wahrheit',
      description:
        'Warum Satohash existiert: ein freier, souveräner, Bitcoin-verankerter Existenznachweis via OpenTimestamps. Lokal hashen, für immer verifizieren.'
    },
    pt: {
      title: 'Resumo Executivo — Satohash, Prova de Verdade',
      description:
        'Por que o Satohash existe: prova de existência soberana, gratuita e ancorada no Bitcoin via OpenTimestamps. Hash local, verifique para sempre.'
    },
    sw: {
      title: 'Muhtasari wa Uongozi — Satohash, Ushahidi wa Ukweli',
      description:
        'Kwa nini Satohash ipo: ushahidi wa kuwepo huru, wa bure uliofungwa kwenye Bitcoin kupitia OpenTimestamps. Hash kwenye kifaa, thibitisha milele.'
    },
    zh: {
      title: '执行摘要 — Satohash，真相证明',
      description:
        'Satohash 为何存在：通过 OpenTimestamps 提供免费、主权、锚定于比特币的存在证明。本地哈希，数分钟盖章，永久验证。'
    }
  },
  learnArticles: {
    en: {
      title: 'Learn — Bitcoin Proof of Existence, Explained',
      description:
        'Plain-English articles on proving a document existed, verifying .ots proofs, OTS vs DocuSign, timestamping photos, and protecting AI output.'
    },
    es: {
      title: 'Aprende — Prueba de Existencia en Bitcoin',
      description:
        'Artículos en lenguaje claro sobre probar que un documento existió, verificar pruebas .ots, OTS vs DocuSign, sellar fotos y proteger la salida de IA.'
    },
    fr: {
      title: 'Apprendre — Preuve d’Existence sur Bitcoin',
      description:
        "Articles en français clair : prouver qu'un document a existé, vérifier les preuves .ots, OTS vs DocuSign, horodater des photos et protéger la sortie IA."
    },
    de: {
      title: 'Lernen — Bitcoin-Existenznachweis erklärt',
      description:
        'Verständliche Artikel: Existenz eines Dokuments beweisen, .ots-Beweise prüfen, OTS vs DocuSign, Fotos stempeln und KI-Ausgaben schützen.'
    },
    pt: {
      title: 'Aprenda — Prova de Existência no Bitcoin',
      description:
        'Artigos em linguagem clara: provar que um documento existiu, verificar provas .ots, OTS vs DocuSign, carimbar fotos e proteger saída de IA.'
    },
    sw: {
      title: 'Jifunze — Ushahidi wa Kuwepo kwenye Bitcoin',
      description:
        'Makala za lugha rahisi: kuthibitisha hati ilipokuwepo, kuthibitisha ushahidi wa .ots, OTS dhidi ya DocuSign, muhuri wa picha na kulinda pato la AI.'
    },
    zh: {
      title: '学习 — 比特币存在证明详解',
      description:
        '简明文章：证明文档曾经存在、验证 .ots 证明、OTS 与 DocuSign 对比、照片盖章以及保护 AI 输出。'
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
