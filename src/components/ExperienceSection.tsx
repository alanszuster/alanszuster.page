import React from "react";
import styles from "../styles/components/ExperienceSection.module.css";

const roles = [
  {
    title: "Site Reliability Engineer",
    period: "May 2024 — Present",
    points: [
      "Build, deploy and run AI agents and ML applications on Kubernetes, Vertex AI and Azure AI Foundry, including GPU workloads and model training.",
      "Design and operate Kubernetes clusters across GKE (Autopilot, Standard) and AKS, plus a hybrid cluster for self-hosted GitHub Actions runners.",
      "Contributed to migrating production applications from OpenShift to GKE Autopilot in Sweden: landing zone, networking, databases and fully rebuilt CI/CD.",
      "Part of the team that migrated VMs and their databases from Kyndryl's on-prem data center to Azure VMware Solution (AVS).",
      "Provision infrastructure with Terraform on GCP and Azure; deliver via GitHub Actions (incl. custom actions), Argo CD and Helm.",
      "Build automation in Python, Bash, JS and TS, including serverless on Cloud Run and Cloud Functions; load test applications in Grafana Cloud.",
    ],
  },
  {
    title: "ServiceNow Developer",
    period: "Dec 2022 — May 2024",
    points: [
      "Developed and administered ServiceNow (ITSM, custom apps) in JavaScript and Angular; automated workflows with Flow Designer and Script Includes.",
      "Built REST API and Python integrations; managed MID Server deployments for secure on-prem connectivity.",
    ],
  },
  {
    title: "IT Operator",
    period: "Jan 2022 — Nov 2022",
    points: [
      "First-line support for OS and business applications serving tens of thousands of retail employees.",
    ],
  },
];

const education = [
  {
    title: "Bachelor of Engineering, 2018 — 2022",
    place: "West Pomeranian University of Technology, Szczecin",
    detail: "Automation and Robotics (Mechatronics, Robotics and Automation Engineering)",
  },
  {
    title: "IT Technician, 2014 — 2018",
    place: "Zespół Szkół nr 1 w Goleniowie",
    detail: "IT Technician",
  },
];

export default function ExperienceSection() {
  return (
    <section id="experience" className={styles.experience}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <p className={styles.lead}>
            From first-line support to running production platforms, all at
            Salling Group A/S.
          </p>
        </div>
        <ol className={styles.timeline}>
          {roles.map((role) => (
            <li key={role.title} className={styles.role}>
              <div className={styles.roleHead}>
                <h3>{role.title}</h3>
                <span className={styles.period}>{role.period}</span>
              </div>
              <p className={styles.company}>Salling Group A/S</p>
              <ul>
                {role.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <h3 className={styles.eduTitle}>Education</h3>
        <div className={styles.eduGrid}>
          {education.map((e) => (
            <article key={e.title} className={styles.eduCard}>
              <h4>{e.title}</h4>
              <p>{e.place}</p>
              <p className={styles.eduDetail}>{e.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
