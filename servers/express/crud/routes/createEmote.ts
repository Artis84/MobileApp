import express from "express";
import multer, { memoryStorage } from "multer";
import Miscellaneous from "../../Miscellaneous";
import CreateEmoteModel from "../models/CreateEmoteModel";

const createEmoteRouter = express();

const storage = memoryStorage();
const upload = multer({ storage: storage });

const miscellaneous = new Miscellaneous();
const createEmote = new CreateEmoteModel();

createEmoteRouter.post("/create", upload.single("emote"), async (req, res) => {
    try {
        const { sessionId, name, tags } = req.body;
        const { buffer, mimetype }: Express.Multer.File = req.file!;

        const tagsArray = tags.split(",");

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received emote metadata and session id:", { sessionId, name, tagsArray });
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received emote file:", { mimetype, buffer });

        const emoteId = miscellaneous.generateEmoteId();

        const userDoc = await miscellaneous.getUserDoc(sessionId);
        const userData = userDoc.data();

        const emoteSrc = await createEmote.persistEmote(emoteId, buffer, mimetype);
        await createEmote.persistEmoteMetadata(userData, emoteId, emoteSrc, name, tagsArray);
        res.status(200).send();
    } catch (error) {
        console.error("\x1b[33m" + "[UPLOAD]" + "\x1b[0m" + " " + error);
        res.status(500).send();
    }
});

export default createEmoteRouter;
