"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Flame, CloudRain, Sparkles } from "lucide-react";

export default function AmbientSoundscape() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<"fire" | "rain">("fire");
  const [volume, setVolume] = useState(0.35);
  const [isOpen, setIsOpen] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const generatorTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Create pink noise buffer for rain or fire
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter
      const filter = ctx.createBiquadFilter();
      filter.type = soundType === "rain" ? "lowpass" : "bandpass";
      filter.frequency.setValueAtTime(soundType === "rain" ? 800 : 420, ctx.currentTime);
      filter.Q.setValueAtTime(soundType === "rain" ? 1.2 : 2.5, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      // Intermittent crackles for fireplace
      if (soundType === "fire") {
        const playCrackle = () => {
          if (!audioCtxRef.current || !masterGainRef.current) return;
          const currTime = audioCtxRef.current.currentTime;
          const osc = audioCtxRef.current.createOscillator();
          const crackleGain = audioCtxRef.current.createGain();

          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(150 + Math.random() * 800, currTime);
          osc.frequency.exponentialRampToValueAtTime(40, currTime + 0.03);

          crackleGain.gain.setValueAtTime(0.08 * Math.random(), currTime);
          crackleGain.gain.exponentialRampToValueAtTime(0.001, currTime + 0.04);

          osc.connect(crackleGain);
          crackleGain.connect(masterGainRef.current);
          osc.start();
          osc.stop(currTime + 0.05);

          const nextDelay = 80 + Math.random() * 450;
          generatorTimerRef.current = setTimeout(playCrackle, nextDelay);
        };
        playCrackle();
      }

      setIsPlaying(true);
    } catch (e) {
      console.error("Audio initialization error:", e);
    }
  };

  const stopAudio = () => {
    if (generatorTimerRef.current) {
      clearTimeout(generatorTimerRef.current);
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const changeSoundType = (type: "fire" | "rain") => {
    setSoundType(type);
    if (isPlaying) {
      stopAudio();
      setTimeout(startAudio, 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setValueAtTime(val, audioCtxRef.current.currentTime);
    }
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <div className="relative">
        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-full shadow-2xl border transition-all duration-300 ${
            isPlaying
              ? "bg-[#10271F] border-[#C8A66A] text-[#DFCA9B] shadow-[#C8A66A]/20"
              : "bg-[#091812]/90 border-[#C8A66A]/30 text-[#F5EBD7]/70 hover:border-[#C8A66A] hover:text-[#F5EBD7]"
          }`}
          title="Ambient Sanctuary Soundscape"
        >
          {isPlaying ? (
            <Flame className="w-4 h-4 text-[#C8A66A] animate-pulse" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#F5EBD7]/60" />
          )}
          <span className="text-xs font-semibold tracking-wider uppercase hidden sm:inline">
            {isPlaying ? (soundType === "fire" ? "Hearth Fire" : "Forest Rain") : "Soundscape"}
          </span>
          {isPlaying && (
            <span className="w-2 h-2 rounded-full bg-[#C8A66A] animate-ping" />
          )}
        </button>

        {/* Floating Settings Drawer */}
        {isOpen && (
          <div className="absolute bottom-14 right-0 w-72 bg-[#10271F]/98 border border-[#C8A66A]/40 rounded-2xl shadow-2xl p-5 space-y-4 backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#C8A66A]/20">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#C8A66A]" />
                <h4 className="font-serif font-bold text-sm text-[#F5EBD7]">
                  Sanctuary Ambience
                </h4>
              </div>
              <span className="text-[10px] text-[#DFCA9B] uppercase tracking-wider font-mono">
                {isPlaying ? "Active" : "Muted"}
              </span>
            </div>

            {/* Atmosphere Type */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => changeSoundType("fire")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  soundType === "fire"
                    ? "bg-[#C8A66A] text-[#091812] shadow-md"
                    : "bg-[#091812] text-[#DFCA9B] border border-[#C8A66A]/20 hover:border-[#C8A66A]/40"
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Hearth Fire</span>
              </button>

              <button
                onClick={() => changeSoundType("rain")}
                className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                  soundType === "rain"
                    ? "bg-[#C8A66A] text-[#091812] shadow-md"
                    : "bg-[#091812] text-[#DFCA9B] border border-[#C8A66A]/20 hover:border-[#C8A66A]/40"
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Forest Rain</span>
              </button>
            </div>

            {/* Volume Scrubber */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-[#DFCA9B]/80 font-mono">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#C8A66A] cursor-pointer"
              />
            </div>

            {/* Main Toggle Button */}
            <button
              onClick={togglePlay}
              className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                isPlaying
                  ? "bg-[#091812] border border-[#C8A66A]/40 text-[#DFCA9B] hover:bg-black/40"
                  : "bg-gradient-to-r from-[#C8A66A] to-[#A68446] text-[#091812] hover:brightness-110 shadow-lg"
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Mute Ambience</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Start Ambient Soundscape</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
