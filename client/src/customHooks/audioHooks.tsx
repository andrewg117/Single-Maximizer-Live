import { useState } from "react";

export const useAudioState = (initAudio: object = {}) => {
  const [audioState, setAudio] = useState<FormData | object>(initAudio);

  const changeAudioFile = (file: FormData | null) => {
    setAudio(file as FormData);
  };

  return { audioState, setAudio, changeAudioFile };
}