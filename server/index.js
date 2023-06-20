import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import SignUpClientSide from "../models/SignUpClientSide.js";
import SignUpServerSide from "./models/SignUpServerSide.js";
import * as bcrypt from "bcrypt";

const router = new Router();

const signUpServerSide = new SignUpServerSide();

router.post("/signup", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { username, email, password } = body.fields;

        console.log("Received signup data:", { username, email, password });

        const signUpClientSide = new SignUpClientSide();
        const emailUniqueness = await signUpClientSide.checkEmailUniqueness(email);
        const usernameUniqueness = await signUpClientSide.checkUsernameUniqueness(username);

        if (signUpClientSide.validateUsername(username) && signUpClientSide.validateEmail(email) && signUpClientSide.validatePassword(password) && emailUniqueness && usernameUniqueness) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            signUpServerSide.sendVerificationEmail(email, verificationCode);
            signUpServerSide.persistUserData(email, verificationCode);
            ctx.response.body = { message: `Signup successful\nEmail:${email}` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            ctx.response.status = 400;
            ctx.response.body = { error: `Signup failed\nEmail:${email}` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = { error: `Server: ${error}` };
        ctx.response.headers.set("Content-Type", "application/json");
    }
});

router.post("/emailVerification", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { username, email, password, verificationCode } = body.fields;

        console.log("Received signup data and verification code:", { username, email, password, verificationCode });

        const emailVerification = await signUpServerSide.emailVerification(email, verificationCode);
        if (emailVerification) {
            const saltRounds = await bcrypt.genSalt(); // Number of salt rounds for bcrypt, this number determine the level of strongness encryption
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await signUpServerSide.persistUserData(email, undefined, hashedPassword, username);
            ctx.response.body = { message: `Verification successful\nUsername:${username}\nEmail:${email}\nPassword:${password}` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            ctx.response.status = 400;
            ctx.response.body = { error: `Verification failed\nUsername:${username}\nEmail:${email}\nPassword:${password}` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = { error: `Server: ${error}` };
        ctx.response.headers.set("Content-Type", "application/json");
    }
});

const app = new Application();
// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
console.log("Server is running on http://localhost:8000");
await app.listen({ port: 8000 });
