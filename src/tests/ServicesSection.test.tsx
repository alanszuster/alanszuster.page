import { render, screen } from "@testing-library/react";
jest.mock("../styles/components/ServicesSection.module.css", () => ({}));
import ServicesSection from "../components/ServicesSection";

describe("ServicesSection", () => {
  it("renders without crashing", () => {
    render(<ServicesSection />);
    expect(screen.getByText(/What I Do/i)).toBeInTheDocument();
  });
});
