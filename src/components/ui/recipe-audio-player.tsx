"use client";

import { useState } from "react";
import WavesurferPlayer from "@wavesurfer/react";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";

import { Button } from "@/components/ui/button";

type WaveSurferInstance = {
  getCurrentTime: () => number;
  playPause: () => void;
  setTime: (time: number) => void;
};

type RecipeAudioPlayerProps = {
  url: string;
};

export default function RecipeAudioPlayer({ url }: RecipeAudioPlayerProps) {
  const [wavesurfer, setWavesurfer] = useState<WaveSurferInstance | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlayPause = () => {
    wavesurfer?.playPause()
  };

  const onSkipForward = () => {
    if (!wavesurfer) {
      return;
    }

    const currentTime = wavesurfer.getCurrentTime();
    wavesurfer.setTime(currentTime + 10);
  };

  const onSkipBack = () => {
    if (!wavesurfer) {
      return;
    }

    const currentTime = wavesurfer.getCurrentTime();
    wavesurfer.setTime(Math.max(0, currentTime - 10));
  };

  return (
    <div className="mb-4 rounded-lg border border-[#d8e2d6] bg-white/90 p-3 sm:p-4">
      <WavesurferPlayer
        height={64}
        waveColor="#b8d0bd"
        progressColor="#c75a2d"
        url={url}
        onReady={setWavesurfer}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="mt-4 flex items-center justify-center gap-4">
        <Button
          type="button"
          onClick={onSkipBack}
          variant="outline"
          size="icon"
          className="size-11 rounded-md"
          aria-label="Skip back 10 seconds"
        >
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button
          type="button"
          onClick={onPlayPause}
          size="icon"
          className="size-12 rounded-md"
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
        <Button
          type="button"
          onClick={onSkipForward}
          variant="outline"
          size="icon"
          className="size-11 rounded-md"
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
