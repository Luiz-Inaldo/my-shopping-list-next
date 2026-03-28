"use client";
import { useState, useCallback, useRef } from 'react';

export function useSpeech(onResult: (text: string) => void) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const startListening = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Seu navegador não suporta reconhecimento de voz.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.continuous = true;
        // recognition.interimResults = false; // Só retorna quando ele tiver certeza da frase

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);



        recognitionRef.current = recognition;
        recognition.start();
    }, [onResult]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onResult(transcript);
            };
            recognitionRef.current.stop();
            setIsListening(false);
        }
    }, []);

    return { isListening, startListening, stopListening };
}