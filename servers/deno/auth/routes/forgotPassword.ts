import { Router } from "oak";
import LoginModel from "../models/LoginModel.ts";
import RefreshPasswordModel from "../models/RefreshPasswordModel.ts";
import EmailVerificationModel from "../models/EmailVerificationModel.ts";
import * as bcrypt from "bcrypt";

const forgotPassword = new Router();

const login = new LoginModel();
const emailVerification = new EmailVerificationModel();
const refreshPassword = new RefreshPasswordModel();

forgotPassword.post("/forgotPassword", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { email } = body;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received identifier:", { email });

        const checkEmailRecord = await login.checkEmailRecord(email);
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
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { email, password } = body;

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
