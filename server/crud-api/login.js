import { Router } from "https://deno.land/x/oak/mod.ts";
import LoginServerSide from "../models/LoginServerSide.js";
import EmailVerification from "../models/EmailVerification.js";

const loginRouter = new Router();

loginRouter.post("/login", async (ctx) => {
    const loginServerSide = new LoginServerSide();
    const emailVerification = new EmailVerification();

    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email, password } = body.fields;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received login data :", { email, password });

        const checkEmailRecord = await loginServerSide.checkEmailRecord(email);
        if (!checkEmailRecord) {
            ctx.response.status = 400;
            ctx.response.body = { unknowEmail: `Unknow email` };
            ctx.response.headers.set("Content-Type", "application/json");
            return;
        }

        const checkAccountVerification = await loginServerSide.checkAccountVerification(email);
        if (!checkAccountVerification) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            await emailVerification.sendVerificationEmail(email, verificationCode);
            await emailVerification.persistVerificationCode(email, verificationCode);

            ctx.response.status = 400;
            ctx.response.body = { VerifiedError: `Account not verified` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            ctx.response.status = 200;
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default loginRouter;
