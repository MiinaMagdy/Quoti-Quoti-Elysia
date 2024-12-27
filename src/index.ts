import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { quote } from "./controllers";
import { connectDB } from "./database/db";

const startServer = async () => {
  try {
    await connectDB();
    const app = new Elysia().use(swagger()).use(quote).listen(3000);

    console.log(
      `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

startServer();
