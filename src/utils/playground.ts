export type Point = { x: number; y: number };

const ERROR_MESSAGES: Record<number, string> = {
  429: "Too many tries in a short time. Give it a minute and try again.",
  403: "Your browser could not be verified. Reload the page and try again.",
  504: "The model took too long to respond. Please try again.",
};

/** What to tell the visitor when the API answered with an error status. */
export function describeError(
  status: number,
  apiMessage?: string | null
): string {
  return ERROR_MESSAGES[status] ?? apiMessage ?? "An error occurred";
}

/** Clears the canvas and draws the strokes again the way they are drawn live. */
export function redrawStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Point[][],
  lineWidth: number
): void {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "#000000";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    if (stroke.length === 1) {
      ctx.beginPath();
      ctx.arc(stroke[0].x, stroke[0].y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      continue;
    }
    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }
    ctx.stroke();
  }
}
