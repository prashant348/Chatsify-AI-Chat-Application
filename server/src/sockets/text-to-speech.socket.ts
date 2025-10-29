import { Server as ioServer } from "socket.io"
import { Socket } from "socket.io"
import { generateAudio } from "../utils/generateAudio"
import { User } from "../models/User/User.model"
import fs from "fs/promises"
import path from "path"


const folderCleanUp = async (): Promise<"Success" | "Error" | undefined> => {

    try {
        const __dirname = process.cwd()
        
        const dirPath = path.join(__dirname, "src", "temp", "audios")
        
        const files = await fs.readdir(dirPath)

        if (!files || files.length === 0) return
        
        for (const file of files) {
            await fs.unlink(path.join(dirPath, file))
        }
        
        console.log("folder cleaned up!")
        return "Success";
    } catch (err) {
        console.error("error from folderCleanUp func: ", err)
        return "Error";
    }
}


export const registerTextToSpeechHandlers = async (
    io: ioServer,
    socket: Socket,
    userId: string
) => {
    try {
        socket.on("send-text", async (text: string) => {
            console.log("from client: ", text)
            const audioUrl = await generateAudio(text, userId)
            console.log("audioUrl: ", audioUrl)
            if (audioUrl === "Error") return

            io.to(userId).emit("receive-audio", audioUrl)

            const user = await User.findOne({ clerkUserId: userId })

            // if user (you) not found!
            if (!user) {
                console.log("user not found!")
                return
            }

            // if user (you) found!
            user.textToSpeechAIChats.push({
                you: text,
                bot: audioUrl
            })

            // save changes!
            await user.save()
            console.log("you and bot msg saved in db")

            const result = await folderCleanUp()
            if (result) {
                if (result === "Success") console.log("folder cleaned up!")
                else console.log("Error occured: folder not cleaned up!")
            } else {
                console.log("folder already empty!")
            }
        })
    } catch (err) {
        console.error("error from text-to-speech handlers: ", err)
    }
}