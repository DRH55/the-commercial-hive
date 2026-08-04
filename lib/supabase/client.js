"use client";
import { createClient } from "@supabase/supabase-js";

// A single shared Supabase client for use in Client Components.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
