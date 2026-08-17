// Vercel Node Function entrypoint.
// Keep the import target explicit so Node never resolves the repository's
// `server/` directory when the function is bundled as api/index.js.
import app from "../dist/server.cjs";

export default app;
