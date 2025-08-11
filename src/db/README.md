# Supabase Mini SDK (Generated)

- One file per table with Types, Zod schemas, and CRUD helpers
- View reader for `prompts_public`
- RPC wrappers for `create_prompt_admin`, `is_admin`, and `publish_prompt`

## Install peer deps
```
npm i zod @supabase/supabase-js
```

## Usage
```ts
import {{ createClient }} from "@supabase/supabase-js";
import type {{ Database }} from "../db.types";
import {{ categoriesRepo, promptsRepo, prompts_publicRepo }} from "./supabase-sdk";

const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Tables
const categories = categoriesRepo(supabase);
const all = await categories.list();

// Views
const pub = prompts_publicRepo(supabase);
const visible = await pub.list();
```

> Zod schemas are permissive (`.partial()`) for create/update, adjust as needed.
