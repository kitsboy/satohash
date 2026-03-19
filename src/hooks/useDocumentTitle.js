import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const originalTitle = document.title
    document.title = title ? `${title} | Satohash` : 'Satohash - Cryptographic Contract Proof'

    return () => {
      document.title = originalTitle
    }
  }, [title])
}
