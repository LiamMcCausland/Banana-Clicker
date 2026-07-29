# TODO

## Jul 28 Lecture changes

----

**Environment Variables**:

* create a source `let src = import.meta.env.VITE_DATABASE_URL` (used DATABASE_URL).
* change idb statement to src, `PGlite.create(src)`.
* Create new file `.env`, name required:

```.env
VITE_DATABASE_URL=idb://2452-clicker
```

---

**Test Environment**:

* this will override the .env file if it has the same name
* change vitest.config.ts:
  * Add inside the test bracket after coverage:
  * `env: {VITE_DATABASE_URL: 'memory://'}`
  
---

**Connection.ts**

```typescript
if (src == 'memory://') {
    db.exec(ddl);
}
```

* This is for creating the tables if a test is run since `main.ts` wont be run.

---
