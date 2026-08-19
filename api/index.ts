// Vercel executes this function after the project build. The build bundles
// server.ts into dist/server.cjs, so the function must import the generated
// runtime artifact rather than the TypeScript source file (which is not part
// of the deployed function filesystem).
import app from "../dist/server.cjs";

export default app;
