import { createFileRoute } from "@tanstack/react-router";

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

function Index() {
  return (
    <iframe
      src="/portfolio.html"
      title="Karan Parmar Portfolio"
      style={{
        border: 0,
        width: "100vw",
        height: "100vh",
        display: "block",
      }}
    />
  );
}
