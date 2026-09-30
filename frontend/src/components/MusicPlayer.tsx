import { useState, useRef, useEffect } from 'react'
import { Music } from 'lucide-react'

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio()
    const base = import.meta.env.BASE_URL.endsWith('/') 
      ? import.meta.env.BASE_URL 
      : `${import.meta.env.BASE_URL}/`
    
    // Try anthem.mp3 first, then URL-encoded original filename as fallback
    audio.src = `${base}audio/anthem.mp3`
    audio.loop = true
    audio.volume = 0.7

    audio.addEventListener('error', () => {
      console.warn('anthem.mp3 failed, trying fallback...')
      audio.src = encodeURI(`${base}audio/Azadi - Gully Boy Ranveer Singh Alia Bhatt DIVINE Dub Sharma Siddhant Zoya Akhtar.mp3`)
    })

    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const togglePlay = async () => {
    if (!audioRef.current) return
    try {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        await audioRef.current.play()
      }
    } catch (e) {
      console.error("Audio playback error:", e)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <div className="hidden sm:block font-mono text-xs text-text-muted bg-surface/80 border border-border px-3 py-1.5 backdrop-blur-md">
        {isPlaying ? '▶ Playing Anthem: Azadi' : '♫ Anthem: Hum Leke Rahenge Azadi'}
      </div>
      <button 
        onClick={togglePlay}
        className="w-12 h-12 rounded-full border border-border bg-surface/80 backdrop-blur-md flex items-center justify-center text-text hover:border-text transition-colors group relative overflow-hidden shadow-lg"
        title="Toggle Anthem: Hum Leke Rahenge Azadi"
        aria-label="Toggle ambient music"
      >
        {!isPlaying ? (
          <Music className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity animate-pulse" />
        ) : (
          <div className="flex items-end gap-[2px] h-4">
            <div className="w-1 bg-accent animate-[bounce_1s_infinite] h-full"></div>
            <div className="w-1 bg-accent animate-[bounce_1.2s_infinite_0.1s] h-3/4"></div>
            <div className="w-1 bg-accent animate-[bounce_0.8s_infinite_0.2s] h-full"></div>
            <div className="w-1 bg-accent animate-[bounce_1.1s_infinite_0.3s] h-1/2"></div>
          </div>
        )}
      </button>
    </div>
  )
}
