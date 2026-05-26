#!/usr/bin/env node

import { readFile } from "node:fs/promises";

import dotenv from "dotenv";
import pg from "pg";

dotenv.config({ quiet: true });

const databaseUrl = process.env.DATABASE_URL?.trim();

if (!databaseUrl) {
  console.error(
    "DATABASE_URL is missing. Set it in .env or export it before running npm run db:schema.",
  );
  process.exit(1);
}

const schemaPath = new URL("../db/schema.sql", import.meta.url);
const schema = await readFile(schemaPath, "utf8");
const { Client } = pg;
const client = new Client({ connectionString: databaseUrl });

try {
  await client.connect();
  await client.query(schema);
  console.log("Applied db/schema.sql.");
} catch (error) {
  console.error("\nFailed to apply db/schema.sql.");
  console.error(error instanceof Error ? error.message : error);

  process.exit(1);
} finally {
  await client.end().catch(() => {});
}
