import React, { useState, useRef } from 'react'
import { Mic, MicOff, FileText, Check, Hash } from 'lucide-react'
import { toast } from 'sonner'

export default function VoiceStamp({ onStamp, isActive }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const recognitionRef = useRef(null)

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.')
      return
    }

    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setTranscript('')
    }

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart
        } else {
          interimTranscript += transcriptPart
        }
      }

      setTranscript(finalTranscript + interimTranscript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      toast.error(`Recognition error: ${event.error}`)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      if (transcript.trim()) {
        handleStamp()
      }
    }

    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
  }

  const handleStamp = async () => {
    if (!transcript.trim()) return

    setIsProcessing(true)
    try {
      // Hash the transcript as if it's a text file content
      const encoder = new TextEncoder()
      const data = encoder.encode(transcript)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hash = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      // Simulate file object for onStamp
      const voiceFile = {
        name: `voice_stamp_${Date.now()}.txt`,
        hash,
        content: transcript // For display
      }

      onStamp(voiceFile)
      toast.success('Voice stamp created successfully!')
      setTranscript('')
    } catch (error) {
      toast.error('Failed to process voice stamp.')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isActive) return null

  return (
    <div className="voice-stamp-wrapper rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold text-[var(--text-primary)]">Voice Stamp</h4>
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`rounded-full p-2 transition-colors ${
            isListening ? 'bg-red-500 text-white' : 'bg-[var(--accent-active)] text-white hover:opacity-90'
          }`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
      </div>
      {isListening && (
        <p className="mb-2 text-xs text-[var(--text-secondary)]">Listening... Speak your document or command.</p>
      )}
      {transcript && (
        <div className="transcript-preview mb-2 max-h-20 overflow-y-auto rounded bg-[var(--surface-raised)] p-2 text-xs text-[var(--text-primary)]">
          <FileText size={12} className="mr-1 inline" />
          {transcript}
        </div>
      )}
      {isProcessing && <p className="text-xs text-[var(--accent-active)]">Processing hash and stamping...</p>}
      {transcript && !isListening && !isProcessing && (
        <button
          onClick={handleStamp}
          disabled={isProcessing}
          className="flex w-full items-center justify-center gap-2 rounded bg-[var(--accent-active)] py-2 text-xs text-white hover:opacity-90"
        >
          <Hash size={14} />
          Stamp Voice Transcript
        </button>
      )}
    </div>
  )
}
