import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/components/AIPlaygroundSection.module.css";
import {
  describeError,
  redrawStrokes,
  type Point,
} from "../utils/playground";

type Prediction = { class: string; confidence: number };

// Live drawing (what the visitor sees)
const LIVE_LINE_WIDTH = 16;

// Image sent to the model: one object that fills the frame, centred, with a
// thick stroke, drawn the way the training images are drawn. The server
// shrinks the whole image to the model's own input size (it reads that from
// the model), so we send a 280px version that already looks like that
// (cropped, centred, scaled).
const MODEL_INPUT_SIZE = 280;
const MODEL_MARGIN = 25;
const MODEL_LINE_WIDTH = 22;
const MIN_EXTENT = 40;

const LOW_CONFIDENCE = 40;

const HEALTH_MESSAGES: Record<string, string> = {
  auth_failed: "API is reachable, but authentication failed",
  model_unavailable: "API is reachable, but the model is not loaded",
  unreachable: "API is not reachable",
  misconfigured: "API is not configured",
};

// Re-check after the visitor comes back to the tab, but not more often than this.
const HEALTH_RECHECK_MS = 60_000;

const normalise = (value: string) =>
  value.toLowerCase().replace(/[_\s]+/g, " ").trim();

function renderForModel(strokes: Point[][]): string | null {
  const points = strokes.flat();
  if (points.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const { x, y } of points) {
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  const extent = Math.max(maxX - minX, maxY - minY, MIN_EXTENT);
  const scale = (MODEL_INPUT_SIZE - 2 * MODEL_MARGIN) / extent;
  const offsetX = MODEL_INPUT_SIZE / 2 - ((minX + maxX) / 2) * scale;
  const offsetY = MODEL_INPUT_SIZE / 2 - ((minY + maxY) / 2) * scale;

  const out = document.createElement("canvas");
  out.width = MODEL_INPUT_SIZE;
  out.height = MODEL_INPUT_SIZE;
  const ctx = out.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = MODEL_LINE_WIDTH;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of strokes) {
    if (stroke.length === 0) continue;
    ctx.beginPath();
    ctx.moveTo(stroke[0].x * scale + offsetX, stroke[0].y * scale + offsetY);
    if (stroke.length === 1) {
      // A single tap: draw a dot
      ctx.lineTo(
        stroke[0].x * scale + offsetX + 0.01,
        stroke[0].y * scale + offsetY
      );
    }
    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x * scale + offsetX, stroke[i].y * scale + offsetY);
    }
    ctx.stroke();
  }

  return out.toDataURL("image/png");
}

