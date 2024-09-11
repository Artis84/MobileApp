import { Router } from "oak";
import Miscellaneous from "../../Miscellaneous.ts";
import LoginModel from "../models/LoginModel.ts";
import EmailVerificationModel from "../models/EmailVerificationModel.ts";

const loginRouter = new Router();

const miscellaneous = new Miscellaneous();
const login = new LoginModel();
const email = new EmailVerificationModel();

loginRouter.post("/login", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { email, password } = body;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received login data :", { email, password });

        const checkEmailRecord = await login.checkEmailRecord(email);
        if (!checkEmailRecord) {
            ctx.response.status = 400;
            ctx.response.body = { unknowEmail: `Unknow email` };
            ctx.response.headers.set("Content-Type", "application/json");
            return;
        }

        const isAccountVerified = await login.checkAccountVerification(email);
        if (!isAccountVerified) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            await email.sendVerificationEmail(email, verificationCode);
            await email.refreshVerificationCode(email, verificationCode);

            ctx.response.status = 400;
            ctx.response.body = { VerifiedError: `Account not verified` };
            ctx.response.headers.set("Content-Type", "application/json");
            return;
        }
        const checkPasswordRecord = await login.checkPasswordRecord(email, password);
        if (!checkPasswordRecord) {
            ctx.response.status = 400;
            ctx.response.body = { unknowPassword: `Unknow password` };
            ctx.response.headers.set("Content-Type", "application/json");
            return;
        }

        const lastLoginAt = new Date();
        const emailUsername = email.split("@");
        const sessionId = miscellaneous.generateSessionId(emailUsername[0].substring(0, 5));

        await login.persistAuthenticationData(email, sessionId, lastLoginAt);

        ctx.response.status = 200;
        ctx.response.body = { sessionId: sessionId };
        ctx.response.headers.set("Content-Type", "application/json");
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default loginRouter;
