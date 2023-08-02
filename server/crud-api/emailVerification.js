import { Router } from "https://deno.land/x/oak/mod.ts";
import EmailVerification from "../models/EmailVerification.js";

const emailVerificationRouter = new Router();

const emailVerification = new EmailVerification();

emailVerificationRouter.post("/resendcode", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email, verificationCode } = body.fields;
        const verificationCodeInt = parseInt(verificationCode);

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received identifier and verification code:", { email, verificationCodeInt });

        await emailVerification.sendVerificationEmail(email, verificationCodeInt);
        await emailVerification.persistVerificationCode(email, verificationCodeInt);

        ctx.response.status = 200;
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

emailVerificationRouter.post("/emailVerification", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email, verificationCode } = body.fields;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received identifier and verification code:", { email, verificationCode });

        const IsemailVerified = await emailVerification.emailVerification(email, verificationCode);
        if (IsemailVerified) {
            await emailVerification.deleteVerificationCode(email);
            ctx.response.status = 200;
        } else {
            ctx.response.status = 400;
            ctx.response.body = { failed: `Verification failed\nEmail:${email}` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default emailVerificationRouter;
