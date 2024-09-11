import { Router } from "oak";
import LogoutModel from "../models/LogoutModel.ts";

const logoutRouter = new Router();

const logout = new LogoutModel();

logoutRouter.post("/logout", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { sessionId } = body;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received logout data :", { sessionId });

        await logout.removeSessionId(sessionId);
        ctx.response.status = 200;
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default logoutRouter;
