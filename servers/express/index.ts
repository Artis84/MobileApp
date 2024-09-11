import express from "express";
import createEmoteRouter from "./crud/routes/createEmote";
import editEmoteRouter from "./crud/routes/editEmote";
import deleteEmote from "./crud/routes/deleteEmote";
import startApolloServer from "./gql/server";

const app = express();
app.use(createEmoteRouter);
app.use(editEmoteRouter);
app.use(deleteEmote);

startApolloServer().catch((err: any) => {
    console.error("Error starting Apollo Server:", err);
});

const port = 3000;
app.listen(port, () => {
    console.log("\x1b[33m" + "[EXPRESS]" + "\x1b[0m" + `EnvironemenT: ${process.env.NODE_ENV}`);
    console.log("\x1b[33m" + "[EXPRESS]" + "\x1b[0m" + `Server is running on http://localhost:${port}`);
});
