import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import i18n from './setup'
import de from './inline/de.js'
import pt from './inline/pt.js'
import sw from './inline/sw.js'
import {
  LANGUAGES as languages,
  getInitialLang,
  normalizeLang,
  syncLangToUrl,
  getLanguageMeta,
  STORAGE_KEY
} from './language.js'

export { languages }

export const translations = {
  en: {
    nav: {
      vault: 'Vault',
      stamp: 'Stamp',
      atlas: 'Atlas',
      dashboard: 'Dashboard',
      contracts: 'Contracts',
      settings: 'Settings',
      developer: 'Developer API',
      templates: 'Templates',
      verify: 'Verify',
      trust: 'Trust Center'
    },
    stamp: {
      title: 'Notarize Document',
      subtitle: 'Anchor a SHA-256 hash to the Bitcoin blockchain',
      dropzone: 'Drop file or click to select',
      hashLabel: 'SHA-256 Hash',
      stamp: 'Stamp to Bitcoin',
      stamping: 'Stamping…',
      success: 'Anchored to Bitcoin',
      coSigners: 'Co-Signers',
      addCoSigner: 'Add Co-Signer'
    },
    vault: {
      title: 'Proof Vault',
      subtitle: 'Your anchored documents',
      search: 'Search vault…',
      download: 'Download OTS',
      verify: 'Verify',
      certificate: 'Certificate',
      pending: 'Pending',
      confirmed: 'Confirmed'
    },
    common: {
      loading: 'Loading…',
      error: 'Error',
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      status: 'Status',
      date: 'Date',
      actions: 'Actions'
    },
    landing: {
      heroTitle: 'Anchor Your Documents to Bitcoin — Forever',
      heroSubtitle:
        'Create cryptographic proof that your documents existed at a specific time. Zero-knowledge. Tamper-proof. Verified by the Bitcoin blockchain.',
      heroCta: 'Stamp a Document Now',
      heroCta2: 'See How It Works',
      step1: 'Hash locally',
      step2: 'Anchor to Bitcoin',
      step3: 'Prove forever',
      socialProof: 'Join 2,400+ professionals anchoring documents to Bitcoin',
      tryTemplate: 'Try a template for free',
      features: {
        title: 'Everything You Need for Tamper-Proof Documents',
        subtitle: 'Professional-grade notarization powered by Bitcoin and open standards'
      }
    },
    templates: {
      pageTitle: 'Notary Templates',
      subtitle: 'Choose a template to pre-fill your document and anchor it to Bitcoin',
      searchPlaceholder: 'Search templates…',
      downloadPdf: 'Download PDF',
      emailPackage: 'Email Package',
      anchorBitcoin: 'Anchor to Bitcoin',
      saveVault: 'Save to Vault',
      print: 'Print Document',
      backToTemplates: '← Back to Templates',
      preview: 'Preview',
      shareLink: 'Copy Share Link',
      darkMode: 'Dark Mode',
      fieldsComplete: 'Fields Complete',
      checklist: 'Checklist',
      versionHistory: 'Version History',
      restore: 'Restore',
      zeroKnowledge: 'Zero-Knowledge',
      zeroKnowledgeDesc:
        'Your document contents never leave your device — only the SHA-256 hash is sent to the server.',
      progress: 'of fields filled'
    },
    contracts: {
      pageTitle: 'Contracts',
      newArtifact: 'Create New Artifact',
      downloadAll: 'Download All',
      statusDraft: 'Draft',
      statusSigned: 'Signed',
      statusTimestamped: 'Timestamped',
      edit: 'Edit',
      delete: 'Delete',
      inspector: 'Inspector',
      documentName: 'Document Name',
      proofPackage: 'Proof Package',
      emailPackage: 'Email Package',
      otsQr: 'OTS Verification QR',
      scanToVerify: 'Scan to Verify'
    },
    verify: {
      pageTitle: 'Verify Document',
      subtitle:
        'Upload a document and its .ots proof file to confirm authenticity against the Bitcoin blockchain',
      verified: 'Verified',
      invalid: 'Invalid',
      pending: 'Pending Confirmation',
      copyHash: 'Copy Hash',
      viewOnChain: 'View on Chain'
    },
    forum: {
      pageTitle: 'Forum',
      subtitle: 'Discuss notarization, Bitcoin proofs, and tamper-proof documents.',
      newThread: 'Start a New Thread',
      threadTitle: 'Thread title',
      yourName: 'Your name',
      createThread: 'Create',
      writePost: 'Write your post…',
      postReply: 'Post Reply',
      backToForum: '← Back to Forum',
      noDiscussions: 'No discussions yet'
    },
    dashboard: {
      welcome: 'Welcome to Satohash',
      welcomeSubtitle:
        'Your hub for tamper-proof document management. Stamp, verify, and manage all your notarized documents in one place.',
      dismiss: 'Dismiss',
      recentActivity: 'Recent Activity',
      quickActions: 'Quick Actions'
    },
    settings: {
      pageTitle: 'Settings',
      theme: 'Theme',
      language: 'Language',
      account: 'Account',
      notifications: 'Notifications',
      save: 'Save Changes',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode'
    },
    access: {
      signIn: 'Sign In',
      title: 'Welcome to Satohash',
      subtitle: 'The professional standard for Bitcoin-anchored document notarization',
      getStarted: 'Get Started',
      learnMore: 'Learn More'
    },
    errors: {
      generic: 'Something went wrong',
      network: 'Network error — please try again',
      hashFailed: 'Hash generation failed',
      stampFailed: 'Failed to stamp document',
      verifyFailed: 'Verification failed',
      loadFailed: 'Failed to load'
    },
    footer: {
      verifyAt: 'Verify this document at',
      poweredBy: 'Powered by OpenTimestamps & Bitcoin',
      createdBy: 'Created by',
      rights: 'All rights reserved'
    }
  },
  es: {
    nav: {
      vault: 'Bóveda',
      stamp: 'Sellar',
      atlas: 'Atlas',
      dashboard: 'Panel',
      contracts: 'Contratos',
      settings: 'Ajustes',
      developer: 'API Dev',
      templates: 'Plantillas',
      verify: 'Verificar',
      trust: 'Centro de Confianza'
    },
    stamp: {
      title: 'Notarizar Documento',
      subtitle: 'Ancla un hash SHA-256 en la blockchain de Bitcoin',
      dropzone: 'Suelta el archivo o haz clic para seleccionar',
      hashLabel: 'Hash SHA-256',
      stamp: 'Sellar en Bitcoin',
      stamping: 'Sellando…',
      success: 'Anclado en Bitcoin',
      coSigners: 'Co-Firmantes',
      addCoSigner: 'Añadir Co-Firmante'
    },
    vault: {
      title: 'Bóveda de Pruebas',
      subtitle: 'Tus documentos anclados',
      search: 'Buscar…',
      download: 'Descargar OTS',
      verify: 'Verificar',
      certificate: 'Certificado',
      pending: 'Pendiente',
      confirmed: 'Confirmado'
    },
    common: {
      loading: 'Cargando…',
      error: 'Error',
      cancel: 'Cancelar',
      save: 'Guardar',
      close: 'Cerrar',
      back: 'Atrás',
      next: 'Siguiente',
      submit: 'Enviar',
      status: 'Estado',
      date: 'Fecha',
      actions: 'Acciones'
    },
    landing: {
      heroTitle: 'Ancla tus Documentos a Bitcoin — Para Siempre',
      heroSubtitle:
        'Crea pruebas criptográficas de que tus documentos existieron en un momento determinado. Conocimiento cero. A prueba de manipulaciones. Verificado por la blockchain de Bitcoin.',
      heroCta: 'Sellar un Documento Ahora',
      heroCta2: 'Ver Cómo Funciona',
      step1: 'Hash local',
      step2: 'Anclar a Bitcoin',
      step3: 'Probar para siempre',
      socialProof: 'Únete a más de 2.400 profesionales anclando documentos a Bitcoin',
      tryTemplate: 'Prueba una plantilla gratis',
      features: {
        title: 'Todo lo que Necesitas para Documentos a Prueba de Manipulaciones',
        subtitle: 'Notarización de nivel profesional con Bitcoin y estándares abiertos'
      }
    },
    templates: {
      pageTitle: 'Plantillas Notariales',
      subtitle: 'Elige una plantilla para pre-rellenar tu documento y anclarlo a Bitcoin',
      searchPlaceholder: 'Buscar plantillas…',
      downloadPdf: 'Descargar PDF',
      emailPackage: 'Enviar Paquete',
      anchorBitcoin: 'Anclar a Bitcoin',
      saveVault: 'Guardar en Bóveda',
      print: 'Imprimir Documento',
      backToTemplates: '← Volver a Plantillas',
      preview: 'Vista Previa',
      shareLink: 'Copiar Enlace',
      darkMode: 'Modo Oscuro',
      fieldsComplete: 'Campos Completados',
      checklist: 'Lista de Verificación',
      versionHistory: 'Historial de Versiones',
      restore: 'Restaurar',
      zeroKnowledge: 'Conocimiento Cero',
      zeroKnowledgeDesc:
        'El contenido de tu documento nunca sale de tu dispositivo — solo se envía el hash SHA-256 al servidor.',
      progress: 'de campos completados'
    },
    contracts: {
      pageTitle: 'Contratos',
      newArtifact: 'Crear Nuevo Artefacto',
      downloadAll: 'Descargar Todo',
      statusDraft: 'Borrador',
      statusSigned: 'Firmado',
      statusTimestamped: 'Con Marca de Tiempo',
      edit: 'Editar',
      delete: 'Eliminar',
      inspector: 'Inspector',
      documentName: 'Nombre del Documento',
      proofPackage: 'Paquete de Prueba',
      emailPackage: 'Enviar Paquete',
      otsQr: 'QR de Verificación OTS',
      scanToVerify: 'Escanear para Verificar'
    },
    verify: {
      pageTitle: 'Verificar Documento',
      subtitle:
        'Sube un documento y su archivo de prueba .ots para confirmar la autenticidad en la blockchain de Bitcoin',
      verified: 'Verificado',
      invalid: 'Inválido',
      pending: 'Confirmación Pendiente',
      copyHash: 'Copiar Hash',
      viewOnChain: 'Ver en Cadena'
    },
    forum: {
      pageTitle: 'Foro',
      subtitle:
        'Debate sobre notarización, pruebas Bitcoin y documentos a prueba de manipulaciones.',
      newThread: 'Iniciar un Nuevo Hilo',
      threadTitle: 'Título del hilo',
      yourName: 'Tu nombre',
      createThread: 'Crear',
      writePost: 'Escribe tu mensaje…',
      postReply: 'Publicar Respuesta',
      backToForum: '← Volver al Foro',
      noDiscussions: 'Aún no hay discusiones'
    },
    dashboard: {
      welcome: 'Bienvenido a Satohash',
      welcomeSubtitle:
        'Tu centro de gestión de documentos a prueba de manipulaciones. Sella, verifica y administra todos tus documentos notarizados en un solo lugar.',
      dismiss: 'Descartar',
      recentActivity: 'Actividad Reciente',
      quickActions: 'Acciones Rápidas'
    },
    settings: {
      pageTitle: 'Ajustes',
      theme: 'Tema',
      language: 'Idioma',
      account: 'Cuenta',
      notifications: 'Notificaciones',
      save: 'Guardar Cambios',
      darkMode: 'Modo Oscuro',
      lightMode: 'Modo Claro'
    },
    access: {
      signIn: 'Iniciar Sesión',
      title: 'Bienvenido a Satohash',
      subtitle: 'El estándar profesional para la notarización de documentos anclados a Bitcoin',
      getStarted: 'Comenzar',
      learnMore: 'Más Información'
    },
    errors: {
      generic: 'Algo salió mal',
      network: 'Error de red — por favor inténtalo de nuevo',
      hashFailed: 'Error al generar el hash',
      stampFailed: 'Error al sellar el documento',
      verifyFailed: 'Error en la verificación',
      loadFailed: 'Error al cargar'
    },
    footer: {
      verifyAt: 'Verifica este documento en',
      poweredBy: 'Desarrollado con OpenTimestamps y Bitcoin',
      createdBy: 'Creado por',
      rights: 'Todos los derechos reservados'
    }
  },
  fr: {
    nav: {
      vault: 'Coffre',
      stamp: 'Tamponner',
      atlas: 'Atlas',
      dashboard: 'Tableau de bord',
      contracts: 'Contrats',
      settings: 'Paramètres',
      developer: 'API Dev',
      templates: 'Modèles',
      verify: 'Vérifier',
      trust: 'Centre de confiance'
    },
    stamp: {
      title: 'Notariser le document',
      subtitle: 'Ancrez un hash SHA-256 dans la blockchain Bitcoin',
      dropzone: 'Déposez un fichier ou cliquez pour sélectionner',
      hashLabel: 'Hash SHA-256',
      stamp: 'Tamponner sur Bitcoin',
      stamping: 'Tampon en cours…',
      success: 'Ancré sur Bitcoin',
      coSigners: 'Co-Signataires',
      addCoSigner: 'Ajouter Co-Signataire'
    },
    vault: {
      title: 'Coffre de preuves',
      subtitle: 'Vos documents ancrés',
      search: 'Rechercher…',
      download: 'Télécharger OTS',
      verify: 'Vérifier',
      certificate: 'Certificat',
      pending: 'En attente',
      confirmed: 'Confirmé'
    },
    common: {
      loading: 'Chargement…',
      error: 'Erreur',
      cancel: 'Annuler',
      save: 'Enregistrer',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      submit: 'Soumettre',
      status: 'Statut',
      date: 'Date',
      actions: 'Actions'
    },
    landing: {
      heroTitle: 'Ancrez Vos Documents sur Bitcoin — Pour Toujours',
      heroSubtitle:
        'Créez une preuve cryptographique que vos documents ont existé à un moment précis. Zéro connaissance. Inviolable. Vérifié par la blockchain Bitcoin.',
      heroCta: 'Tamponner un Document Maintenant',
      heroCta2: 'Voir Comment Ça Marche',
      step1: 'Hash local',
      step2: 'Ancrage sur Bitcoin',
      step3: 'Preuve permanente',
      socialProof: 'Rejoignez plus de 2 400 professionnels ancrant leurs documents sur Bitcoin',
      tryTemplate: 'Essayez un modèle gratuitement',
      features: {
        title: "Tout ce qu'il Faut pour des Documents Inviolables",
        subtitle: 'Notarisation professionnelle propulsée par Bitcoin et des standards ouverts'
      }
    },
    templates: {
      pageTitle: 'Modèles Notariaux',
      subtitle: "Choisissez un modèle pour pré-remplir votre document et l'ancrer sur Bitcoin",
      searchPlaceholder: 'Rechercher des modèles…',
      downloadPdf: 'Télécharger PDF',
      emailPackage: 'Envoyer le Paquet',
      anchorBitcoin: 'Ancrer sur Bitcoin',
      saveVault: 'Enregistrer dans le Coffre',
      print: 'Imprimer le Document',
      backToTemplates: '← Retour aux Modèles',
      preview: 'Aperçu',
      shareLink: 'Copier le Lien',
      darkMode: 'Mode Sombre',
      fieldsComplete: 'Champs Remplis',
      checklist: 'Liste de Contrôle',
      versionHistory: 'Historique des Versions',
      restore: 'Restaurer',
      zeroKnowledge: 'Zéro Connaissance',
      zeroKnowledgeDesc:
        'Le contenu de votre document ne quitte jamais votre appareil — seul le hash SHA-256 est envoyé au serveur.',
      progress: 'des champs remplis'
    },
    contracts: {
      pageTitle: 'Contrats',
      newArtifact: 'Créer un Nouvel Artefact',
      downloadAll: 'Tout Télécharger',
      statusDraft: 'Brouillon',
      statusSigned: 'Signé',
      statusTimestamped: 'Horodaté',
      edit: 'Modifier',
      delete: 'Supprimer',
      inspector: 'Inspecteur',
      documentName: 'Nom du Document',
      proofPackage: 'Paquet de Preuve',
      emailPackage: 'Envoyer le Paquet',
      otsQr: 'QR de Vérification OTS',
      scanToVerify: 'Scanner pour Vérifier'
    },
    verify: {
      pageTitle: 'Vérifier le Document',
      subtitle:
        "Téléchargez un document et son fichier de preuve .ots pour confirmer l'authenticité sur la blockchain Bitcoin",
      verified: 'Vérifié',
      invalid: 'Invalide',
      pending: 'Confirmation en Attente',
      copyHash: 'Copier le Hash',
      viewOnChain: 'Voir sur la Chaîne'
    },
    forum: {
      pageTitle: 'Forum',
      subtitle: 'Discutez de notarisation, de preuves Bitcoin et de documents inviolables.',
      newThread: 'Démarrer un Nouveau Fil',
      threadTitle: 'Titre du fil',
      yourName: 'Votre nom',
      createThread: 'Créer',
      writePost: 'Rédigez votre message…',
      postReply: 'Publier la Réponse',
      backToForum: '← Retour au Forum',
      noDiscussions: 'Pas encore de discussions'
    },
    dashboard: {
      welcome: 'Bienvenue sur Satohash',
      welcomeSubtitle:
        'Votre centre de gestion de documents inviolables. Tamponnez, vérifiez et gérez tous vos documents notarisés en un seul endroit.',
      dismiss: 'Ignorer',
      recentActivity: 'Activité Récente',
      quickActions: 'Actions Rapides'
    },
    settings: {
      pageTitle: 'Paramètres',
      theme: 'Thème',
      language: 'Langue',
      account: 'Compte',
      notifications: 'Notifications',
      save: 'Enregistrer les Modifications',
      darkMode: 'Mode Sombre',
      lightMode: 'Mode Clair'
    },
    access: {
      signIn: 'Se Connecter',
      title: 'Bienvenue sur Satohash',
      subtitle: 'Le standard professionnel pour la notarisation de documents ancrés sur Bitcoin',
      getStarted: 'Commencer',
      learnMore: 'En Savoir Plus'
    },
    errors: {
      generic: "Une erreur s'est produite",
      network: 'Erreur réseau — veuillez réessayer',
      hashFailed: 'Échec de la génération du hash',
      stampFailed: 'Échec du tamponnage du document',
      verifyFailed: 'Échec de la vérification',
      loadFailed: 'Échec du chargement'
    },
    footer: {
      verifyAt: 'Vérifiez ce document sur',
      poweredBy: 'Propulsé par OpenTimestamps et Bitcoin',
      createdBy: 'Créé par',
      rights: 'Tous droits réservés'
    }
  },
  de,
  pt,
  sw,
  zh: {
    nav: {
      vault: '保险库',
      stamp: '盖章',
      atlas: '图谱',
      dashboard: '仪表板',
      contracts: '合同',
      settings: '设置',
      developer: '开发者API',
      templates: '模板',
      verify: '验证',
      trust: '信任中心'
    },
    stamp: {
      title: '公证文件',
      subtitle: '将SHA-256哈希锚定到比特币区块链',
      dropzone: '拖放文件或点击选择',
      hashLabel: 'SHA-256 哈希',
      stamp: '锚定到比特币',
      stamping: '锚定中…',
      success: '已锚定到比特币',
      coSigners: '联署人',
      addCoSigner: '添加联署人'
    },
    vault: {
      title: '证明保险库',
      subtitle: '您的锚定文件',
      search: '搜索…',
      download: '下载 OTS',
      verify: '验证',
      certificate: '证书',
      pending: '待处理',
      confirmed: '已确认'
    },
    common: {
      loading: '加载中…',
      error: '错误',
      cancel: '取消',
      save: '保存',
      close: '关闭',
      back: '返回',
      next: '下一步',
      submit: '提交',
      status: '状态',
      date: '日期',
      actions: '操作'
    },
    landing: {
      heroTitle: '将您的文件永久锚定到比特币区块链',
      heroSubtitle:
        '创建加密证明，证明您的文件在特定时间存在。零知识。防篡改。由比特币区块链验证。',
      heroCta: '立即盖章文件',
      heroCta2: '了解工作原理',
      step1: '本地哈希',
      step2: '锚定到比特币',
      step3: '永久证明',
      socialProof: '加入2,400多名将文件锚定到比特币的专业人士',
      tryTemplate: '免费试用模板',
      features: {
        title: '防篡改文件所需的一切',
        subtitle: '由比特币和开放标准驱动的专业级公证'
      }
    },
    templates: {
      pageTitle: '公证模板',
      subtitle: '选择模板预填文件并将其锚定到比特币',
      searchPlaceholder: '搜索模板…',
      downloadPdf: '下载 PDF',
      emailPackage: '发送包',
      anchorBitcoin: '锚定到比特币',
      saveVault: '保存到保险库',
      print: '打印文件',
      backToTemplates: '← 返回模板',
      preview: '预览',
      shareLink: '复制分享链接',
      darkMode: '深色模式',
      fieldsComplete: '字段已完成',
      checklist: '检查清单',
      versionHistory: '版本历史',
      restore: '恢复',
      zeroKnowledge: '零知识',
      zeroKnowledgeDesc: '您的文件内容永远不会离开您的设备——只有SHA-256哈希会发送到服务器。',
      progress: '字段已填写'
    },
    contracts: {
      pageTitle: '合同',
      newArtifact: '创建新工件',
      downloadAll: '全部下载',
      statusDraft: '草稿',
      statusSigned: '已签署',
      statusTimestamped: '已加时间戳',
      edit: '编辑',
      delete: '删除',
      inspector: '检查器',
      documentName: '文件名称',
      proofPackage: '证明包',
      emailPackage: '发送包',
      otsQr: 'OTS 验证二维码',
      scanToVerify: '扫描验证'
    },
    verify: {
      pageTitle: '验证文件',
      subtitle: '上传文件及其 .ots 证明文件，在比特币区块链上确认真实性',
      verified: '已验证',
      invalid: '无效',
      pending: '等待确认',
      copyHash: '复制哈希',
      viewOnChain: '在链上查看'
    },
    forum: {
      pageTitle: '论坛',
      subtitle: '讨论公证、比特币证明和防篡改文件。',
      newThread: '发起新话题',
      threadTitle: '话题标题',
      yourName: '您的姓名',
      createThread: '创建',
      writePost: '写下您的帖子…',
      postReply: '发表回复',
      backToForum: '← 返回论坛',
      noDiscussions: '暂无讨论'
    },
    dashboard: {
      welcome: '欢迎使用 Satohash',
      welcomeSubtitle: '您的防篡改文件管理中心。在一个地方盖章、验证和管理所有公证文件。',
      dismiss: '关闭',
      recentActivity: '最近活动',
      quickActions: '快速操作'
    },
    settings: {
      pageTitle: '设置',
      theme: '主题',
      language: '语言',
      account: '账户',
      notifications: '通知',
      save: '保存更改',
      darkMode: '深色模式',
      lightMode: '浅色模式'
    },
    access: {
      signIn: '登录',
      title: '欢迎使用 Satohash',
      subtitle: '比特币锚定文件公证的专业标准',
      getStarted: '开始使用',
      learnMore: '了解更多'
    },
    errors: {
      generic: '出现错误',
      network: '网络错误 — 请重试',
      hashFailed: '哈希生成失败',
      stampFailed: '文件盖章失败',
      verifyFailed: '验证失败',
      loadFailed: '加载失败'
    },
    footer: {
      verifyAt: '在此验证本文件',
      poweredBy: '由 OpenTimestamps 和比特币驱动',
      createdBy: '创建者',
      rights: '保留所有权利'
    }
  },
  ar: {
    nav: {
      vault: 'الخزنة',
      stamp: 'ختم',
      atlas: 'الأطلس',
      dashboard: 'لوحة القيادة',
      contracts: 'العقود',
      settings: 'الإعدادات',
      developer: 'واجهة برمجية',
      templates: 'القوالب',
      verify: 'التحقق',
      trust: 'مركز الثقة'
    },
    stamp: {
      title: 'توثيق المستند',
      subtitle: 'ربط تجزئة SHA-256 بسلسلة كتل Bitcoin',
      dropzone: 'أسقط ملفاً أو انقر للتحديد',
      hashLabel: 'تجزئة SHA-256',
      stamp: 'ختم على Bitcoin',
      stamping: 'جارٍ الختم…',
      success: 'تم الربط بـ Bitcoin',
      coSigners: 'المشاركون في التوقيع',
      addCoSigner: 'إضافة موقّع مشارك'
    },
    vault: {
      title: 'خزنة الأدلة',
      subtitle: 'مستنداتك المثبتة',
      search: 'بحث…',
      download: 'تنزيل OTS',
      verify: 'تحقق',
      certificate: 'شهادة',
      pending: 'معلّق',
      confirmed: 'مؤكد'
    },
    common: {
      loading: 'جارٍ التحميل…',
      error: 'خطأ',
      cancel: 'إلغاء',
      save: 'حفظ',
      close: 'إغلاق',
      back: 'رجوع',
      next: 'التالي',
      submit: 'إرسال',
      status: 'الحالة',
      date: 'التاريخ',
      actions: 'إجراءات'
    },
    landing: {
      heroTitle: 'ربط مستنداتك بـ Bitcoin — إلى الأبد',
      heroSubtitle:
        'أنشئ دليلاً تشفيرياً على وجود مستنداتك في وقت محدد. بدون كشف المحتوى. محمي من التلاعب. موثّق بواسطة سلسلة كتل Bitcoin.',
      heroCta: 'ختم مستند الآن',
      heroCta2: 'اكتشف كيف يعمل',
      step1: 'تجزئة محلية',
      step2: 'ربط بـ Bitcoin',
      step3: 'إثبات دائم',
      socialProof: 'انضم إلى أكثر من 2,400 محترف يربطون مستنداتهم بـ Bitcoin',
      tryTemplate: 'جرّب قالباً مجاناً',
      features: {
        title: 'كل ما تحتاجه لمستندات محمية من التلاعب',
        subtitle: 'توثيق احترافي مدعوم بـ Bitcoin والمعايير المفتوحة'
      }
    },
    templates: {
      pageTitle: 'قوالب التوثيق الرسمي',
      subtitle: 'اختر قالباً لملء مستندك مسبقاً وربطه بـ Bitcoin',
      searchPlaceholder: 'البحث في القوالب…',
      downloadPdf: 'تنزيل PDF',
      emailPackage: 'إرسال الحزمة بالبريد',
      anchorBitcoin: 'ربط بـ Bitcoin',
      saveVault: 'حفظ في الخزنة',
      print: 'طباعة المستند',
      backToTemplates: '← العودة إلى القوالب',
      preview: 'معاينة',
      shareLink: 'نسخ رابط المشاركة',
      darkMode: 'الوضع الداكن',
      fieldsComplete: 'الحقول المكتملة',
      checklist: 'قائمة التحقق',
      versionHistory: 'سجل الإصدارات',
      restore: 'استعادة',
      zeroKnowledge: 'معرفة صفرية',
      zeroKnowledgeDesc: 'لا يغادر محتوى مستندك جهازك أبداً — يُرسل فقط تجزئة SHA-256 إلى الخادم.',
      progress: 'من الحقول مملوءة'
    },
    contracts: {
      pageTitle: 'العقود',
      newArtifact: 'إنشاء حزمة جديدة',
      downloadAll: 'تنزيل الكل',
      statusDraft: 'مسودة',
      statusSigned: 'موقّع',
      statusTimestamped: 'مُختوم زمنياً',
      edit: 'تعديل',
      delete: 'حذف',
      inspector: 'الفاحص',
      documentName: 'اسم المستند',
      proofPackage: 'حزمة الإثبات',
      emailPackage: 'إرسال الحزمة بالبريد',
      otsQr: 'رمز QR للتحقق OTS',
      scanToVerify: 'امسح للتحقق'
    },
    verify: {
      pageTitle: 'التحقق من المستند',
      subtitle: 'قم بتحميل مستند وملف الإثبات .ots الخاص به لتأكيد صحته على سلسلة كتل Bitcoin',
      verified: 'تم التحقق',
      invalid: 'غير صالح',
      pending: 'في انتظار التأكيد',
      copyHash: 'نسخ التجزئة',
      viewOnChain: 'عرض على السلسلة'
    },
    forum: {
      pageTitle: 'المنتدى',
      subtitle: 'ناقش التوثيق الرسمي وأدلة Bitcoin والمستندات المحمية من التلاعب.',
      newThread: 'بدء موضوع جديد',
      threadTitle: 'عنوان الموضوع',
      yourName: 'اسمك',
      createThread: 'إنشاء',
      writePost: 'اكتب مشاركتك…',
      postReply: 'نشر الرد',
      backToForum: '← العودة إلى المنتدى',
      noDiscussions: 'لا توجد مناقشات بعد'
    },
    dashboard: {
      welcome: 'مرحباً بك في Satohash',
      welcomeSubtitle:
        'مركزك لإدارة المستندات المحمية من التلاعب. قم بالختم والتحقق وإدارة جميع مستنداتك الموثقة في مكان واحد.',
      dismiss: 'إغلاق',
      recentActivity: 'النشاط الأخير',
      quickActions: 'إجراءات سريعة'
    },
    settings: {
      pageTitle: 'الإعدادات',
      theme: 'السمة',
      language: 'اللغة',
      account: 'الحساب',
      notifications: 'الإشعارات',
      save: 'حفظ التغييرات',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح'
    },
    access: {
      signIn: 'تسجيل الدخول',
      title: 'مرحباً بك في Satohash',
      subtitle: 'المعيار الاحترافي للتوثيق الرسمي للمستندات المرتبطة بـ Bitcoin',
      getStarted: 'ابدأ الآن',
      learnMore: 'اعرف المزيد'
    },
    errors: {
      generic: 'حدث خطأ ما',
      network: 'خطأ في الشبكة — يرجى المحاولة مرة أخرى',
      hashFailed: 'فشل توليد التجزئة',
      stampFailed: 'فشل ختم المستند',
      verifyFailed: 'فشل التحقق',
      loadFailed: 'فشل التحميل'
    },
    footer: {
      verifyAt: 'تحقق من هذا المستند على',
      poweredBy: 'مدعوم بـ OpenTimestamps و Bitcoin',
      createdBy: 'أنشأه',
      rights: 'جميع الحقوق محفوظة'
    }
  }
}

