// Vercel adapter for the existing Express application.
//
// The build script creates dist/server.cjs from server.ts. Importing that
// explicit .cjs artifact avoids the ESM directory collision caused by the
// repository's root server.ts file and server/ directory sharing the same
// basename.
//
// Vercel includes dist/server.cjs through vercel.json/functions.includeFiles.
const serverModule: any = await import("./dist/server.cjs");

const app = serverModule.default ?? serverModule;

export default app;
