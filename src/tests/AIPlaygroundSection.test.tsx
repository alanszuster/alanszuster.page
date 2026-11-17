import { fireEvent, render, screen } from "@testing-library/react";
import AIPlaygroundSection from "../components/AIPlaygroundSection";

jest.mock("../styles/components/AIPlaygroundSection.module.css", () => ({}));

it("shows and clears the special result", async () => {
  const context = {
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    stroke: jest.fn(),
  };
  jest.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D
  );
  jest.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,test");
  HTMLCanvasElement.prototype.setPointerCapture = jest.fn();
  global.fetch = jest.fn(async (url) => ({
    ok: true,
    status: 200,
    json: async () => url === "/api/predict"
      ? { predictions: [{ class: "banana", confidence: 90 }], easter_egg: true }
      : { status: "healthy" },
  })) as jest.Mock;

  render(<AIPlaygroundSection />);
  fireEvent.pointerDown(screen.getByRole("img", { name: /drawing area/i }), {
    pointerId: 1,
    clientX: 10,
    clientY: 10,
  });
  fireEvent.click(screen.getByRole("button", { name: /predict draw/i }));
  expect(await screen.findByText("You")).toBeInTheDocument();
  expect(screen.getByText("101%")).toBeInTheDocument();
  expect(screen.queryByText("banana")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /clear/i }));
  expect(screen.queryByText("You")).not.toBeInTheDocument();
});
