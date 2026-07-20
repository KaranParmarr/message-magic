import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { portfolioHtml } from "./-portfolio-html";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karan Parmar — Software Engineer & Data Analyst" },
      {
        name: "description",
        content:
          "Portfolio of Karan Parmar — Software Engineer & Data Analyst building REST APIs, full-stack web apps, and data analytics tools.",
      },
      { property: "og:title", content: "Karan Parmar — Software Engineer & Data Analyst" },
      {
        property: "og:description",
        content:
          "Building backend systems, REST APIs, and data-driven tools. Turning raw data and rough ideas into working software.",
      },
    ],
  }),
  component: Index,
});

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.id = id;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

function Index() {
  useEffect(() => {
    let cancelled = false;

    // Inject Inter font
    if (!document.getElementById("inter-font")) {
      const link = document.createElement("link");
      link.id = "inter-font";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
      document.head.appendChild(link);
    }

    (async () => {
      try {
        await loadScript("https://cdn.tailwindcss.com", "tailwind-cdn");
        await loadScript("https://unpkg.com/lucide@latest", "lucide-cdn");
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js",
          "emailjs-cdn",
        );
        if (cancelled) return;

        // Lucide icons
        const lucide = (window as unknown as { lucide?: { createIcons: () => void } }).lucide;
        lucide?.createIcons();

        // EmailJS
        const emailjs = (
          window as unknown as {
            emailjs?: {
              init: (k: string) => void;
              send: (s: string, t: string, p: Record<string, string>) => Promise<unknown>;
            };
          }
        ).emailjs;
        emailjs?.init("b9INusQn0Vy3YeXGg");

        const contactForm = document.getElementById("contact-form") as HTMLFormElement | null;
        const sendBtn = document.getElementById("send-btn") as HTMLButtonElement | null;
        const successCard = document.getElementById("success-card");
        const successText = document.getElementById("success-text");

        const sendBtnDefault = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m21.854 2.147-10.94 10.939"/>
            </svg>
            Send Message
        `;

        const onSubmit = (e: Event) => {
          e.preventDefault();
          if (!sendBtn) return;
          sendBtn.disabled = true;
          sendBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4"></path>
            </svg>
            Sending...
          `;

          const params = {
            name: (document.getElementById("name") as HTMLInputElement)?.value ?? "",
            email: (document.getElementById("email") as HTMLInputElement)?.value ?? "",
            subject: (document.getElementById("subject") as HTMLInputElement)?.value ?? "",
            message: (document.getElementById("message") as HTMLTextAreaElement)?.value ?? "",
          };

          emailjs
            ?.send("service_g38h8a9", "template_f2kfds8", params)
            .then(() => {
              if (successText)
                successText.innerHTML = `<strong>${params.name}</strong>, your message has been sent successfully! 🎉`;
              successCard?.classList.remove("hidden");
              contactForm?.reset();
              sendBtn.disabled = false;
              sendBtn.innerHTML = sendBtnDefault;
              setTimeout(() => successCard?.classList.add("hidden"), 4000);
            })
            .catch((error: { text?: string }) => {
              alert("Failed to send message.\n\n" + (error?.text ?? ""));
              sendBtn.disabled = false;
              sendBtn.innerHTML = sendBtnDefault;
            });
        };

        contactForm?.addEventListener("submit", onSubmit);

        // Nav interactions
        const menuToggle = document.getElementById("menu-toggle");
        const mobileMenu = document.getElementById("mobile-menu");
        menuToggle?.addEventListener("click", () => mobileMenu?.classList.toggle("hidden"));

        document.getElementById("workBtn")?.addEventListener("click", () => {
          document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        });
        document.getElementById("contactBtn")?.addEventListener("click", () => {
          document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
        });
        document.getElementById("scroll-about")?.addEventListener("click", () => {
          document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
        });
        document.querySelectorAll<HTMLButtonElement>(".github-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const url = btn.getAttribute("data-url");
            if (url) window.open(url, "_blank", "noopener,noreferrer");
          });
        });
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="relative min-h-screen text-slate-900 overflow-x-hidden"
      style={{ backgroundColor: "#f4f7fb" }}
      dangerouslySetInnerHTML={{ __html: portfolioHtml }}
    />
  );
}
