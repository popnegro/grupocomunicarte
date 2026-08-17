// Vercel Node Function entrypoint.
// Load the explicitly bundled CommonJS server without allowing Node to
// resolve the repository's `server/` directory as an ESM import.
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const appModule = require('../dist/server.cjs');
const app = appModule?.default ?? appModule;

export default app;
