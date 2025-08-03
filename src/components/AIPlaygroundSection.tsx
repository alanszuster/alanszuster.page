import React, { useEffect, useRef } from "react";
import styles from "../styles/components/AIPlaygroundSection.module.css";

export default function AIPlaygroundSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawing = false;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      drawing = true;
      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      let x, y;

      if (e instanceof TouchEvent) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      ctx.moveTo(x, y);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      let clientX, clientY;

      if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const x = Math.max(0, Math.min(clientX - rect.left, canvas.width));
      const y = Math.max(0, Math.min(clientY - rect.top, canvas.height));

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "black";

      // Begin a new path only if within bounds
      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    };

    const stopDrawing = () => {
      drawing = false;
      ctx.closePath();
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);

    // Touch events for mobile
    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);
    canvas.addEventListener("touchend", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseout", stopDrawing);

      // Remove touch events
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, []);

  return (
    <section id="ai-playground" className={styles.aiPlayground}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-12 text-center">
            <h2 className={styles.sectionHeading}>AI Playground</h2>
            <h3 className={styles.sectionSubheading}>
              Draw something and let AI guess what it is!
            </h3>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className={styles.card}>
              <div className={styles.cardBody}>
                {/* Drawing Canvas */}
                <div className={styles.drawingArea}>
                  <canvas
                    ref={canvasRef}
                    id="drawingCanvas"
                    width="600"
                    height="600"
                    className={styles.drawingCanvas}
                  ></canvas>
                </div>

                {/* Controls */}
                <div className={styles.controlsContainer}>
                  <button
                    className={styles.controlButton}
                    onClick={() => {
                      const canvas = canvasRef.current;
                      if (!canvas) return;
                      const ctx = canvas.getContext("2d");
                      if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                      }
                    }}
                  >
                    <i className="fas fa-eraser"></i> Clear
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={() => {
                      // TODO: Implement predict functionality
                      console.log("Predict drawing clicked");
                    }}
                  >
                    <i className="fas fa-magic"></i> Predict Draw
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={() => {
                      // TODO: Implement get known classes functionality
                      console.log("Get known classes clicked");
                    }}
                  >
                    <i className="fas fa-list"></i> Get Known Classes
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={() => {
                      // TODO: Implement get random class functionality
                      console.log("Get random class clicked");
                    }}
                  >
                    <i className="fas fa-dice"></i> Get Random Class
                  </button>
                </div>

                {/* Challenge Word */}
                <div
                  className={styles.challengeWord}
                  style={{ display: "none" }}
                >
                  <div className="alert alert-info">
                    <strong>Try to draw:</strong> <span id="wordToDraw"></span>
                  </div>
                </div>

                {/* Instructions Section */}
                <div className={styles.instructions}>
                  <h4>How to use:</h4>
                  <ul className={styles.instructionsList}>
                    <li>
                      Draw something on the canvas using your mouse or touch
                    </li>
                    <li>
                      Click &quot;Predict Draw&quot; to let AI analyze your
                      artwork
                    </li>
                    <li>
                      Use &quot;Get Known Classes&quot; to see all available
                      drawing categories
                    </li>
                    <li>
                      Use &quot;Get Random Class&quot; for drawing challenges
                    </li>
                    <li>Click &quot;Clear&quot; to start over</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
