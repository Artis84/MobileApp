import { Router } from "oak";
import EmailVerificationModel from "../models/EmailVerificationModel.ts";

const emailVerificationRouter = new Router();

const emailVerification = new EmailVerificationModel();

emailVerificationRouter.post("/resendCode", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { email, verificationCode } = body;
        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received identifier and verification code:", { email, verificationCode });

        await emailVerification.sendVerificationEmail(email, verificationCode);
        await emailVerification.refreshVerificationCode(email, verificationCode);

        ctx.response.status = 200;
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

emailVerificationRouter.post("/emailVerification", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;

        const { email, verificationCode } = body;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received identifier and verification code:", { email, verificationCode });

        const isMaxAttemptsReach = await emailVerification.checkMaxAttemptsReach(email);
        if (isMaxAttemptsReach) {
            ctx.response.status = 400;
            ctx.response.body = { attempts: "Max attemps reach" };
            ctx.response.headers.set("Content-Type", "application/json");
            return;
        }
        const isVerificationCodeGood = await emailVerification.checkVerificationCode(email, verificationCode);

        if (isVerificationCodeGood) {
            await emailVerification.resetVerificationDoc(email);
            ctx.response.status = 200;
        } else {
            const updatedAttempts = await emailVerification.getUpdatedAttemptsCount(email);
            await emailVerification.updateAttemptsCount(email, updatedAttempts);
            ctx.response.status = 400;
            ctx.response.body = { failed: "Verification failed" };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default emailVerificationRouter;
