/** Shared PDF asset helpers — used by pdfGenerator and ContractView. */
export async function loadLogoDataUrl(src = '/logo.png') {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d').drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

export async function qrDataUrlForVerify(contractId) {
  const { getVerifyUrl } = await import('../config/constants')
  const QRCode = (await import('qrcode')).default
  return QRCode.toDataURL(`${getVerifyUrl()}/${contractId}`, {
    width: 200,
    margin: 1,
    color: { dark: '#F7931A', light: '#ffffff' }
  })
}
