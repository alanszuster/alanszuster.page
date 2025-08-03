import { render, screen } from "@testing-library/react";
jest.mock("../styles/components/HeroSection.module.css", () => ({}));
import HeroSection from "../components/HeroSection";

describe("HeroSection", () => {
  it("renders without crashing", () => {
    render(<HeroSection />);
    expect(screen.getByText(/Alan Szuster/i)).toBeInTheDocument();
  });
});
