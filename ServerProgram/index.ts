import { default as express } from "express";
import { 
  _throw, 
  assertNonNullable as NN,
  PORT,
  registerURLHandlers,
} from "./src";

const main = (argv: string[]) => {
  const app = express();
  registerURLHandlers(app);
  const server = app.listen(PORT, () => {
    server || _throw(TypeError("Error: Server is null"));
    const address = NN(server.address());
    if (typeof address == "string") { console.log(`Server listening at address ${address}`); return; }
    const port = address.port;
    console.log(`Server listening at ${address.address}:${port}`);
  });
};
main(process.argv);
