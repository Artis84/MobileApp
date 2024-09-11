import express from "express";
import DeleteEmoteModel from "../models/DeleteEmoteModel";

const deleteEmoteRouter = express();

// Middleware to parse JSON payloads
deleteEmoteRouter.use(express.json());

const deleteEmote = new DeleteEmoteModel();

deleteEmoteRouter.post("/deleteEmote", async (req, res) => {
    const { sessionId, emoteId } = req.body;

    console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received emoteId and sessionId:", { sessionId, emoteId });

    try {
        const isValidOwner = await deleteEmote.checkValidOwner(sessionId, emoteId);
        if (!isValidOwner) res.status(400).send();

        await deleteEmote.deletingEmoteMetadata(emoteId);
        await deleteEmote.deletingEmoteBinaries(emoteId);
        res.status(200).send();
    } catch (error) {
        console.error("\x1b[33m" + "[CRUD]" + "\x1b[0m" + " " + error);
        res.status(500).send();
    }
});

export default deleteEmoteRouter;
