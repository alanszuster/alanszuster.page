import React from "react";
import styles from "../styles/components/AboutSection.module.css";

export default function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className="container px-4">
        <div className="row gx-5 justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h2 className={styles.sectionTitle}>About Me</h2>
              <hr className={styles.divider} />
            </div>
            <div className={styles.contentBox}>
              <p className={styles.description}>
                I&apos;m a Site Reliability Engineer passionate about creating
                resilient, scalable systems that enable businesses to operate
                smoothly.
              </p>
              <p className={styles.description}>
                With several years of experience in infrastructure management,
                automation, and monitoring, I specialize in developing CI/CD
                pipelines, managing cloud infrastructures, and implementing
                effective monitoring solutions.
              </p>
              <p className={styles.description}>
                My goal is to bridge the gap between development and operations,
                ensuring that applications are not only delivered quickly but
                also run reliably in production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
