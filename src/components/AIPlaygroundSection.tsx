import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/components/AIPlaygroundSection.module.css";

export default function AIPlaygroundSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [randomWord, setRandomWord] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<string | null>(null);

  const handlePredict = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Convert canvas to Base64
    const imageData = canvas.toDataURL("image/png");

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_AI_APP_ENDPOINT}/predict`;
      const apiKey = process.env.NEXT_PUBLIC_AI_APP_TOKEN;

      if (!apiUrl || !apiKey) {
        setError("API configuration is missing");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey, // Changed to x-api-key
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      setPredictions(data.predictions || []);
      setError(null);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError("Failed to connect to the server");
    }
  };

  const handleGetKnownClasses = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_AI_APP_ENDPOINT}/get_classes`;
      const apiKey = process.env.NEXT_PUBLIC_AI_APP_TOKEN;

      if (!apiUrl || !apiKey) {
        setError("API configuration is missing");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-api-key": apiKey, // Changed to x-api-key
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      alert(`Available Classes: ${data.classes.join(", ")}`);
      setError(null);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError("Failed to connect to the server");
    }
  };

  const handleGetRandomClass = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_AI_APP_ENDPOINT}/get_random_word`;
      const apiKey = process.env.NEXT_PUBLIC_AI_APP_TOKEN;

      if (!apiUrl || !apiKey) {
        setError("API configuration is missing");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-api-key": apiKey, // Changed to x-api-key
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      setRandomWord(data.word || null);
      setError(null);
    } catch (err) {
      console.error(err); // Log the error for debugging
      setError("Failed to connect to the server");
    }
  };

  const checkApiHealth = async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_AI_APP_ENDPOINT}/health`;
      const apiKey = process.env.NEXT_PUBLIC_AI_APP_TOKEN;

      console.log("API URL:", apiUrl); // Debug log
      console.log("API Key:", apiKey); // Debug log

      if (!apiUrl || !apiKey) {
        setError("API configuration is missing");
        return;
      }

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-api-key": apiKey, // Changed to x-api-key
        },
      });

      console.log("API Health Response Status:", response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Health Error:", errorData); // Debug log
        setError(errorData.error || "An error occurred");
        return;
      }

      const data = await response.json();
      console.log("API Health Data:", data); // Debug log
      setApiHealth(`Status: ${data.status}, Model: ${data.model}`);
      setError(null);
    } catch (err) {
      console.error("API Health Exception:", err); // Debug log
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

                {/* Predictions Section */}
                {predictions.length > 0 && (
                  <div className={styles.predictions}>
                    <h4>Predictions:</h4>
                    <ul>
                      {predictions.map((prediction, index) => (
                        <li key={index}>{prediction}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Random Word Section */}
                {randomWord && (
                  <div className={styles.challengeWord}>
                    <div className="alert alert-info">
                      <strong>Try to draw:</strong> {randomWord}
                    </div>
                  </div>
                )}

                {/* API Health Section */}
                {apiHealth && (
                  <div className={styles.apiHealth}>
                    <div className="alert alert-success">
                      <strong>API Health:</strong> {apiHealth}
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
