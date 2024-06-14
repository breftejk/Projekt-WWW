import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import FastifyCaching from "@fastify/caching";

import path from "node:path";

const server = Fastify();

server.register(FastifyStatic, {
    root: path.resolve(__dirname, "../public"),
});

/*server.register(FastifyCaching, {
    privacy: FastifyCaching.privacy.PUBLIC,
    expiresIn: 3600
});*/

server.listen({
    port: 3000,
}).then(() => {
    console.log("http://localhost:3000/");
});