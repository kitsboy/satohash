import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [lastEvent, setLastEvent] = useState(null)

  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.on('ots:stamped', (data) => {
      setLastEvent({ type: 'stamped', data })
      toast.info(`New hash stamped: ${data.filename}`)
    })

    newSocket.on('ots:upgrade:status', (data) => {
      setLastEvent({ type: 'upgrade:status', data })
    })

    newSocket.on('ots:confirmed', (data) => {
      const blockHeight = data.blockHeight ?? data.bitcoin_block_height
      setLastEvent({ type: 'confirmed', data: { ...data, blockHeight } })
      if (blockHeight) {
        toast.success(`Proof confirmed in Bitcoin block ${blockHeight}!`, {
          description: data.hash ? `Hash: ${data.hash.substring(0, 16)}...` : undefined,
          duration: 10000
        })
      }
      // Mobile push via SW
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'PUSH_NOTIFICATION',
          title: 'Stamp Confirmed!',
          body: `Your proof is now anchored in Bitcoin block ${blockHeight}.`,
          hash: data.hash
        })
      }
    })

    return () => newSocket.close()
  }, [])

  return { socket, lastEvent }
}
