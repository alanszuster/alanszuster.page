import { ImageResponse } from "next/og";

export const alt = "Alan Szuster — Site Reliability Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0f141b 0%, #16263a 100%)",
          color: "#f1f6fb",
        }}
      >
        <div style={{ fontSize: 24, color: "#ffc56b", letterSpacing: 3 }}>
          CLOUD · PLATFORM · INFRASTRUCTURE · AIOPS · DEV / AI ENGINEER
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24 }}>
          Alan Szuster
        </div>
        <div style={{ fontSize: 44, color: "#5fc8ff", marginTop: 12 }}>
          Site Reliability Engineer
        </div>
        <div style={{ fontSize: 30, color: "#a7b4c8", marginTop: 36 }}>
          Kubernetes on GKE and AKS · GCP and Azure · Terraform · AI agents
        </div>
      </div>
    ),
    size
  );
}
