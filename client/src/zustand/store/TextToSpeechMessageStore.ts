import { create } from "zustand";

type TextToSpeechMessage = {
    you: string;
    bot: string;
};

interface TextToSpeechMessageStoreType {
    allTextToSpeechMessages: TextToSpeechMessage[];
    addYourMsg: (msg: string) => void;
    addBotMsg: (msg: string) => void;
    setAllTextToSpeechMessages: (messages: TextToSpeechMessage[]) => void;
}

export const useTextToSpeechMessageStore = create<TextToSpeechMessageStoreType>((set) => ({
    allTextToSpeechMessages: [],

    addYourMsg: (msg) =>
        set((state) => ({
            allTextToSpeechMessages: [...state.allTextToSpeechMessages, { you: msg, bot: "" }],
        })),

    addBotMsg: (msg) =>
        set((state) => {
            const updatedMessages = [...state.allTextToSpeechMessages];
            if (updatedMessages.length > 0) {
                // last message ko update karo agar bot empty hai
                const lastMsg = updatedMessages[updatedMessages.length - 1];
                if (lastMsg.bot === "") {
                    lastMsg.bot = msg;
                } else {
                    // agar last message mai already bot text hai toh naya message bana do
                    updatedMessages.push({ you: "", bot: msg });
                }
            } else {
                // agar koi message hi nahi hai toh directly add karo
                updatedMessages.push({ you: "", bot: msg });
            }

            return { allTextToSpeechMessages: updatedMessages };
        }),


    setAllTextToSpeechMessages: (messages) =>
        set({ allTextToSpeechMessages: messages }),
}));