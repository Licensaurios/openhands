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
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
