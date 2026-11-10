import React from "react";
import styles from "../styles/components/AboutSection.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.lead}>
            At Salling Group since 2022 and in SRE since 2024, I run
            production Kubernetes clusters across GKE and AKS plus the cloud
            networking around them.
          </p>
        </div>
        <div className={styles.contentGrid}>
          <article className={styles.contentBox}>
            <h3>Kubernetes & Platform</h3>
            <p className={styles.description}>
              GKE (Autopilot and Standard), AKS and a hybrid cluster for
              self-hosted GitHub Actions runners. GitOps delivery with Argo CD,
              Helm and Terraform.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>Cloud Networking & IaC</h3>
            <p className={styles.description}>
              Landing zones, hub-spoke VNets, vHub, ExpressRoute, Cloud
              Interconnect, firewalls and WAF. Everything as code with
              Terraform on GCP and Azure.
            </p>
          </article>
          <article className={styles.contentBox}>
            <h3>AI/ML & Agents</h3>
            <p className={styles.description}>
              Custom AI agents, LLM and RAG workloads, MCP and AIOps on
              Kubernetes, Vertex AI and Azure AI Foundry, including GPU
              workloads and model training.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
