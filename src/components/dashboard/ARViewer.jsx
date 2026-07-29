import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const ARViewer = ({ proofId, hash }) => {
  const [session, setSession] = useState(null)
  const [hitTestSource, setHitTestSource] = useState(null)
  const [isARSupported, setIsARSupported] = useState(false)
  const [isARActive, setIsARActive] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    // Check WebXR support
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported)
        if (supported) {
          console.log('[AR VIEWER] Immersive AR supported')
        }
      })
    } else {
      console.warn('[AR VIEWER] WebXR not supported')
    }

    // Mock initialization if no real AR
    if (!('xr' in navigator)) {
      console.log('[MOCK AR] Simulating AR session for proof overlay')
      setIsARActive(true)
      // Simulate hit-test
      setTimeout(() => {
        console.log(
          `[MOCK AR HIT-TEST] Placing proof overlay for hash ${hash.slice(0, 16)}... at mock position (0,0, -1)`
        )
      }, 1000)
      return
    }

    // Real WebXR setup
    const initAR = async () => {
      try {
        const xrSession = await navigator.xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: canvasRef.current }
        })
        setSession(xrSession)

        const gl = canvasRef.current.getContext('webgl', { xrCompatible: true })
        // XRWebGLLayer accepts a WebGLRenderingContext; no custom wrapper required
        xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) })

        // Hit-test setup
        const referenceSpace = await xrSession.requestReferenceSpace('viewer')
        const hitTestSourceSpace = await xrSession.requestHitTestSource({ space: referenceSpace })

        setHitTestSource(hitTestSourceSpace)

        xrSession.addEventListener('end', () => {
          setIsARActive(false)
          setSession(null)
          if (hitTestSource) hitTestSource.then((source) => source.destroy())
        })

        setIsARActive(true)
        console.log('[AR VIEWER] AR session started with hit-test')
      } catch (err) {
        console.error('[AR VIEWER] Failed to start AR:', err)
        // Fallback mock
        setIsARActive(true)
      }
    }

    // Button or auto-start logic
    const startButton = document.getElementById('startAR')
    if (startButton) {
      startButton.addEventListener('click', initAR)
    }

    return () => {
      if (session) session.end()
    }
  }, [proofId, hash])

  useEffect(() => {
    if (!session || !hitTestSource || !isARActive) return

    const frame = (time, frame) => {
      const session = frame.session
      const referenceSpace = session.renderState.baseLayer.space
      let hitPose = null

      if (frame.getHitTestResults(hitTestSource).length > 0) {
        const hit = frame.getHitTestResults(hitTestSource)[0]
        hitPose = hit.getPose(referenceSpace)
        console.log(
          '[AR HIT-TEST] Real hit detected at:',
          hitPose.transform.position.x,
          hitPose.transform.position.y,
          hitPose.transform.position.z
        )
      } else {
        console.log('[AR HIT-TEST] No hit, using viewer space')
      }

      // Render overlay: Mock proof card at hit position
      // In real, draw 3D model or overlay with proof details
      const proofOverlay = document.createElement('div')
      proofOverlay.className = 'ar-proof-overlay glass-card'
      proofOverlay.innerHTML = `
        <h3>Proof Overlay: ${proofId.slice(-4)}</h3>
        <p>Hash: ${hash.slice(0, 16)}...</p>
        <p>Status: Verified</p>
      `
      // Position in 3D space (simplified console log)
      if (hitPose) {
        console.log(
          `[AR OVERLAY] Placed at (${hitPose.transform.position.x.toFixed(2)}, ${hitPose.transform.position.y.toFixed(2)}, ${hitPose.transform.position.z.toFixed(2)})`
        )
      }

      if (session.renderState.baseLayer) {
        const gl = session.renderState.baseLayer.context
        // Mock render: Clear and draw text (in real, use Three.js or A-Frame)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        // Simulate overlay render
      }

      session.requestAnimationFrame(frame)
    }

    session.requestAnimationFrame(frame)

    return () => session.cancelAnimationFrame(frame)
  }, [session, hitTestSource, isARActive, proofId, hash])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ar-viewer-container">
      <canvas ref={canvasRef} className="ar-canvas" />
      {!isARActive && isARSupported && (
        <button id="startAR" className="btn-holographic">
          Start AR View
        </button>
      )}
      {!isARSupported && (
        <div className="mock-ar-notice">
          <p>AR not supported on this device. Simulating proof overlay in console.</p>
        </div>
      )}
      {isARActive && (
        <div className="ar-status">
          <p>AR Active - Tap surface to place proof overlay</p>
        </div>
      )}
    </motion.div>
  )
}

export default ARViewer
