
import { create } from "zustand";

type Msg = {
    msg: string;
    type: "sent" | "received";
    ts?: number;
};

type MessagesMap = Record<string, Msg[]>;

interface MessageStoreType {
    messages: MessagesMap;
    addReceived: (from: string, msg: string) => void;
    addSent: (to: string, msg: string) => void;
    getMessages: (peerId: string) => Msg[];
    clearMessagesFor: (peerId: string) => void;
    setMessagesFor: (peerId: string, msgs: Msg[]) => void; // <-- added setter
}

export const useMessageStore = create<MessageStoreType>((set, get) => ({
    messages: {},
    addReceived: (from: string, msg: string) =>
        set((state) => {
            const prev = state.messages[from] ?? [];
            return { messages: { ...state.messages, [from]: [...prev, { msg, type: "received", ts: Date.now() }] } };
        }),
    addSent: (to: string, msg: string) =>
        set((state) => {
            const prev = state.messages[to] ?? [];
            return { messages: { ...state.messages, [to]: [...prev, { msg, type: "sent", ts: Date.now() }] } };
        }),
    getMessages: (peerId: string) => {
        return get().messages[peerId] ?? [];
    },
    clearMessagesFor: (peerId: string) =>
        set((state) => {
            const copy = { ...state.messages };
            delete copy[peerId];
            return { messages: copy };
        }),
    setMessagesFor: (peerId: string, msgs: Msg[]) =>
        set((state) => ({
            messages: { ...state.messages, [peerId]: msgs },
        })), // <-- implementation
}));

