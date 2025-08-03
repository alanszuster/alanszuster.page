"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after 3 seconds
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "100px",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "3rem", color: "#333" }}>404</h1>
      <h2 style={{ fontSize: "1.5rem", color: "#666", marginBottom: "20px" }}>
        Page Not Found
      </h2>
      <p style={{ fontSize: "1rem", color: "#888", marginBottom: "30px" }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <p style={{ fontSize: "0.9rem", color: "#999" }}>
        Redirecting to home page in 3 seconds...
      </p>
      <button
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
        }}
        onClick={() => router.push("/")}
      >
        Go Home Now
      </button>
    </div>
  );
}
