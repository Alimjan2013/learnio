import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const speechAPI = (word: string, speed: number) => {
  const speechSynthesis = window.speechSynthesis;
  const voices = speechSynthesis.getVoices();
  const utterance = new SpeechSynthesisUtterance(word);
  const voice = voices.find((v) => v.name.includes("Samantha"));
  utterance.voice = voice as SpeechSynthesisVoice | null;

  // Set the speaking speed
  utterance.rate = speed;

  utterance.addEventListener("start", () => {
    console.log("Speech started");
  });

  utterance.addEventListener("end", () => {
    console.log("Speech ended");
  });

  speechSynthesis.speak(utterance);
};
