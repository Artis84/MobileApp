import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import SignUp from "../models/SignUp.js";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { addDoc, collection, getDocs, getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
// import "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const firebaseConfig = {
    apiKey: "AIzaSyCnkGY0d_UARs-6ERYn6Z8QPYvW9nYmV_A",
    authDomain: "mobileapp-64e2b.firebaseapp.com",
    projectId: "mobileapp-64e2b",
    storageBucket: "mobileapp-64e2b.appspot.com",
    messagingSenderId: "1053782804433",
    appId: "1:1053782804433:web:7674e274d390f36fca02f0",
    // measurementId: Deno.env.get("G-E7K12Z4SVF"),
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = new Application();
const router = new Router();

router.post("/signup", async (ctx) => {
    try {
        // Get the request body data
        const body = await ctx.request.body().value.read();
        const { username, email, password } = body.fields;
        const signUp = new SignUp();

        console.log("Received signup data:", { username, email, password });

        if (signUp.handleUsernameChange(username) && signUp.handleEmailChange(email) && signUp.handlePasswordChange(password)) {
            const saltRounds = await bcrypt.genSalt(8); // Number of salt rounds for bcrypt, this number determine the level of strongness encryption
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            await addDoc(collection(db, "users"), {
                username: username,
                email: email,
                password: hashedPassword,
            });
            // Show the new document in the users collection
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                const { username, email, password } = doc.data();
                console.log(doc.id, "=>", { username, email, password });
            });

            ctx.response.body = { message: `Signup successful\nUsername:${username}\nEmail:${email}\nPassword:${password}\n` };
            ctx.response.headers.set("Content-Type", "application/json");
        } else {
            ctx.response.status = 400;
            ctx.response.body = { error: `Signup failed\nUsername:${username}\nEmail:${email}\nPassword:${password}\n` };
            ctx.response.headers.set("Content-Type", "application/json");
        }
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { error: `Server: ${error}` };
        ctx.response.headers.set("Content-Type", "application/json");
    }
});

// Use the router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start the server
console.log("Server is running on http://localhost:8000");
await app.listen({ port: 8000 });
