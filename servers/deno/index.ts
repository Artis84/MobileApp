import { Application } from "oak";
import loginRouter from "./auth/routes/login.ts";
import signupRouter from "./auth/routes/signup.ts";
import emailVerificationRouter from "./auth/routes/emailVerification.ts";
import forgotPassword from "./auth/routes/forgotPassword.ts";
import create from "./crud/routes/create.ts";
import logout from "./auth/routes/logout.ts";
import emoteDetail from "./crud/routes/emoteDetail.ts";
import editEmote from "./crud/routes/editEmote.ts";

const crud = new Application();

crud.use(loginRouter.routes());
crud.use(loginRouter.allowedMethods());
crud.use(signupRouter.routes());
crud.use(signupRouter.allowedMethods());
crud.use(emailVerificationRouter.routes());
crud.use(emailVerificationRouter.allowedMethods());
crud.use(forgotPassword.routes());
crud.use(forgotPassword.allowedMethods());
crud.use(create.routes());
crud.use(create.allowedMethods());
crud.use(logout.routes());
crud.use(logout.allowedMethods());
crud.use(emoteDetail.routes());
crud.use(emoteDetail.allowedMethods());
crud.use(editEmote.routes());
crud.use(editEmote.allowedMethods());

console.log("\x1b[90m" + "[SERVER]" + "\x1b[0m" + "Environement: " + Deno.env.get("DENO_ENV"));
console.log("\x1b[90m" + "[SERVER]" + "\x1b[0m" + "Server is running on http://localhost:8000");
await crud.listen({ port: 8000 });
