import { render, screen } from "@testing-library/react";
jest.mock("../styles/components/SkillsSection.module.css", () => ({}));
import SkillsSection from "../components/SkillsSection";

describe("SkillsSection", () => {
  it("renders without crashing", () => {
    render(<SkillsSection />);
    expect(screen.getByText(/skills/i)).toBeInTheDocument();
  });
});
