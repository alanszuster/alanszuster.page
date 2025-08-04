import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/components/AIPlaygroundSection.module.css";

export default function AIPlaygroundSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [predictions, setPredictions] = useState<
    Array<string | { class: string; confidence: number }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [randomWord, setRandomWord] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handlePredict = async () => {
    console.log("Predict button clicked");
    setActiveSection("predictions");
    const canvas = canvasRef.current;
    if (!canvas) {
      setError("Please draw something on the canvas before predicting.");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setError("Canvas context is not available.");
      return;
    }

    // Convert canvas to Base64
    const imageData = canvas.toDataURL("image/png");

    try {
      console.log("Sending prediction request...");
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      console.log("Prediction data:", data);
      setPredictions(data.predictions || []);
      setError(null);
    } catch (err) {
      console.error("Prediction exception:", err);
      setError("Failed to connect to the server");
    }
  };

  const handleGetKnownClasses = async () => {
    console.log("Get Known Classes button clicked");
    setActiveSection("knownClasses");
    try {
      console.log("Sending get classes request...");
      const response = await fetch("/api/get_classes", {
        method: "GET",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      console.log("Classes data:", data);
      setPredictions(data.classes || []);
      setError(null);
    } catch (err) {
      console.error("Get classes exception:", err);
      setError("Failed to connect to the server");
    }
  };

  const handleGetRandomClass = async () => {
    console.log("Get Random Class button clicked");
    try {
      console.log("Sending get random class request...");
      const response = await fetch("/api/get_random_class", {
        method: "GET",
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      console.log("Random class data:", data);
      setRandomWord(data.word || "");
      setError(null);
    } catch (err) {
      console.error("Get random class exception:", err);
      setError("Failed to connect to the server");
    }
  };

  const checkApiHealth = async () => {
    try {
      const response = await fetch("/api/health");
      if (!response.ok) {
        setApiHealth("API is unhealthy");
        setError("Failed to connect to the server");
        return;
      }
      setApiHealth("API is healthy");
    } catch {
      setApiHealth("API is unhealthy");
      setError("Failed to connect to the server");
    }
  };

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

  useEffect(() => {
    checkApiHealth();
  }, []);

  useEffect(() => {
    console.log("Rendering Random Word:", randomWord);
  }, [randomWord]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

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
                {/* API Health Section */}
                {apiHealth && (
                  <div className={styles.apiHealth}>
                    <strong>API Health:</strong> {apiHealth}
                  </div>
                )}

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
                    onClick={clearCanvas}
                  >
                    <i className="fas fa-eraser"></i> Clear
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={handlePredict}
                  >
                    <i className="fas fa-magic"></i> Predict Draw
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={handleGetKnownClasses}
                  >
                    <i className="fas fa-list"></i> Get Known Classes
                  </button>
                  <button
                    className={styles.controlButton}
                    onClick={handleGetRandomClass}
                  >
                    <i className="fas fa-dice"></i> Get Random Class
                  </button>
                </div>

                {/* Dynamic Sections */}
                {activeSection === "predictions" && predictions.length > 0 && (
                  <div className={styles.predictions}>
                    <h4>Predictions:</h4>
                    <ul>
                      {predictions.map((prediction, index) => (
                        <li key={index}>
                          {typeof prediction === "string"
                            ? prediction
                            : `Class: ${
                                prediction.class
                              }, Confidence: ${prediction.confidence?.toFixed(
                                2
                              )}%`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeSection === "knownClasses" && predictions.length > 0 && (
                  <div className={styles.predictions}>
                    <h4>Known Classes:</h4>
                    <p>{predictions.join(", ")}</p>
                  </div>
                )}

                {randomWord && (
                  <div className={styles.challengeWord}>
                    <div className="alert alert-info">
                      <strong>Try to draw:</strong> {randomWord}
                    </div>
                  </div>
                )}

                {/* Error Section */}
                {error && (
                  <div className="alert alert-danger">
                    <strong>Error:</strong> {error}
                  </div>
                )}

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
