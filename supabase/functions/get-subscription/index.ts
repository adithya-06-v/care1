import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

serve(async () => {
  console.log("🔥 FINAL VERSION RUNNING");

  return new Response(
    JSON.stringify({
      plan: "starter",
      status: "active",
    }),
    {
      headers: { "Content-Type": "application/json" },
      status: 200,
    }
  );
});