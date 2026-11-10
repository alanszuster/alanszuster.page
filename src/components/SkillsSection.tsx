import React from "react";
import styles from "../styles/components/SkillsSection.module.css";

const groups = [
  {
    icon: "fa-brain",
    title: "AI / ML & Agents",
    items: ["Agentic AI", "Custom AI agents", "LLMs", "RAG", "MCP", "Prompt engineering", "Vertex AI", "Azure AI Foundry", "Azure SRE Agent", "PyTorch", "TensorFlow", "MLflow", "GPU workloads", "AIOps"],
  },
  {
    icon: "fa-cloud",
    title: "Google Cloud",
    items: ["GKE (Autopilot, Standard)", "Cloud Run", "Cloud Functions", "Cloud SQL", "Cloud Storage", "Cloud Armor", "IAM"],
  },
  {
    icon: "fa-server",
    title: "Azure",
    items: ["AKS", "AVS", "Virtual Hub (vHub)", "Hub-spoke VNet", "ExpressRoute", "Azure Firewall"],
  },
  {
    icon: "fa-cubes",
    title: "Containers & IaC",
    items: ["Kubernetes", "OpenShift", "Docker", "Helm", "Terraform"],
  },
  {
    icon: "fa-network-wired",
    title: "Networking",
    items: ["VPC / VNet", "Peering", "Cloud Interconnect", "Cloud NAT", "Load Balancing", "WAF", "Firewalls"],
  },
  {
    icon: "fa-gauge-high",
    title: "CI/CD, Observability & Code",
    items: ["GitHub Actions", "Argo CD", "Git", "Linux", "Grafana Cloud", "Datadog", "Zabbix", "Python", "TypeScript", "JavaScript", "Bash"],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className={styles.skills}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Skills</h2>
          <p className={styles.lead}>
            The stack I use daily across platform, cloud and AI workloads.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {groups.map((g) => (
            <article key={g.title} className={styles.card}>
              <i className={`fas ${g.icon}`}></i>
              <h3 className={styles.cardTitle}>{g.title}</h3>
              <ul className={styles.chips}>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
