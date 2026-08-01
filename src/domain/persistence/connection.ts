import { PGlite } from "@electric-sql/pglite"

// Create a PGlite database instance
const pgliteDb = await PGlite.create('idb://2452-clicker');

// Export a function that returns the PGlite database instance
export default function db(){
    return pgliteDb;
}

