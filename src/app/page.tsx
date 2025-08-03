"use client";

import { useEffect } from "react";
import Image from "next/image";
import HeroSection from "../components/HeroSection";
import AIPlaygroundSection from "../components/AIPlaygroundSection";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";
import SkillsSection from "../components/SkillsSection";

export default function HomePage() {
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav .links a");

    // Enhanced Intersection Observer with multiple thresholds
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add staggered animation class
            entry.target.classList.add("visible");

            // Update active navigation link
            const id = entry.target.getAttribute("id");
            if (id) {
              // Remove active class from all links
              navLinks.forEach((link) => link.classList.remove("active"));

              // Add active class to current link
              const activeLink = document.querySelector(
                `nav .links a[href="#${id}"]`
              );
              if (activeLink) {
                activeLink.classList.add("active");
              }

              // Update URL hash smoothly
              history.replaceState(null, "", `#${id}`);
            }

            // Add special effects for specific sections
            const sectionId = entry.target.getAttribute("id");
            if (sectionId === "ai-playground") {
              (entry.target as HTMLElement).style.setProperty(
                "--animation-delay",
                "0.3s"
              );
            }
          }
        });
      },
      {
        threshold: [0.2, 0.5, 0.8], // Multiple thresholds for smoother transitions
        rootMargin: "-10% 0px -10% 0px", // Trigger animation slightly before/after
      }
    );

    // Add initial animation state
    sections.forEach((section) => {
      (section as HTMLElement).style.willChange = "transform, opacity";
      observer.observe(section);
    });

    // Enhanced smooth scroll for navigation
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href")?.substring(1);
        const targetSection = document.getElementById(targetId || "");
        if (targetSection) {
          // Smooth scroll with offset for fixed navigation
          const offsetTop = targetSection.offsetTop - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });

    // Add scroll effect to navigation
    const nav = document.querySelector("nav");
    const handleScroll = () => {
      if (nav) {
        if (window.scrollY > 100) {
          nav.classList.add("scrolled");
        } else {
          nav.classList.remove("scrolled");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      sections.forEach((section) => {
        (section as HTMLElement).style.willChange = "auto";
      });
    };
  }, []);

  return (
    <>
      <header>
        <div className="menu">
          <Image src="/vercel.svg" alt="Menu Logo" width={50} height={50} />
        </div>
      </header>
      <nav>
        <div
          className="brand"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "50px",
          }}
        >
          <a href="#home" style={{ display: "flex", alignItems: "center" }}>
            <Image
              src="/custom-logo-as.png"
              alt="AS Logo"
              width={50}
              height={50}
            />
          </a>
          <span
            style={{
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            Alan Szuster
          </span>
        </div>
        <div className="links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#skills">Skills</a>
          <a href="#ai-playground">AI Playground</a>
        </div>
        <div className="social-icons">
          <a
            href="https://github.com/alanszuster"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://linkedin.com/in/alan-szuster"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
          <a href="mailto:alanszuster22@gmail.com">
            <i className="fas fa-envelope"></i>
          </a>
        </div>
      </nav>
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <SkillsSection />
      <AIPlaygroundSection />
    </>
  );
}