export default function AIPlaygroundSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const activeStrokeRef = useRef<Point[] | null>(null);

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [knownClasses, setKnownClasses] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [randomWord, setRandomWord] = useState<string | null>(null);
  const [apiHealth, setApiHealth] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState(true);
  const [apiVersion, setApiVersion] = useState<string | null>(null);
  const lastHealthCheck = useRef(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    // The canvas is 600x600 but may be shown smaller (e.g. on phones),
    // so convert from CSS pixels to canvas pixels.
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return {
      x: Math.max(0, Math.min(x, canvas.width)),
      y: Math.max(0, Math.min(y, canvas.height)),
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getPoint(e);
    const stroke = [point];
    activeStrokeRef.current = stroke;
    strokesRef.current.push(stroke);

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(point.x, point.y, LIVE_LINE_WIDTH / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const stroke = activeStrokeRef.current;
    if (!stroke) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;

    const point = getPoint(e);
    const previous = stroke[stroke.length - 1];
    stroke.push(point);

    ctx.strokeStyle = "#000000";
    ctx.lineWidth = LIVE_LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(previous.x, previous.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activeStrokeRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  // Real requests are the best health signal: let their outcome update the
  // indicator. 4xx such as 400 (bad drawing) or 429 (rate limit) say nothing
  // about the API's health, so they leave it alone.
  const noteApiResult = (status: number | null) => {
    const markHealthy = () => {
      setApiHealthy(true);
      setApiHealth("healthy");
    };
    const markBroken = (key: string) => {
      setApiHealthy(false);
      setApiHealth(HEALTH_MESSAGES[key]);
    };

    if (status === null) markBroken("unreachable");
    else if (status < 400) markHealthy();
    else if (status === 401) markBroken("auth_failed");
    else if (status === 503) markBroken("model_unavailable");
    else if (status >= 500) markBroken("unreachable");
  };

  const handlePredict = async () => {
    setActiveSection("predictions");

    const image = renderForModel(strokesRef.current);
    if (!image) {
      setError("Draw something first before predicting.");
      return;
    }

    setIsPredicting(true);
    setIsSlow(false);
    setError(null);

    // The hosted model can be asleep; tell the visitor instead of looking broken
    const slowTimer = setTimeout(() => setIsSlow(true), 4000);
    const controller = new AbortController();
    const abortTimer = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
        signal: controller.signal,
      });
      noteApiResult(response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setPredictions([]);
        setError(describeError(response.status, errorData?.error));
        return;
      }

      const data = await response.json();
      setPredictions(data.predictions || []);
    } catch (err) {
      noteApiResult(null);
      setPredictions([]);
      setError(
        err instanceof DOMException && err.name === "AbortError"
          ? "The model took too long to respond. Please try again."
          : "Failed to connect to the server"
      );
    } finally {
      clearTimeout(slowTimer);
      clearTimeout(abortTimer);
      setIsPredicting(false);
      setIsSlow(false);
    }
  };

  // The class list only changes with a new model, so it is fetched once (the edge caches
  // it too). The random word is picked here: it costs the API no request at all.
  const classesRef = useRef<string[] | null>(null);
  const loadClasses = async (): Promise<string[] | null> => {
    if (classesRef.current) return classesRef.current;
    try {
      const response = await fetch("/api/get_classes", { method: "GET" });
      noteApiResult(response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        setError(describeError(response.status, errorData?.error));
        return null;
      }

      const data = await response.json();
      classesRef.current = data.classes || [];
      return classesRef.current;
    } catch {
      noteApiResult(null);
      setError("Failed to connect to the server");
      return null;
    }
  };

  const handleGetKnownClasses = async () => {
    setActiveSection("knownClasses");
    const classes = await loadClasses();
    if (classes) {
      setKnownClasses(classes);
      setError(null);
    }
  };

  const handleGetRandomClass = async () => {
    const classes = await loadClasses();
    if (!classes || classes.length === 0) return;
    setRandomWord(classes[Math.floor(Math.random() * classes.length)]);
    // A result for the previous word must not be judged against the new one
    setPredictions([]);
    setError(null);
  };

  const checkApiHealth = async () => {
    // /api/health checks the whole path (reachable, authenticated, model loaded)
    lastHealthCheck.current = Date.now();
    try {
      const response = await fetch("/api/health");
      const data = await response.json().catch(() => null);
      if (response.ok && data?.status === "ok") {
        setApiHealthy(true);
        setApiHealth("healthy");
        setApiVersion(typeof data.version === "string" ? data.version : null);
        return;
      }
      setApiHealthy(false);
      setApiHealth(HEALTH_MESSAGES[data?.status] ?? "unhealthy");
    } catch {
      setApiHealthy(false);
      setApiHealth("not reachable");
    }
  };

  useEffect(() => {
    // Fetch on mount: state is only set after the await, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkApiHealth();

    const recheck = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastHealthCheck.current > HEALTH_RECHECK_MS
      ) {
        checkApiHealth();
      }
    };
    document.addEventListener("visibilitychange", recheck);
    return () => document.removeEventListener("visibilitychange", recheck);
  }, []);

  const handleUndo = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || strokesRef.current.length === 0) return;
    strokesRef.current.pop();
    activeStrokeRef.current = null;
    redrawStrokes(ctx, strokesRef.current, LIVE_LINE_WIDTH);
    // A result for the drawing as it was must not stay next to the new one
    setPredictions([]);
    setError(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    strokesRef.current = [];
    activeStrokeRef.current = null;
    setPredictions([]);
    setError(null);
  };

  const topGuess = predictions[0];

  let challengeResult: "hit" | "close" | "miss" | null = null;
  if (randomWord && predictions.length > 0 && activeSection === "predictions") {
    const target = normalise(randomWord);
    const rank = predictions.findIndex((p) => normalise(p.class) === target);
    challengeResult = rank === 0 ? "hit" : rank > 0 ? "close" : "miss";
  }

  return (
    <section id="ai-playground" className={styles.aiPlayground}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.sectionHeading}>AI Playground</h2>
          <h3 className={styles.sectionSubheading}>
            Draw a sketch and let the model classify it.
          </h3>
          <p className={styles.about}>
            This is a live demo of{" "}
            <a
              href="https://github.com/alanszuster/doodleai"
              target="_blank"
              rel="noopener noreferrer"
            >
              doodleai
            </a>
            , my own sketch-recognition project. A custom convolutional neural
            network, trained on Google&apos;s Quick Draw! dataset, recognises
            120 hand-drawn categories and returns its top three guesses with
            confidence scores.
          </p>
          <ul className={styles.facts}>
            <li>Python + TensorFlow</li>
            <li>Custom CNN</li>
            <li>REST API with OIDC auth and rate limiting</li>
            <li>Docker</li>
            <li>Hosted on Hugging Face Spaces</li>
          </ul>
          <p className={styles.note}>
            Your drawing goes through this site&apos;s server to the model API,
            so no API credentials ever reach your browser. The demo is rate
            limited, so give it a moment between predictions.
          </p>
        </div>

        <div className={styles.playgroundShell}>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              {/* API Health Section */}
              {apiHealth && (
                <div
                  className={`${styles.apiHealth} ${
                    apiHealthy ? "" : styles.apiHealthBad
                  }`}
                  role="status"
                >
                  <strong>API status:</strong> {apiHealth}
                  {apiHealthy && apiVersion && (
                    <span className={styles.apiVersion}>
                      {" · "}
                      {/^\d/.test(apiVersion) ? `v${apiVersion}` : apiVersion}
                    </span>
                  )}
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
                  role="img"
                  aria-label="Drawing area. Draw with a mouse, finger or stylus."
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                ></canvas>
              </div>

              {/* Controls */}
              <div className={styles.controlsContainer}>
                <button
                  className={styles.controlButton}
                  onClick={handleUndo}
                >
                  <i className="fas fa-undo"></i> Undo
                </button>
                <button
                  className={styles.controlButton}
                  onClick={clearCanvas}
                >
                  <i className="fas fa-eraser"></i> Clear
                </button>
                <button
                  className={styles.primaryButton}
                  onClick={handlePredict}
                  disabled={isPredicting}
                  aria-busy={isPredicting}
                >
                  <i className="fas fa-magic"></i>{" "}
                  {isPredicting ? "Predicting…" : "Predict Draw"}
                </button>
                <button
                  className={`${styles.controlButton} ${styles.controlButtonGhost}`}
                  onClick={handleGetKnownClasses}
                >
                  <i className="fas fa-list"></i> Get Known Classes
                </button>
                <button
                  className={`${styles.controlButton} ${styles.controlButtonGhost}`}
                  onClick={handleGetRandomClass}
                >
                  <i className="fas fa-dice"></i> Get Random Class
                </button>
              </div>

              <div aria-live="polite">
                {isPredicting && isSlow && (
                  <div className={styles.slowNotice}>
                    Waking up the model, the first prediction can take a
                    little longer…
                  </div>
                )}

                {/* Dynamic Sections */}
                {activeSection === "predictions" && topGuess && (
                  <div className={styles.predictions}>
                    <h4>Top guesses</h4>
                    <ul className={styles.resultList}>
                      {predictions.map((prediction, index) => {
                        const percent = Math.max(
                          0,
                          Math.min(100, prediction.confidence)
                        );
                        return (
                          <li key={prediction.class}>
                            <div className={styles.resultRow}>
                              <span
                                className={
                                  index === 0
                                    ? styles.resultNameTop
                                    : styles.resultName
                                }
                              >
                                {prediction.class}
                              </span>
                              <span>{prediction.confidence.toFixed(1)}%</span>
                            </div>
                            <div className={styles.bar} aria-hidden="true">
                              <div
                                className={
                                  index === 0
                                    ? styles.barFillTop
                                    : styles.barFill
                                }
                                style={{ width: `${Math.max(2, percent)}%` }}
                              />
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    {topGuess.confidence < LOW_CONFIDENCE && (
                      <p className={styles.hint}>
                        Not very sure about this one. Try one simple object,
                        drawn large, with a continuous line.
                      </p>
                    )}
                  </div>
                )}

                {activeSection === "knownClasses" &&
                  knownClasses.length > 0 && (
                    <div className={styles.predictions}>
                      <h4>Known Classes:</h4>
                      <p>{knownClasses.join(", ")}</p>
                    </div>
                  )}

                {randomWord && (
                  <div className={styles.challengeWord}>
                    <div>
                      <strong>Try to draw:</strong> {randomWord}
                    </div>
                    {challengeResult === "hit" && (
                      <div className={styles.challengeResult}>
                        Nailed it! The model recognised it.
                      </div>
                    )}
                    {challengeResult === "close" && (
                      <div className={styles.challengeResult}>
                        Close! It was in the model&apos;s top three.
                      </div>
                    )}
                    {challengeResult === "miss" && (
                      <div className={styles.challengeResult}>
                        Not this time. Clear and try again.
                      </div>
                    )}
                  </div>
                )}

                {/* Error Section */}
                {error && (
                  <div className={styles["alert-danger"]}>
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </div>

              {/* Instructions Section */}
              <div className={styles.instructions}>
                <h4>How to use:</h4>
                <ul className={styles.instructionsList}>
                  <li>
                    Draw one simple object on the canvas with your mouse, finger
                    or stylus
                  </li>
                  <li>
                    Click &quot;Predict Draw&quot; to let AI analyze your
                    artwork
                  </li>
                  <li>
                    Your sketch is automatically cropped, centred and scaled to
                    match the training data before it is sent
                  </li>
                  <li>
                    Use &quot;Get Known Classes&quot; to see all available
                    drawing categories
                  </li>
                  <li>
                    Use &quot;Get Random Class&quot; for a drawing challenge:
                    the model tells you if it got it
                  </li>
                  <li>Click &quot;Clear&quot; to start over</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
