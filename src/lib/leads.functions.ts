import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().trim().max(120).optional().nullable(),
  email: z.string().trim().email().max(320),
  website: z.string().trim().max(500).optional().nullable(),
  company: z.string().trim().max(200).optional().nullable(),
  service: z.string().trim().max(80).optional().nullable(),
  message: z.string().trim().max(4000).optional().nullable(),
  source: z.string().trim().max(60).default("website"),
});

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
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
