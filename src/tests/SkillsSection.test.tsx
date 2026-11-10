import { render, screen } from "@testing-library/react";
jest.mock("../styles/components/SkillsSection.module.css", () => ({}));
import SkillsSection from "../components/SkillsSection";

describe("SkillsSection", () => {
  it("renders skill groups", () => {
    render(<SkillsSection />);
    expect(screen.getByText("Skills")).toBeInTheDocument();
    expect(screen.getByText("Terraform")).toBeInTheDocument();
  });
});
