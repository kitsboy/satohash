import { createContext, useContext, useState } from 'react'

export const languages = [
  { code: 'en', label: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', label: 'Español',  flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', label: '中文',      flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦', dir: 'rtl' },
]

export const translations = {
  en: {
    nav: {
      vault: 'Vault', stamp: 'Stamp', atlas: 'Atlas', dashboard: 'Dashboard',
      contracts: 'Contracts', settings: 'Settings', developer: 'Developer API',
      templates: 'Templates', verify: 'Verify', trust: 'Trust Center',
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
      addCoSigner: 'Add Co-Signer',
    },
    vault: {
      title: 'Proof Vault',
      subtitle: 'Your anchored documents',
      search: 'Search vault…',
      download: 'Download OTS',
      verify: 'Verify',
      certificate: 'Certificate',
      pending: 'Pending',
      confirmed: 'Confirmed',
    },
    common: {
      loading: 'Loading…', error: 'Error', cancel: 'Cancel', save: 'Save',
      close: 'Close', back: 'Back', next: 'Next', submit: 'Submit',
      status: 'Status', date: 'Date', actions: 'Actions',
    },
  },
  es: {
    nav: {
      vault: 'Bóveda', stamp: 'Sellar', atlas: 'Atlas', dashboard: 'Panel',
      contracts: 'Contratos', settings: 'Ajustes', developer: 'API Dev',
      templates: 'Plantillas', verify: 'Verificar', trust: 'Centro de Confianza',
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
      addCoSigner: 'Añadir Co-Firmante',
    },
    vault: {
      title: 'Bóveda de Pruebas',
      subtitle: 'Tus documentos anclados',
      search: 'Buscar…',
      download: 'Descargar OTS',
      verify: 'Verificar',
      certificate: 'Certificado',
      pending: 'Pendiente',
      confirmed: 'Confirmado',
    },
    common: {
      loading: 'Cargando…', error: 'Error', cancel: 'Cancelar', save: 'Guardar',
      close: 'Cerrar', back: 'Atrás', next: 'Siguiente', submit: 'Enviar',
      status: 'Estado', date: 'Fecha', actions: 'Acciones',
    },
  },
  fr: {
    nav: {
      vault: 'Coffre', stamp: 'Tamponner', atlas: 'Atlas', dashboard: 'Tableau de bord',
      contracts: 'Contrats', settings: 'Paramètres', developer: 'API Dev',
      templates: 'Modèles', verify: 'Vérifier', trust: 'Centre de confiance',
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
      addCoSigner: 'Ajouter Co-Signataire',
    },
    vault: {
      title: 'Coffre de preuves',
      subtitle: 'Vos documents ancrés',
      search: 'Rechercher…',
      download: 'Télécharger OTS',
      verify: 'Vérifier',
      certificate: 'Certificat',
      pending: 'En attente',
      confirmed: 'Confirmé',
    },
    common: {
      loading: 'Chargement…', error: 'Erreur', cancel: 'Annuler', save: 'Enregistrer',
      close: 'Fermer', back: 'Retour', next: 'Suivant', submit: 'Soumettre',
      status: 'Statut', date: 'Date', actions: 'Actions',
    },
  },
  zh: {
    nav: {
      vault: '保险库', stamp: '盖章', atlas: '图谱', dashboard: '仪表板',
      contracts: '合同', settings: '设置', developer: '开发者API',
      templates: '模板', verify: '验证', trust: '信任中心',
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
      addCoSigner: '添加联署人',
    },
    vault: {
      title: '证明保险库',
      subtitle: '您的锚定文件',
      search: '搜索…',
      download: '下载 OTS',
      verify: '验证',
      certificate: '证书',
      pending: '待处理',
      confirmed: '已确认',
    },
    common: {
      loading: '加载中…', error: '错误', cancel: '取消', save: '保存',
      close: '关闭', back: '返回', next: '下一步', submit: '提交',
      status: '状态', date: '日期', actions: '操作',
    },
  },
  ar: {
    nav: {
      vault: 'الخزنة', stamp: 'ختم', atlas: 'الأطلس', dashboard: 'لوحة القيادة',
      contracts: 'العقود', settings: 'الإعدادات', developer: 'واجهة برمجية',
      templates: 'القوالب', verify: 'التحقق', trust: 'مركز الثقة',
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
      addCoSigner: 'إضافة موقّع مشارك',
    },
    vault: {
      title: 'خزنة الأدلة',
      subtitle: 'مستنداتك المثبتة',
      search: 'بحث…',
      download: 'تنزيل OTS',
      verify: 'تحقق',
      certificate: 'شهادة',
      pending: 'معلّق',
      confirmed: 'مؤكد',
    },
    common: {
      loading: 'جارٍ التحميل…', error: 'خطأ', cancel: 'إلغاء', save: 'حفظ',
      close: 'إغلاق', back: 'رجوع', next: 'التالي', submit: 'إرسال',
      status: 'الحالة', date: 'التاريخ', actions: 'إجراءات',
    },
  },
}

export const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (_section, key) => key,
  dir: 'ltr',
})

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(
    () => localStorage.getItem('satohash_lang') || 'en'
  )

  const setLang = (code) => {
    setLangState(code)
    localStorage.setItem('satohash_lang', code)
  }

  const t = (section, key) =>
    translations[lang]?.[section]?.[key] ??
    translations.en?.[section]?.[key] ??
    key

  const dir = languages.find((l) => l.code === lang)?.dir ?? 'ltr'

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
