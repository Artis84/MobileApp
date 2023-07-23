import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import SignUpServerSide from "./models/SignUpServerSide.js";
import LoginServerSide from "./models/LoginServerSide.js";
import * as bcrypt from "bcrypt";
console.log("Environement: ", Deno.env.get("NODE_ENV"));

const router = new Router();

const signUpServerSide = new SignUpServerSide();

router.post("/signup", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { username, email, password } = body.fields;

        console.log("Received signup data:", { username, email, password });

        const emailUniqueness = await signUpServerSide.checkEmailUniqueness(email);
        const usernameUniqueness = await signUpServerSide.checkUsernameUniqueness(username);

        if (signUpServerSide.validateUsername(username) && signUpServerSide.validateEmail(email) && signUpServerSide.validatePassword(password) && emailUniqueness && usernameUniqueness) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            signUpServerSide.sendVerificationEmail(email, verificationCode);
            const saltRounds = await bcrypt.genSalt(); // Number of salt rounds for bcrypt, this number determine the level of strongness encryption
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            signUpServerSide.persistUserData(email, verificationCode, hashedPassword, username);

            ctx.response.body = { successful: `Signup successful\nEmail:${email}` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            ctx.response.status = 400;
            ctx.response.body = { failed: `Signup failed\nEmail:${email}` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = { error: `Server: ${error}` };
        ctx.response.headers.set("Content-Type", "application/json");
    }
});

router.post("/resendcode", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email } = body.fields;

        console.log("Received identifier:", { email });

        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        await signUpServerSide.sendVerificationEmail(email, verificationCode);
        await signUpServerSide.persistResendcode(email, verificationCode);

        ctx.response.status = 200;
    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = { error: `The email has not been sent, please try again` };
        ctx.response.headers.set("Content-Type", "application/json");
    }
});

router.post("/emailVerification", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email, password, verificationCode } = body.fields;

        console.log("Received signup data and verification code:", { email, password, verificationCode });

        const emailVerification = await signUpServerSide.emailVerification(email, verificationCode);
        if (emailVerification) {
            await signUpServerSide.persistUserData(email, undefined, undefined, undefined);
            ctx.response.body = { successful: `Verification successful\nEmail:${email}}` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            ctx.response.status = 400;
            ctx.response.body = { failed: `Verification failed\nEmail:${email}` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = { error: `Server: ${error}` };
        ctx.response.headers.set("Content-Type", "application/json");
    }
});

router.post("/login", async (ctx) => {
    const loginServerSide = new LoginServerSide();
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { email, password } = body.fields;

        console.log("Received login data :", { email, password });

        const checkEmailRecord = await loginServerSide.checkEmailRecord(email);
        // const checkPasswordRecord = await login.checkPasswordRecord(email);
        if (!checkEmailRecord) {
            ctx.response.status = 400;
            ctx.response.body = { unknowEmail: `Unknow email` };
            ctx.response.headers.set("Content-Type", "application/json");
            return;
            // } else if (!checkEmailRecord) {
            //     ctx.response.status = 400;
            //     ctx.response.body = { unknowEmail: `Unknow email` };
            //     ctx.response.headers.set("Content-Type", "application/json");
            //     return;
        }

        const checkAccountVerification = await loginServerSide.checkAccountVerification(email);
        if (!checkAccountVerification) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            await signUpServerSide.sendVerificationEmail(email, verificationCode);
            await loginServerSide.refreshVerificationCode(email, verificationCode);

            ctx.response.status = 400;
            ctx.response.body = { VerifiedError: `Account not verified` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        console.log(error);
        ctx.response.status = 500;
        ctx.response.body = { error: `${error}` };
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
