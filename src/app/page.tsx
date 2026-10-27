"use client";

import { useEffect } from "react";
import Image from "next/image";
import HeroSection from "../components/HeroSection";
import AIPlaygroundSection from "../components/AIPlaygroundSection";
import ServicesSection from "../components/ServicesSection";
import AboutSection from "../components/AboutSection";

export default function HomePage() {
  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav .links a");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            const id = entry.target.getAttribute("id");
            if (id) {
              navLinks.forEach((link) => link.classList.remove("active"));

              const activeLink = document.querySelector(
                `nav .links a[href="#${id}"]`
              );
              if (activeLink) {
                activeLink.classList.add("active");
              }

              history.replaceState(null, "", `#${id}`);
            }

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
        threshold: [0.2, 0.5, 0.8],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    sections.forEach((section) => {
      (section as HTMLElement).style.willChange = "transform, opacity";
      observer.observe(section);
    });

    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href")?.substring(1);
        const targetSection = document.getElementById(targetId || "");
        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });

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
      <nav>
        <div className="brand">
          <a href="#home" className="brand-link" aria-label="Go to home section">
            <Image
              src="/custom-logo-as.png"
              alt="AS Logo"
              width={50}
              height={50}
            />
          </a>
          <span>Alan Szuster</span>
          <div
            className="hamburger"
            role="button"
            tabIndex={0}
            aria-label="Toggle mobile menu"
            onClick={() => {
              const hamburger = document.querySelector(".hamburger");
              const links = document.querySelector(".links");
              const socialIcons = document.querySelector(".social-icons");

              hamburger?.classList.toggle("active");
              links?.classList.toggle("active");
              socialIcons?.classList.toggle("active");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const hamburger = document.querySelector(".hamburger");
                const links = document.querySelector(".links");
                const socialIcons = document.querySelector(".social-icons");

                hamburger?.classList.toggle("active");
                links?.classList.toggle("active");
                socialIcons?.classList.toggle("active");
              }
            }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className="links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Portfolio</a>
          <a href="#ai-playground">Playground</a>
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
      <AIPlaygroundSection />
    </>
  );
}
