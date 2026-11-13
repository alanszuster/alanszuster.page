/**
 * @jest-environment node
 */
import { describeError, redrawStrokes } from "../utils/playground";

describe("describeError", () => {
  it("explains a rate limit and a failed browser check in plain words", () => {
    expect(describeError(429, "Too Many Requests")).toMatch(/give it a minute/i);
    expect(describeError(403, "Request blocked")).toMatch(/reload the page/i);
    expect(describeError(504)).toMatch(/too long/i);
  });

  it("keeps the API's own message for other errors, with a fallback", () => {
    expect(describeError(400, "Invalid image data")).toBe("Invalid image data");
    expect(describeError(500, null)).toBe("An error occurred");
    expect(describeError(500)).toBe("An error occurred");
  });
});

function fakeContext() {
  const calls: string[] = [];
  const ctx = {
    canvas: { width: 600, height: 600 },
    clearRect: (...a: number[]) => calls.push(`clear ${a.join(",")}`),
    beginPath: () => calls.push("begin"),
    moveTo: (x: number, y: number) => calls.push(`move ${x},${y}`),
    lineTo: (x: number, y: number) => calls.push(`line ${x},${y}`),
    arc: (x: number, y: number, r: number) => calls.push(`arc ${x},${y},${r}`),
    stroke: () => calls.push("stroke"),
    fill: () => calls.push("fill"),
  } as unknown as CanvasRenderingContext2D;
  return { ctx, calls };
}

describe("redrawStrokes", () => {
  it("clears the canvas, then draws a path per stroke and a dot per tap", () => {
    const { ctx, calls } = fakeContext();
    redrawStrokes(
      ctx,
      [
        [
          { x: 10, y: 10 },
          { x: 20, y: 30 },
        ],
        [{ x: 50, y: 60 }],
      ],
      16
    );
    expect(calls).toEqual([
      "clear 0,0,600,600",
      "begin",
      "move 10,10",
      "line 20,30",
      "stroke",
      "begin",
      "arc 50,60,8",
      "fill",
    ]);
  });

  it("only clears when there are no strokes left (the last one was undone)", () => {
    const { ctx, calls } = fakeContext();
    redrawStrokes(ctx, [], 16);
    expect(calls).toEqual(["clear 0,0,600,600"]);
  });
});
