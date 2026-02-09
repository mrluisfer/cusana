import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px",
        background:
          "linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 45%, #E0E7FF 100%)",
        color: "#0F172A",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 999,
            background: "linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFFFFF",
            fontSize: 52,
            fontWeight: 700,
            marginRight: 20,
            letterSpacing: -1,
          }}
        >
          C
        </div>
        <div style={{ fontSize: 52, fontWeight: 700 }}>{siteConfig.name}</div>
      </div>

      <div style={{ maxWidth: 920 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.05,
            marginBottom: 22,
          }}
        >
          Controla y optimiza tus suscripciones.
        </div>
        <div style={{ fontSize: 28, color: "#334155", lineHeight: 1.4 }}>
          Alertas antes de cada cobro, insights claros y visibilidad total de
          tus pagos recurrentes.
        </div>
      </div>

      <div style={{ display: "flex", fontSize: 22, color: "#475569" }}>
        <span style={{ marginRight: 16 }}>Recordatorios inteligentes</span>
        <span style={{ marginRight: 16 }}>•</span>
        <span style={{ marginRight: 16 }}>Insights claros</span>
        <span style={{ marginRight: 16 }}>•</span>
        <span>Ahorro real</span>
      </div>
    </div>,
    {
      width: size.width,
      height: size.height,
    },
  );
}
