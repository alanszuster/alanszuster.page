import { render, screen } from "@testing-library/react";
jest.mock("../styles/components/ExperienceSection.module.css", () => ({}));
import ExperienceSection from "../components/ExperienceSection";

describe("ExperienceSection", () => {
  it("renders roles and education", () => {
    render(<ExperienceSection />);
    expect(screen.getByText("Site Reliability Engineer")).toBeInTheDocument();
    expect(screen.getByText("ServiceNow Developer")).toBeInTheDocument();
    expect(screen.getByText(/Education/)).toBeInTheDocument();
  });
});
