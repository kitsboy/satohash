#!/usr/bin/env node
/**
 * Fill 28 missing marketing pages keys (stampPage / verifyPublicPage /
 * evidence / distressed / templateDetail / vault revoke) for non-EN locales.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'i18n', 'marketing')
const LANGS = ['es', 'fr', 'de', 'pt', 'sw', 'zh']

const PATCH = {
  es: {
    verifyPublicPage: {
      validFingerprint: 'Huella válida',
      hashOnlyMessage:
        'Huella SHA-256 válida. No hay atestación de Bitcoin en la bóveda local: se necesita API o archivo .ots para la prueba completa.',
      localVault: 'Cargado desde la bóveda local de este dispositivo.',
      exportVc: 'Exportar credencial verificable'
    },
    stampPage: {
      motopassLoaded: 'Hash de MotoPass cargado',
      motopassDesc:
        'Sube el archivo correspondiente para completar el sellado, o sella el hash vía calendarios públicos.',
      linkedHashReady:
        'Hash de MotoPass / vinculado listo: sella en OpenTimestamps sin volver a subir un archivo.',
      stampHashBtn: 'Sellar hash vía calendarios públicos',
      step1Label: 'Suelta tu archivo',
      step1Desc: 'Cualquier formato. Se queda en tu dispositivo — nunca se sube.',
      step2Label: 'Lo hasheamos localmente',
      step2Desc: 'Se calcula una huella SHA-256 única en tu navegador.',
      step3Label: 'Bitcoin lo marca en el tiempo',
      step3Desc: 'La huella se escribe de forma permanente en la blockchain.'
    },
    evidenceAdmissibilityPage: {
      title: 'Guía de admisibilidad de pruebas',
      subtitle:
        'Matriz de jurisdicciones para pruebas basadas en hash bajo UETA, eIDAS, Reino Unido y derecho transfronterizo.'
    },
    distressedAssetPage: {
      title: 'Atestación de activos en dificultades',
      subtitle:
        'Hashea metadatos de listados para operaciones soberanas. Combínalo con .ots alojados de listados MotoPass.',
      stampListing: 'Sellar hash del listado',
      compareHosted: 'Comparar con prueba alojada',
      hostedPlaceholder: 'URL de .ots alojado en motopass o CDN'
    },
    templateDetailPage: {
      notFound: 'Plantilla no encontrada',
      loadError: 'No se pudo cargar la plantilla',
      demoBadge: 'Datos de demostración'
    },
    vaultPage: {
      revoke: {
        title: 'Revocar prueba',
        body: 'Esto marca el registro como revocado de forma permanente. El ancla de Bitcoin permanece inmutable.',
        confirm: 'Confirmar revocación',
        cancel: 'Cancelar'
      }
    }
  },
  fr: {
    verifyPublicPage: {
      validFingerprint: 'Empreinte valide',
      hashOnlyMessage:
        'Empreinte SHA-256 valide. Aucune attestation Bitcoin dans le coffre local — API ou fichier .ots requis pour la preuve complète.',
      localVault: 'Chargé depuis votre coffre local sur cet appareil.',
      exportVc: 'Exporter la credential vérifiable'
    },
    stampPage: {
      motopassLoaded: 'Hash MotoPass chargé',
      motopassDesc:
        'Téléversez le fichier correspondant pour terminer le tampon, ou tamponnez le hash via les calendriers publics.',
      linkedHashReady:
        'Hash MotoPass / lié prêt — tamponnez vers OpenTimestamps sans re-téléverser un fichier.',
      stampHashBtn: 'Tamponner le hash via calendriers publics',
      step1Label: 'Déposez votre fichier',
      step1Desc: 'Tout format. Reste sur votre appareil — jamais téléversé.',
      step2Label: 'Nous le hachons localement',
      step2Desc: 'Une empreinte SHA-256 unique est calculée dans votre navigateur.',
      step3Label: 'Bitcoin l’horodate',
      step3Desc: 'L’empreinte est écrite de façon permanente sur la blockchain.'
    },
    evidenceAdmissibilityPage: {
      title: 'Guide d’admissibilité des preuves',
      subtitle:
        'Matrice juridictionnelle pour les preuves basées sur hash sous UETA, eIDAS, Royaume-Uni et droit transfrontalier.'
    },
    distressedAssetPage: {
      title: 'Attestation d’actifs en difficulté',
      subtitle:
        'Hashez les métadonnées d’annonces pour des échanges souverains. Associez aux .ots hébergés des listes MotoPass.',
      stampListing: 'Tamponner le hash de l’annonce',
      compareHosted: 'Comparer à la preuve hébergée',
      hostedPlaceholder: 'URL .ots hébergée sur motopass ou CDN'
    },
    templateDetailPage: {
      notFound: 'Modèle introuvable',
      loadError: 'Impossible de charger le modèle',
      demoBadge: 'Données de démo'
    },
    vaultPage: {
      revoke: {
        title: 'Révoquer la preuve',
        body: 'Cela marque définitivement l’enregistrement comme révoqué. L’ancre Bitcoin reste immuable.',
        confirm: 'Confirmer la révocation',
        cancel: 'Annuler'
      }
    }
  },
  de: {
    verifyPublicPage: {
      validFingerprint: 'Gültiger Fingerabdruck',
      hashOnlyMessage:
        'Gültiger SHA-256-Fingerabdruck. Keine Bitcoin-Attestierung im lokalen Tresor — API oder .ots-Datei für den vollständigen Nachweis erforderlich.',
      localVault: 'Aus Ihrem lokalen Tresor auf diesem Gerät geladen.',
      exportVc: 'Verifizierbare Credential exportieren'
    },
    stampPage: {
      motopassLoaded: 'MotoPass-Hash geladen',
      motopassDesc:
        'Laden Sie die passende Datei hoch, um den Stempel abzuschließen, oder stempeln Sie den Hash über öffentliche Kalender.',
      linkedHashReady:
        'MotoPass- / verknüpfter Hash bereit — mit OpenTimestamps stempeln, ohne die Datei erneut hochzuladen.',
      stampHashBtn: 'Hash über öffentliche Kalender stempeln',
      step1Label: 'Datei ablegen',
      step1Desc: 'Jedes Format. Bleibt auf Ihrem Gerät — wird nie hochgeladen.',
      step2Label: 'Wir hashen lokal',
      step2Desc: 'Ein eindeutiger SHA-256-Fingerabdruck wird im Browser berechnet.',
      step3Label: 'Bitcoin zeitstempelt ihn',
      step3Desc: 'Der Fingerabdruck wird dauerhaft in die Blockchain geschrieben.'
    },
    evidenceAdmissibilityPage: {
      title: 'Leitfaden zur Beweiszulässigkeit',
      subtitle:
        'Jurisdiktionsmatrix für hash-basierte Beweise unter UETA, eIDAS, UK und grenzüberschreitendem Recht.'
    },
    distressedAssetPage: {
      title: 'Attestierung notleidender Vermögenswerte',
      subtitle:
        'Hashe Listing-Metadaten für souveräne Asset-Trades. Kombiniere mit gehosteten .ots von MotoPass-Listings.',
      stampListing: 'Listing-Hash stempeln',
      compareHosted: 'Mit gehostetem Nachweis vergleichen',
      hostedPlaceholder: 'Gehostete .ots-URL auf motopass oder CDN'
    },
    templateDetailPage: {
      notFound: 'Vorlage nicht gefunden',
      loadError: 'Vorlage konnte nicht geladen werden',
      demoBadge: 'Demo-Daten'
    },
    vaultPage: {
      revoke: {
        title: 'Nachweis widerrufen',
        body: 'Dies markiert den Eintrag dauerhaft als widerrufen. Der Bitcoin-Anker bleibt unveränderlich.',
        confirm: 'Widerruf bestätigen',
        cancel: 'Abbrechen'
      }
    }
  },
  pt: {
    verifyPublicPage: {
      validFingerprint: 'Impressão digital válida',
      hashOnlyMessage:
        'Impressão SHA-256 válida. Atestação Bitcoin não encontrada no cofre local — API ou arquivo .ots necessário para a prova completa.',
      localVault: 'Carregado do seu cofre local neste dispositivo.',
      exportVc: 'Exportar credencial verificável'
    },
    stampPage: {
      motopassLoaded: 'Hash MotoPass carregado',
      motopassDesc:
        'Envie o arquivo correspondente para concluir o carimbo, ou carimbe o hash via calendários públicos.',
      linkedHashReady:
        'Hash MotoPass / vinculado pronto — carimbe no OpenTimestamps sem reenviar o arquivo.',
      stampHashBtn: 'Carimbar hash via calendários públicos',
      step1Label: 'Solte seu arquivo',
      step1Desc: 'Qualquer formato. Fica no seu dispositivo — nunca é enviado.',
      step2Label: 'Hasheamos localmente',
      step2Desc: 'Uma impressão SHA-256 única é calculada no seu navegador.',
      step3Label: 'O Bitcoin carimba no tempo',
      step3Desc: 'A impressão é gravada permanentemente na blockchain.'
    },
    evidenceAdmissibilityPage: {
      title: 'Guia de admissibilidade de provas',
      subtitle:
        'Matriz de jurisdições para provas baseadas em hash sob UETA, eIDAS, Reino Unido e direito transfronteiriço.'
    },
    distressedAssetPage: {
      title: 'Atestação de ativos em dificuldade',
      subtitle:
        'Hasheie metadados de listagens para operações soberanas. Combine com .ots hospedados de listagens MotoPass.',
      stampListing: 'Carimbar hash da listagem',
      compareHosted: 'Comparar com prova hospedada',
      hostedPlaceholder: 'URL de .ots hospedado em motopass ou CDN'
    },
    templateDetailPage: {
      notFound: 'Modelo não encontrado',
      loadError: 'Não foi possível carregar o modelo',
      demoBadge: 'Dados de demonstração'
    },
    vaultPage: {
      revoke: {
        title: 'Revogar prova',
        body: 'Isto marca o registro como revogado permanentemente. A âncora Bitcoin permanece imutável.',
        confirm: 'Confirmar revogação',
        cancel: 'Cancelar'
      }
    }
  },
  sw: {
    verifyPublicPage: {
      validFingerprint: 'Alama halali',
      hashOnlyMessage:
        'Alama halali ya SHA-256. Uthibitisho wa Bitcoin haupo kwenye vault ya ndani — API au faili .ots inahitajika kwa uthibitisho kamili.',
      localVault: 'Imepakuliwa kutoka vault yako ya ndani kwenye kifaa hiki.',
      exportVc: 'Hamisha cheti kinachoweza kuthibitishwa'
    },
    stampPage: {
      motopassLoaded: 'Hash ya MotoPass imepakiwa',
      motopassDesc:
        'Pakia faili inayolingana kukamilisha muhuri, au weka muhuri wa hash kupitia kalenda za umma.',
      linkedHashReady:
        'Hash ya MotoPass / iliyounganishwa iko tayari — weka muhuri kwenye OpenTimestamps bila kupakia faili tena.',
      stampHashBtn: 'Weka muhuri wa hash kupitia kalenda za umma',
      step1Label: 'Dondosha faili yako',
      step1Desc: 'Aina yoyote. Inabaki kwenye kifaa chako — haipandishwi kamwe.',
      step2Label: 'Tunahesabu hash ndani',
      step2Desc: 'Alama ya kipekee ya SHA-256 inahesabiwa kwenye kivinjari chako.',
      step3Label: 'Bitcoin inaweka muhuri wa muda',
      step3Desc: 'Alama inaandikwa kabisa kwenye blockchain.'
    },
    evidenceAdmissibilityPage: {
      title: 'Mwongozo wa kukubalika kwa ushahidi',
      subtitle:
        'Jedwali la mamlaka kwa ushahidi wa hash chini ya UETA, eIDAS, Uingereza, na sheria za kuvuka mipaka.'
    },
    distressedAssetPage: {
      title: 'Uthibitisho wa mali yenye shida',
      subtitle:
        'Hash metadata ya orodha kwa biashara huru. Unganisha na .ots zilizohifadhiwa kutoka orodha za MotoPass.',
      stampListing: 'Weka muhuri wa hash ya orodha',
      compareHosted: 'Linganisha na uthibitisho uliohifadhiwa',
      hostedPlaceholder: 'URL ya .ots iliyohifadhiwa kwenye motopass au CDN'
    },
    templateDetailPage: {
      notFound: 'Kiolezo hakijapatikana',
      loadError: 'Haikuweza kupakia kiolezo',
      demoBadge: 'Data ya onyesho'
    },
    vaultPage: {
      revoke: {
        title: 'Batilisha uthibitisho',
        body: 'Hii inaweka alama ya rekodi kama imebatilishwa kabisa. Nanga ya Bitcoin inabakia isiyobadilika.',
        confirm: 'Thibitisha kubatilisha',
        cancel: 'Ghairi'
      }
    }
  },
  zh: {
    verifyPublicPage: {
      validFingerprint: '有效指纹',
      hashOnlyMessage:
        '有效的 SHA-256 指纹。本地保险库中未找到比特币证明 — 完整证明需要 API 或 .ots 文件。',
      localVault: '已从此设备的本地保险库加载。',
      exportVc: '导出可验证凭证'
    },
    stampPage: {
      motopassLoaded: '已加载 MotoPass 哈希',
      motopassDesc: '上传匹配文件以完成盖章，或通过公共日历盖章哈希。',
      linkedHashReady: 'MotoPass / 关联哈希已就绪 — 无需重新上传文件即可盖章到 OpenTimestamps。',
      stampHashBtn: '通过公共日历盖章哈希',
      step1Label: '拖放您的文件',
      step1Desc: '任意格式。留在您的设备上 — 永不上传。',
      step2Label: '我们在本地计算哈希',
      step2Desc: '在浏览器中计算唯一的 SHA-256 指纹。',
      step3Label: '比特币为其打时间戳',
      step3Desc: '指纹被永久写入区块链。'
    },
    evidenceAdmissibilityPage: {
      title: '证据可采性指南',
      subtitle: '在 UETA、eIDAS、英国及跨境法律下基于哈希的证据管辖矩阵。'
    },
    distressedAssetPage: {
      title: '困境资产证明',
      subtitle: '为主权资产交易哈希列表元数据。可与 MotoPass 托管的 .ots 配对。',
      stampListing: '盖章列表哈希',
      compareHosted: '与托管证明比对',
      hostedPlaceholder: 'motopass 或 CDN 上的托管 .ots URL'
    },
    templateDetailPage: {
      notFound: '未找到模板',
      loadError: '无法加载模板',
      demoBadge: '演示数据'
    },
    vaultPage: {
      revoke: {
        title: '撤销证明',
        body: '这将永久将该记录标记为已撤销。比特币锚点保持不可变。',
        confirm: '确认撤销',
        cancel: '取消'
      }
    }
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

console.log('Done — 28 missing marketing keys filled for', LANGS.join(', '))
