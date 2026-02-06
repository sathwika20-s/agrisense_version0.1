import { useState } from "react";
import { detectDisease } from "../services/api.js";

export default function DiseaseScanner() {
  const [imageFile, setImageFile] = useState(null);
  const [cropName, setCropName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!imageFile) {
      setError("Please upload a leaf image (jpg or png).");
      return;
    }

    setLoading(true);
    try {
      const data = await detectDisease({ imageFile, cropName });
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to run disease detection.");
    } finally {
      setLoading(false);
    }
  }

  const detection = result?.detection;
  const diseaseInfo = result?.disease_info;
  const rec = result?.recommendations;

  return (
    <>
      <header className="content-header">
        <div className="content-heading">
          <div className="content-title-row">
            <div className="badge">
              <span className="badge-dot-amber" />
              Image‑based disease triage
            </div>
          </div>
          <h1 className="content-title">Disease scanner</h1>
          <p className="content-subtitle">
            Upload a crop leaf image and send it to your backend&apos;s
            rule‑based detector. Use the result as a fast triage, then confirm
            on the field.
          </p>
        </div>
        <div className="content-header-right">
          <div className="page-toolbar">
            <span className="pill-soft">POST /api/disease/detect</span>
          </div>
          <div className="dot-row">
            <span />
            <span className="mono">
              Backend accepts multipart form data: field <code>image</code> +
              optional <code>crop_name</code>.
            </span>
          </div>
        </div>
      </header>

      {error && <div className="error-text">{error}</div>}

      <section className="page-main">
        <section>
          <div className="page-section-title">Upload</div>
          <div className="page-section-description">
            Use clear leaf close‑ups for best signal.
          </div>

          <form
            onSubmit={handleSubmit}
            className="card"
            style={{ marginTop: "0.7rem" }}
          >
            <div className="card-inner">
              <div className="form-grid">
                <div className="form-row">
                  <label className="label">
                    Leaf image <span>*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    className="input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setImageFile(file || null);
                    }}
                  />
                  <div className="text-muted" style={{ marginTop: "0.3rem" }}>
                    Max 5MB · PNG or JPG · avoid strong shadows or blur.
                  </div>
                </div>
                <div className="form-row">
                  <label className="label">Crop name</label>
                  <input
                    className="input"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. tomato, potato, rice"
                  />
                  <div className="text-muted" style={{ marginTop: "0.3rem" }}>
                    Helps the backend narrow down likely diseases.
                  </div>
                </div>
              </div>

              <div className="flex-between" style={{ marginTop: "0.9rem" }}>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Scanning…" : "Scan disease"}
                </button>
                <div className="pill-stack">
                  <span>Use multiple images for confirmation</span>
                  <span>Cross‑check with agronomist for critical fields</span>
                </div>
              </div>
            </div>
          </form>

          {result && (
            <div className="card" style={{ marginTop: "0.9rem" }}>
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Detection summary</div>
                    <div className="card-subtitle">
                      Rule‑based output from your backend model.
                    </div>
                  </div>
                  <span className="badge-soft-alt">
                    {detection?.detected_at
                      ? new Date(detection.detected_at).toLocaleString()
                      : "Just now"}
                  </span>
                </div>

                {detection ? (
                  <div className="card-grid">
                    <div className="stat">
                      <span className="stat-label">Disease</span>
                      <span className="stat-value">
                        {detection.disease_name}
                      </span>
                      <span className="stat-pill pill">
                        Crop: {detection.crop || "Unknown"}
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Confidence</span>
                      <span className="stat-value">
                        {detection.confidence}%
                      </span>
                      <span className="stat-pill stat-label">
                        Rule‑based demo, not ML.
                      </span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Image path</span>
                      <span className="stat-value mono">
                        {result.image_url || "Not exposed"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state">
                    Backend returned no detection payload.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="page-section-title">Disease details</div>
          <div className="page-section-description">
            Information and actionable recommendations from the backend
            database.
          </div>

          <div className="grid page-main-single" style={{ marginTop: "0.7rem" }}>
            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      {diseaseInfo?.name || "Disease profile"}
                    </div>
                    <div className="card-subtitle">
                      Description, typical symptoms and prevention.
                    </div>
                  </div>
                </div>

                {diseaseInfo ? (
                  <>
                    <p className="tagline">{diseaseInfo.description}</p>
                    <div className="divider" />
                    <div className="page-section-title">Common symptoms</div>
                    <ul className="list-muted">
                      {(diseaseInfo.symptoms || []).map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="empty-state">
                    Run a scan to see disease details sourced from{" "}
                    <code>diseases_database.json</code>.
                  </div>
                )}
              </div>
            </article>

            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Recommended actions</div>
                    <div className="card-subtitle">
                      Immediate field actions, treatment and cultural
                      practices.
                    </div>
                  </div>
                </div>

                {rec ? (
                  <>
                    <p className="tagline">
                      <strong>Immediate action:</strong>{" "}
                      {rec.immediate_action || "Not specified."}
                    </p>

                    <div className="divider" />

                    <div className="grid grid-cols-2">
                      <div className="stat">
                        <span className="stat-label">Organic treatment</span>
                        <ul className="list-muted">
                          {(rec.treatment?.organic || []).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Chemical treatment</span>
                        <ul className="list-muted">
                          {(rec.treatment?.chemical || []).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="divider" />

                    <div className="page-section-title">Prevention</div>
                    <ul className="list-muted">
                      {(rec.prevention || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    <div className="divider" />

                    <div className="grid grid-cols-2">
                      <div className="stat">
                        <span className="stat-label">Fertilizer advice</span>
                        <p className="tagline">
                          {rec.fertilizer_advice?.recommendation}
                        </p>
                        <ul className="list-muted">
                          {(rec.fertilizer_advice?.additional || []).map(
                            (item) => (
                              <li key={item}>{item}</li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Irrigation advice</span>
                        <p className="tagline">
                          {rec.irrigation_advice?.frequency} ·{" "}
                          {rec.irrigation_advice?.method}
                        </p>
                        <ul className="list-muted">
                          {(rec.irrigation_advice?.notes || []).map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    Once a disease is detected, backend supplies detailed
                    recommendations which will be rendered here.
                  </div>
                )}
              </div>
            </article>
          </div>
        </section>
      </section>
    </>
  );
}

