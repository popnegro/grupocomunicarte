// Vercel Node Function entrypoint.
// Keep the explicit TypeScript extension so the Vercel bundler resolves the
// root server module instead of interpreting `../server` as the `server/`
// directory. The repository also contains a `server/` directory, so an
// extensionless ESM import is ambiguous at runtime.
import app from "../server.ts";

export default app;
