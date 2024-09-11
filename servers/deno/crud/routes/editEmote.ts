import { Router } from "oak";
import EditEmoteModel from "../models/EditEmoteModel.ts";

const editEmoteRouter = new Router();

const editEmote = new EditEmoteModel();

editEmoteRouter.post("/checkEditEmoteName", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { editedName } = body;

        console.log("\x1b[31m" + "[UPDATE]" + "\x1b[0m" + " Received update emote name:", { editedName });
        const usernameUniqueness = await editEmote.checkEmoteNameUniqueness(editedName);
        if (usernameUniqueness) ctx.response.status = 200;
        else ctx.response.status = 400;
    } catch (error) {
        console.error("\x1b[31m" + "[UPDATE]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default editEmoteRouter;
