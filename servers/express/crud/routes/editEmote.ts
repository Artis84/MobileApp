import express from "express";
import multer, { memoryStorage } from "multer";
import EditEmoteModel from "../models/EditEmoteModel";

const editEmoteRouter = express();

editEmoteRouter.use(express.json());

const storage = memoryStorage();
const upload = multer({ storage: storage });

const editEmote = new EditEmoteModel();

editEmoteRouter.post("/checkValidOwner", async (req, res) => {
    const { sessionId, emoteId } = req.body;

    console.log("\x1b[33m" + "[CRUD]" + "\x1b[31m" + "[checkValidOwner]" + "\x1b[0m" + "Received sessionId and emoteId:", { sessionId, emoteId });

    try {
        const isValidOwner = await editEmote.checkValidOwner(sessionId, emoteId);
        if (!isValidOwner) res.status(400).send();
        res.status(200).send();
    } catch (error) {
        console.error("\x1b[33m" + "[CRUD]" + "\x1b[31m" + "[checkValidOwner]" + "\x1b[0m" + " " + error);
        res.status(500).send();
    }
});

editEmoteRouter.post("/editFullEmote", upload.single("updatedEmote"), async (req, res) => {
    const { editedName, emoteId } = req.body;
    const { buffer, mimetype }: Express.Multer.File = req.file!;

    console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + "Received Updated emote name and emote id:", { editedName, emoteId });
    console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + "Received Updated emote MIME and binnaries:", { mimetype, buffer });

    try {
        await editEmote.persistUpdatedEmote(emoteId, editedName, buffer, mimetype);
        res.status(200).send();
    } catch (error) {
        console.error("\x1b[33m" + "[CRUD]" + "\x1b[0m" + " " + error);
        res.status(500).send();
    }
});

editEmoteRouter.post("/editEmoteName", async (req, res) => {
    const { editedName, emoteId } = req.body;

    console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + "Received Updated emote name and emote id:", { editedName, emoteId });

    try {
        await editEmote.persistUpdatedEmoteName(emoteId, editedName);
        res.status(200).send();
    } catch (error) {
        console.error("\x1b[33m" + "[CRUD]" + "\x1b[0m" + " " + error);
        res.status(500).send();
    }
});

editEmoteRouter.post("/editEmoteBinaries", upload.single("updatedEmote"), async (req, res) => {
    const { emoteId } = req.body;
    const { buffer, mimetype }: Express.Multer.File = req.file!;

    console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + "Received emote id:", { emoteId });
    console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + "Received Updated emote MIME and binnaries:", { mimetype, buffer });

    try {
        await editEmote.persistUpdatedEmoteBinaries(emoteId, buffer, mimetype);
        res.status(200).send();
    } catch (error) {
        console.error("\x1b[33m" + "[CRUD]" + "\x1b[0m" + " " + error);
        res.status(500).send();
    }
});

export default editEmoteRouter;
