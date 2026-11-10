import React from "react";
import styles from "../styles/components/SkillsSection.module.css";

const skills = [
  "Kubernetes",
  "GKE",
  "AKS",
  "OpenShift",
  "Docker",
  "Helm",
  "Terraform",
  "Argo CD",
  "GitHub Actions",
  "Google Cloud",
  "Azure",
  "Cloud Run",
  "Cloud Functions",
  "Cloud SQL",
  "Cloud Armor",
  "IAM",
  "VPC / VNet",
  "ExpressRoute",
  "Cloud Interconnect",
  "Load Balancing",
  "WAF",
  "Firewalls",
  "Agentic AI",
  "Custom AI agents",
  "LLMs",
  "RAG",
  "MCP",
  "Vertex AI",
  "Azure AI Foundry",
  "PyTorch",
  "TensorFlow",
  "MLflow",
  "GPU workloads",
  "AIOps",
  "Datadog",
  "Grafana Cloud",
  "Zabbix",
  "Python",
  "TypeScript",
  "JavaScript",
  "Bash",
  "Linux",
  "Git",
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
        <ul className={styles.chips}>
          {skills.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
