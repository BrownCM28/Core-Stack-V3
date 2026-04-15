import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "403 Forbidden | CoreStack",
  description: "You don't have permission to access this page.",
};

export default function UnauthorizedPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#F5F2EE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        fontFamily: "var(--font-geist-sans, system-ui, sans-serif)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "420px" }}>

        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            backgroundColor: "#fff",
            border: "1px solid #e5e1dc",
            borderRadius: "9999px",
            padding: "0.25rem 0.875rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#6B6560",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              display: "inline-block",
            }}
          />
          403 Forbidden
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "#0D0F12",
            margin: "0 0 0.75rem",
            lineHeight: 1.2,
          }}
        >
          Access Restricted
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "0.9375rem",
            color: "#6B6560",
            lineHeight: 1.6,
            margin: "0 0 2rem",
          }}
        >
          You don&apos;t have the required permissions to view this page.
          If you think this is a mistake, contact your administrator.
        </p>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "#e5e1dc",
            margin: "0 0 2rem",
          }}
        />

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.375rem",
              backgroundColor: "#0D0F12",
              color: "#fff",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← Back to home
          </Link>

          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#fff",
              border: "1px solid #e5e1dc",
              color: "#0D0F12",
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Go to dashboard
          </Link>
        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.8125rem",
            color: "#6B6560",
          }}
        >
          Need access?{" "}
          <a
            href="mailto:support@corestack.io"
            style={{ color: "#3ECF8E", fontWeight: 600, textDecoration: "none" }}
          >
            Contact support
          </a>
        </p>

      </div>
    </main>
  );
}
