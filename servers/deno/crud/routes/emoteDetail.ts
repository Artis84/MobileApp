import { Router } from "oak";
import EmoteDetailModel from "../models/EmoteDetailModel.ts";

const emoteDetailRouter = new Router();

emoteDetailRouter.post("/addEmoteLike", async (ctx) => {
    const emoteDetail = new EmoteDetailModel();

    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { emoteId, sessionId } = body;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received emote identifier and session identifier:", { emoteId, sessionId });
        const isEmotealreadyLiked = await emoteDetail.checkEmoteAlreadyLiked(sessionId, emoteId);
        if (!isEmotealreadyLiked) {
            await emoteDetail.removeEmoteLike(emoteId, sessionId);
            ctx.response.status = 400;
        } else {
            await emoteDetail.addEmoteLike(emoteId, sessionId);
            ctx.response.status = 200;
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default emoteDetailRouter;
