import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(5000),
});

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return Response.json({ error: "Invalid request" }, { status: 400 });
        }

        const parsed = ContactSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: "Invalid form input" }, { status: 400 });
        }

        const serviceId = process.env.EMAILJS_SERVICE_ID;
        const templateId = process.env.EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY;

        if (!serviceId || !templateId || !publicKey) {
          console.error("EmailJS credentials are not configured");
          return Response.json(
            { error: "Email service is not configured" },
            { status: 503 },
          );
        }

        const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            ...(privateKey ? { accessToken: privateKey } : {}),
            template_params: parsed.data,
          }),
        });

        if (!res.ok) {
          console.error(`EmailJS send failed [${res.status}]: ${await res.text()}`);
          return Response.json({ error: "Failed to send message" }, { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});