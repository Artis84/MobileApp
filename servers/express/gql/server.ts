// npm install @apollo/server express graphql cors body-parser
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { resolvers } from "./resolvers";
import { schema } from "./schema";
import { Timestamp } from "./scalars";

import pkg from "body-parser";
const { json } = pkg;

const app = express();
const httpServer = createServer(app);

const loggingMiddleware = (req: Request, _: Response, next: NextFunction) => {
    console.log("Received GraphQL request:");
    console.log(req.body);
    next();
};

export default async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs: schema,
        resolvers: { Timestamp: Timestamp, ...resolvers },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        "/graphql",
        cors(),
        json(),
        // loggingMiddleware,
        expressMiddleware(server, {
            context: async ({ req }) => ({ token: req.headers.token }),
        })
    );

    await new Promise((resolve) =>
        httpServer.listen({ port: 4001 }, () => {
            resolve;
            console.log("\x1b[33m" + "[EXPRESS]" + "\x1b[0m" + "GQL interface running at http://localhost:4001/graphql");
        })
    );
}
