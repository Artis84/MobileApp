import { Application } from "https://deno.land/x/oak/mod.ts";
import loginRouter from "./crud-api/login.js";
import signupRouter from "./crud-api/signup.js";
import emailVerificationRouter from "./crud-api/emailVerification.js";
import forgotPassword from "./crud-api/forgotPassword.js";

const crud = new Application();

crud.use(loginRouter.routes());
crud.use(loginRouter.allowedMethods());
crud.use(signupRouter.routes());
crud.use(signupRouter.allowedMethods());
crud.use(emailVerificationRouter.routes());
crud.use(emailVerificationRouter.allowedMethods());
crud.use(forgotPassword.routes());
crud.use(forgotPassword.allowedMethods());

// Start the server
console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Environement:", Deno.env.get("NODE_ENV"));
console.log("\x1b[31m" + "[CRUD]" + "\x1b[0m" + " Server is running on http://localhost:8000");
await crud.listen({ port: 8000 });
