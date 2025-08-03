import React from "react";
import styles from "../styles/components/SkillsSection.module.css";
import {
  FaPython,
  FaJava,
  FaJs,
  FaNodeJs,
  FaDocker,
  FaGit,
  FaLinux,
  FaCloud,
  FaBrain,
  FaCogs,
} from "react-icons/fa";
import {
  SiTypescript,
  SiDash,
  SiTensorflow,
  SiPytorch,
  SiOpencv,
  SiKubernetes,
  SiTerraform,
  SiDatadog,
} from "react-icons/si";

export default function SkillsSection() {
  return (
    <section id="skills" className={styles.skills}>
      <div className="container px-4">
        <div className="row gx-5">
          <div className="col-lg-8 mx-auto">
            <h2 className={styles.sectionTitle}>Skills</h2>
            <hr className={styles.divider} />

            <div className={styles.skillTable}>
              <div className={styles.skillCategory}>
                <h3 className={styles.categoryHeader}>
                  <FaCogs className={styles.categoryIcon} /> Programming
                  Languages
                </h3>
                <ul className={styles.skillList}>
                  <li>
                    <FaPython /> Python
                  </li>
                  <li>
                    <FaJava /> Java
                  </li>
                  <li>
                    <FaJs /> JavaScript
                  </li>
                  <li>
                    <FaNodeJs /> Node.js
                  </li>
                  <li>
                    <SiTypescript /> TypeScript
                  </li>
                  <li>
                    <SiDash /> Bash
                  </li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3 className={styles.categoryHeader}>
                  <FaBrain className={styles.categoryIcon} /> AI & Data Science
                </h3>
                <ul className={styles.skillList}>
                  <li>
                    <FaBrain /> Machine Learning
                  </li>
                  <li>
                    <FaBrain /> Generative AI
                  </li>
                  <li>
                    <FaBrain /> Deep Learning
                  </li>
                  <li>
                    <FaBrain /> Computer Vision
                  </li>
                  <li>
                    <SiTensorflow /> TensorFlow
                  </li>
                  <li>
                    <SiPytorch /> PyTorch
                  </li>
                  <li>
                    <SiOpencv /> OpenCV
                  </li>
                  <li>
                    <FaBrain /> NLP
                  </li>
                </ul>
              </div>

              <div className={styles.skillCategory}>
                <h3 className={styles.categoryHeader}>
                  <FaCloud className={styles.categoryIcon} /> DevOps & Cloud
                </h3>
                <ul className={styles.skillList}>
                  <li>
                    <FaDocker /> Docker
                  </li>
                  <li>
                    <SiKubernetes /> Kubernetes
                  </li>
                  <li>
                    <FaCogs /> DevOps
                  </li>
                  <li>
                    <SiTerraform /> Terraform
                  </li>
                  <li>
                    <FaLinux /> Linux
                  </li>
                  <li>
                    <FaGit /> Git/GitHub
                  </li>
                  <li>
                    <FaCogs /> Software Engineering
                  </li>
                  <li>
                    <FaCloud /> Google Cloud
                  </li>
                  <li>
                    <FaCloud /> Azure
                  </li>
                  <li>
                    <SiDatadog /> Datadog
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
