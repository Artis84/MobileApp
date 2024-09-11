import { Router } from "oak";
import CreateModel from "../models/CreateModel.ts";

const createRouter = new Router();

createRouter.post("/createVerification", async (ctx) => {
    const create = new CreateModel();

    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { name, tag } = body;

        if (name) {
            console.log("\x1b[31m" + "[AUTH]" + "\x1b[0m" + " Received emote name:", { name });
            const usernameUniqueness = await create.checkNameUniqueness(name);
            if (usernameUniqueness) ctx.response.status = 200;
            else ctx.response.status = 400;
        }
        if (tag) {
            console.log("\x1b[31m" + "[AUTH]" + "\x1b[0m" + " Received tag:", { tag });
            const emailUniqueness = await create.checkTagUniqueness(tag);
            if (emailUniqueness) ctx.response.status = 200;
            else ctx.response.status = 400;
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default createRouter;
