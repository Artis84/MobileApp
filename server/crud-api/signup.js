import { Router } from "https://deno.land/x/oak/mod.ts";
import SignUpServerSide from "../models/SignUpServerSide.js";
import EmailVerification from "../models/EmailVerification.js";
import { genSalt, hash } from "bcrypt";

const signupRouter = new Router();

signupRouter.post("/signup", async (ctx) => {
    const signUpServerSide = new SignUpServerSide();
    const emailVerification = new EmailVerification();

    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { username, email, password } = body.fields;

        console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Received signup data:", { username, email, password });

        const emailUniqueness = await signUpServerSide.checkEmailUniqueness(email);
        const usernameUniqueness = await signUpServerSide.checkUsernameUniqueness(username);

        if (signUpServerSide.validateUsername(username) && signUpServerSide.validateEmail(email) && signUpServerSide.validatePassword(password) && emailUniqueness && usernameUniqueness) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            emailVerification.sendVerificationEmail(email, verificationCode);
            const saltRounds = await genSalt(); // Number of salt rounds for bcrypt, this number determine the level of strongness encryption
            const hashedPassword = await hash(password, saltRounds);
            signUpServerSide.persistUserData(email, verificationCode, hashedPassword, username);

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

export default signupRouter;