export const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (_section, key) => key,
  dir: 'ltr'
})

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  const applyLang = useCallback((rawCode) => {
    const code = normalizeLang(rawCode)
    setLangState(code)
    localStorage.setItem(STORAGE_KEY, code)
    syncLangToUrl(code)
    const meta = getLanguageMeta(code)
    document.documentElement.lang = code === 'zh' ? 'zh-Hans' : code
    document.documentElement.dir = meta.dir
    if (normalizeLang(i18n.language) !== code) {
      i18n.changeLanguage(code)
    }
    return code
  }, [])

  const setLang = useCallback((code) => applyLang(code), [applyLang])

  // Boot: align i18next + DOM with resolved initial language
  useEffect(() => {
    applyLang(getInitialLang())
  }, [applyLang])

  // Keep React state in sync when i18next changes (e.g. onboarding LanguagePicker)
  useEffect(() => {
    const onChange = (lng) => {
      const code = normalizeLang(lng)
      setLangState((prev) => (prev === code ? prev : code))
      syncLangToUrl(code)
      const meta = getLanguageMeta(code)
      document.documentElement.lang = code === 'zh' ? 'zh-Hans' : code
      document.documentElement.dir = meta.dir
    }
    i18n.on('languageChanged', onChange)
    return () => i18n.off('languageChanged', onChange)
  }, [])

  // React to ?lang= changes (back/forward, shared links)
  useEffect(() => {
    const onPopState = () => {
      const fromUrl = new URLSearchParams(window.location.search).get('lang')
      if (fromUrl) applyLang(fromUrl)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [applyLang])

  const t = (section, key) =>
    translations[lang]?.[section]?.[key] ?? translations.en?.[section]?.[key] ?? key

  const dir = getLanguageMeta(lang).dir

  return <I18nContext.Provider value={{ lang, setLang, t, dir }}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)
