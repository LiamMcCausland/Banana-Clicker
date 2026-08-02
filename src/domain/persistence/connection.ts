import { PGlite } from "@electric-sql/pglite";
import ddl from '../../../create-tables.sql?raw';

let src = import.meta.env.VITE_DATABASE_URL;


const pgliteDb = await PGlite.create(src);

// in the test environment we need to populate the tables
// in our databse:
if(src == 'memory://'){
    db().exec(ddl);
}

export default function db(){
    return pgliteDb;
}
