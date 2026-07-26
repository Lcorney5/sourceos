import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 90px",
          background: "#EFEAE0",
          color: "#1B2430",
          border: "10px solid #1B2430",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#7A7364",
            marginBottom: 28,
          }}
        >
          Production &amp; Sourcing Manifest
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: "-2px",
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: 40,
          }}
        >
          Souce<span style={{ color: "#B23A11" }}>OS</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: 900,
            color: "#3A352D",
          }}
        >
          Your suppliers, samples, and POs stop living in five different apps.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#B23A11",
              border: "3px solid #B23A11",
              padding: "10px 20px",
              transform: "rotate(-2deg)",
            }}
          >
            Founding-Member Pricing
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
