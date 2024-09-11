import { Router } from "oak";
import SignUpModel from "../models/SignUpModel.ts";
import EmailVerificationModel from "../models/EmailVerificationModel.ts";
import { genSalt, hash } from "bcrypt";

const signupRouter = new Router();

const emailVerification = new EmailVerificationModel();
const signUp = new SignUpModel();

signupRouter.post("/signup", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { username, email, password } = body;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received signup data:", { username, email, password });

        const emailUniqueness = await signUp.checkEmailUniqueness(email);
        const usernameUniqueness = await signUp.checkUsernameUniqueness(username);

        if (signUp.validateUsername(username) && signUp.validateEmail(email) && signUp.validatePassword(password) && emailUniqueness && usernameUniqueness) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const saltRounds = await genSalt();
            const hashedPassword = await hash(password, saltRounds);
            await emailVerification.sendVerificationEmail(email, verificationCode);
            await signUp.persistUserData(email, hashedPassword, username);
            await emailVerification.persistVerificationDoc(email, verificationCode);

            ctx.response.status = 200;
        } else {
            ctx.response.status = 400;
            ctx.response.body = { failed: `Signup failed\nEmail:${email}` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});
signupRouter.post("/signupDataUniqueness", async (ctx) => {
    try {
        const body = await ctx.request.body({ type: "json" }).value;
        const { username, email } = body;

        if (username) {
            console.log("\x1b[31m" + "[AUTH]" + "\x1b[0m" + " Received username:", { username });
            const usernameUniqueness = await signUp.checkUsernameUniqueness(username);
            if (usernameUniqueness) ctx.response.status = 200;
            else ctx.response.status = 400;
        } else {
            console.log("\x1b[31m" + "[AUTH]" + "\x1b[0m" + " Received email:", { email });
            const emailUniqueness = await signUp.checkEmailUniqueness(email);
            if (emailUniqueness) ctx.response.status = 200;
            else ctx.response.status = 400;
        }
    } catch (error) {
        console.error("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " " + error);
        ctx.response.status = 500;
    }
});

export default signupRouter;
