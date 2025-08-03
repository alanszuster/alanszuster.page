import { render, screen } from "@testing-library/react";
jest.mock("../styles/components/AboutSection.module.css", () => ({}));
import AboutSection from "../components/AboutSection";

describe("AboutSection", () => {
  it("renders without crashing", () => {
    render(<AboutSection />);
    expect(screen.getAllByText(/about/i).length).toBeGreaterThan(0);
  });
});
