import { useState } from "react";
import { recommendCrops } from "../services/api.js";

export default function CropAdvisor() {
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [season, setSeason] = useState("");
  const [soilType, setSoilType] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const t = parseFloat(temperature);
    const h = parseFloat(humidity);
    const r = rainfall ? parseFloat(rainfall) : undefined;

    if (Number.isNaN(t) || Number.isNaN(h)) {
      setError("Temperature and humidity are required and must be numbers.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        temperature: t,
        humidity: h,
        rainfall: r,
        season: season || undefined,
        soil_type: soilType || undefined,
        area: area || undefined,
      };
      const data = await recommendCrops(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to get crop recommendations.");
    } finally {
      setLoading(false);
    }
  }

  const recommendations = result?.recommendations || [];

  return (
    <>
      <header className="content-header">
        <div className="content-heading">
          <div className="content-title-row">
            <div className="badge">
              <span className="badge-dot-green" />
              Climate‑aware crop selection
            </div>
          </div>
          <h1 className="content-title">Crop advisor</h1>
          <p className="content-subtitle">
            Send climate conditions to your backend crop engine and get ranked
            recommendations with suitability scores and key agronomy details.
          </p>
        </div>
        <div className="content-header-right">
          <div className="page-toolbar">
            <span className="pill-soft">POST /api/crops/recommend</span>
          </div>
          <div className="dot-row">
            <span />
            <span className="mono">
              Temperature &amp; humidity are mandatory · rainfall, season and
              soil type are optional filters.
            </span>
          </div>
        </div>
      </header>

      {error && <div className="error-text">{error}</div>}

      <section className="page-main-full">
        <section>
          <div className="page-section-title">Conditions</div>
          <div className="page-section-description">
            Paste values from the climate module or manual measurements.
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
                    Temperature (°C) <span>*</span>
                  </label>
                  <input
                    className="input"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 28"
                  />
                </div>
                <div className="form-row">
                  <label className="label">
                    Humidity (%) <span>*</span>
                  </label>
                  <input
                    className="input"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    placeholder="e.g. 70"
                  />
                </div>
                <div className="form-row">
                  <label className="label">Rainfall (mm)</label>
                  <input
                    className="input"
                    value={rainfall}
                    onChange={(e) => setRainfall(e.target.value)}
                    placeholder="e.g. 120 (optional)"
                  />
                </div>
                <div className="form-row">
                  <label className="label">Season</label>
                  <select
                    className="select"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                  >
                    <option value="">Auto / any</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Rabi">Rabi</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>
                <div className="form-row">
                  <label className="label">Soil type</label>
                  <input
                    className="input"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    placeholder="e.g. loamy, clay, sandy"
                  />
                </div>
                <div className="form-row">
                  <label className="label">Area label</label>
                  <input
                    className="input"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Farm name or district"
                  />
                </div>
              </div>

              <div className="flex-between" style={{ marginTop: "0.9rem" }}>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Calculating…" : "Recommend crops"}
                </button>
                <div className="pill-stack">
                  <span>Use climate output as input</span>
                  <span>Fine‑tune with soil &amp; season</span>
                </div>
              </div>
            </div>
          </form>
        </section>

        <section>
          <div className="page-section-title">Recommendations</div>
          <div className="page-section-description">
            Top crops ranked by suitability score (0‑100).
          </div>

          <div className="card" style={{ marginTop: "0.7rem" }}>
            <div className="card-inner">
              {result ? (
                <>
                  <div className="flex-between">
                    <div>
                      <div className="card-title">
                        {result.total_suitable_crops} suitable crops found
                      </div>
                      <div className="card-subtitle">
                        Showing up to 5 best matches from the backend.
                      </div>
                    </div>
                    <div className="pill-row">
                      <span className="pill-soft">
                        Location:{" "}
                        <strong style={{ color: "#e5e7eb" }}>
                          {result.location || "Not specified"}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="divider" />

                  {recommendations.length ? (
                    <div className="grid page-main-single">
                      {recommendations.map((crop) => (
                        <article key={crop.name} className="card">
                          <div className="card-inner">
                            <div className="card-header">
                              <div>
                                <div className="card-title">{crop.name}</div>
                                <div className="card-subtitle">
                                  Season: {crop.season} · Soil:{" "}
                                  {(crop.soil || []).join(", ") || "—"}
                                </div>
                              </div>
                              <div className="flex-col gap-sm">
                                <span className="badge-soft">
                                  Score {crop.suitability_score}/100
                                </span>
                                <span className="badge-mini mono">
                                  Opt temp {crop.climate_requirements?.temperature?.optimal}
                                  °C
                                </span>
                              </div>
                            </div>

                            <p className="tagline">
                              {crop.description ||
                                "Crop description not provided in database."}
                            </p>

                            <div className="divider" />

                            <div className="grid grid-cols-2">
                              <div className="stat">
                                <span className="stat-label">Climate band</span>
                                <span className="stat-value">
                                  {crop.climate_zone || "—"}
                                </span>
                                <span className="stat-pill stat-label">
                                  Humidity {crop.climate_requirements?.humidity?.min}
                                  –{crop.climate_requirements?.humidity?.max}%
                                </span>
                              </div>
                              <div className="stat">
                                <span className="stat-label">Highlights</span>
                                <ul className="list-muted">
                                  {(crop.key_points || []).slice(0, 3).map((p) => (
                                    <li key={p}>{p}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      {result.message || "No suitable crops found for inputs."}
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  Submit climate conditions to see ranked crop recommendations
                  here.
                </div>
              )}
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

