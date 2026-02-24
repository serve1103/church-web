import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "남문교회 - 이 땅을 품는 하늘 공동체";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1E3A5F 0%, #142942 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "rgba(200,169,81,0.2)",
            border: "2px solid rgba(200,169,81,0.5)",
            marginBottom: 24,
            fontSize: 40,
          }}
        >
          ✝
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          남문교회
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#C8A951",
            fontWeight: 500,
            marginBottom: 32,
          }}
        >
          이 땅을 품는 하늘 공동체
        </div>
        <div
          style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          대한예수교장로회(합신) · 서울시 금천구 독산로 94가길 29
        </div>
      </div>
    ),
    { ...size }
  );
}
