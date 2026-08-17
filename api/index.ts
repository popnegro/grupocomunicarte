// Vercel Node Function entrypoint.
// Use a uniquely named root module because the repository also contains a
// `server/` directory. Vercel transpiles this function to `api/index.js` and
// extensionless ESM resolution otherwise collides with that directory.
import app from "../vercel-server.ts";

export default app;
