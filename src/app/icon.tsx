import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#EFEAE0",
          border: "3px solid #1B2430",
        }}
      >
        <span
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#1B2430",
            letterSpacing: "-2px",
          }}
        >
          S<span style={{ color: "#B23A11" }}>O</span>
        </span>
      </div>
    ),
    { ...size }
  );
}
