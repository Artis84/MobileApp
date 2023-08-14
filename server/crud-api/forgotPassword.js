import { Router } from "https://deno.land/x/oak/mod.ts";
import LoginServerSide from "../models/LoginServerSide.js";
import RefreshPassword from "../models/RefreshPassword.js";
import EmailVerification from "../models/EmailVerification.js";
import * as bcrypt from "bcrypt";

const forgotPassword = new Router();
const loginServerSide = new LoginServerSide();
const emailVerification = new EmailVerification();

forgotPassword.post("/forgotPassword", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email } = body.fields;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received identifier:", { email });

        const checkEmailRecord = await loginServerSide.checkEmailRecord(email);
        if (!checkEmailRecord) {
            ctx.response.status = 400;
            ctx.response.body = { unknowEmail: `Unknow email` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            const verificationCode = Math.floor(10000 + Math.random() * 90000);
            await emailVerification.sendVerificationEmail(email, verificationCode);
            await emailVerification.refreshVerificationCode(email, verificationCode);
            ctx.response.status = 200;
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

forgotPassword.post("/refreshPassword", async (ctx) => {
    const refreshPassword = new RefreshPassword();
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email, password } = body.fields;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received email and password:", { email, password });
        const isPasswordExist = await refreshPassword.checkPasswordUniqueness(email, password);

        if (!isPasswordExist) {
            ctx.response.status = 400;
            ctx.response.body = { passwordExist: `Password already exist` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            const saltRounds = await bcrypt.genSalt(); // Number of salt rounds for bcrypt, this number determine the level of strongness encryption
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await refreshPassword.persistUserData(email, hashedPassword);
            ctx.response.status = 200;
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default forgotPassword;
