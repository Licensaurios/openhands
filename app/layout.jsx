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
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
            <link rel="manifest" href="/site.webmanifest"></link>
            <meta property="og:description" content="OpenHands es una plataforma colaborativa de aprendizaje diseñada para estudiantes, jóvenes y educadores que desean compartir y descubrir materiales educativos de calidad" />
            <meta
                property="og:image"
                content="https://i.postimg.cc/NfCKbTXN/openhands.png"
            />

        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
