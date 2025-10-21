import { create } from "zustand";

type ChatbotMessage = {
    you: string;
    bot: string;
};

interface ChatbotMessageStoreType {
    allChatbotMessages: ChatbotMessage[];
    addYourMsg: (msg: string) => void;
    addBotMsg: (msg: string) => void;
    setAllChatbotMessages: (messages: ChatbotMessage[]) => void;
}

export const useChatbotMessageStore = create<ChatbotMessageStoreType>((set) => ({
    allChatbotMessages: [],

    addYourMsg: (msg) =>
        set((state) => ({
            allChatbotMessages: [...state.allChatbotMessages, { you: msg, bot: "" }],
        })),

    addBotMsg: (msg) =>
        set((state) => {
            const updatedMessages = [...state.allChatbotMessages];
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

            return { allChatbotMessages: updatedMessages };
        }),


    setAllChatbotMessages: (messages) =>
        set({ allChatbotMessages: messages }),
}));


