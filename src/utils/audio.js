import { Howl } from 'howler'

/**
 * Item 130: Genesis UI Soundscape
 * "Subtle, high-fidelity haptic audio for protocol-level events."
 */

export const GenesisAudio = {
  STAMP: new Howl({
    src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_f5f3ff6d14.mp3'], // High-tech click
    volume: 0.1
  }),
  CONFIRM: new Howl({
    src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_f5f3ff6d14.mp3'], // Placeholder confirm
    volume: 0.2
  }),
  PULSE: new Howl({
    src: ['https://cdn.pixabay.com/audio/2022/03/15/audio_51d28399e5.mp3'], // Base hum
    volume: 0.05,
    loop: true
  })
}

export const playStamp = () => GenesisAudio.STAMP.play()
export const playConfirm = () => GenesisAudio.CONFIRM.play()
export const startPulse = () => GenesisAudio.PULSE.play()
export const stopPulse = () => GenesisAudio.PULSE.stop()
