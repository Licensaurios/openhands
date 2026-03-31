// app/layout.jsx
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
export default function RootLayout({ children }) {
  //no usado mientras(no valo mdre para los disseños)
  const clerkAparrence = {
    variables: {
      colorPrimary: "#0F1A2E",
      colorBackground: "#ffffff",
      colorText: "#111827",
      colorInputBackground: "#f9fafb",
      borderRadius: "6px",
      fontFamily: "DM Sans, sans-serif",
    },
    elements: {
      formButtonPrimary: {
        backgroundColor: "#0F1A2E",
        "&:hover": { backgroundColor: "#1e3a6e" },
      },
      headerTitle: {
        fontFamily: "DM Serif Display, serif",
        fontWeight: "400",
      },
      card: {
        boxShadow: "none",
        border: "0.5px solid #e5e7eb",
      },
    },
  };
  return (
    <ClerkProvider>
      <html lang="es">
        <head>
            <title>Open Hands</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />

            <meta property="og:title" content="Open Hands — Aprende y comparte conocimiento con el mundo" />

            <meta
              property="og:description"
              content="OpenHands es una plataforma colaborativa de aprendizaje y divulgación de conocimiento para todas las personas del mundo. Únete hoy."
            />

            <meta
              property="og:image"
              content="https://openhands.space/openhands_preview.png"
            />

            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="Open Hands — Plataforma colaborativa de aprendizaje" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://openhands.space" />

        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
