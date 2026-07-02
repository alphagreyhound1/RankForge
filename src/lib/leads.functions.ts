import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const LeadSchema = z.object({
  name: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email().max(320),
  website: z.string().trim().max(500).optional().nullable(),
  company: z.string().trim().max(200).optional().nullable(),
  service: z.string().trim().max(80).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  source: z.string().trim().max(60).default("website"),
});

/**
 * Returns a Supabase client suitable for lead inserts.
 *
 * Priority:
 *   1. Service-role key (Lovable Cloud / production) — bypasses RLS
 *   2. Publishable (anon) key — works locally; RLS allows INSERT per migration policy
 */
function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey =
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!url) throw new Error("SUPABASE_URL is not set");

  const key = serviceKey || anonKey;
  if (!key) throw new Error("No Supabase key found (SUPABASE_SERVICE_ROLE_KEY or SUPABASE_PUBLISHABLE_KEY)");

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const client = getSupabaseClient();
    const { error } = await client.from("leads").insert({
      name: data.name ?? null,
      email: data.email,
      website: data.website ?? null,
      company: data.company ?? null,
      service: data.service ?? null,
      message: data.message ?? null,
      source: data.source,
    });
    if (error) {
      console.error("Lead insert failed", error);
      throw new Error("Could not save your submission. Please try again.");
    }
    return { ok: true as const };
  });
