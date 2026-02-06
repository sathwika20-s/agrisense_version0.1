import { useState } from "react";
import { predictClimate, getClimateZones } from "../services/api.js";

export default function ClimateInsights() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [zones, setZones] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      setError("Please enter valid numeric latitude and longitude.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        latitude: lat,
        longitude: lon,
        area: area || undefined,
      };
      const data = await predictClimate(payload);
      setResult(data);
    } catch (err) {
      setError(err.message || "Failed to fetch climate prediction.");
    } finally {
      setLoading(false);
    }
  }

  async function loadZones() {
    setError("");
    try {
      const data = await getClimateZones();
      setZones(data);
    } catch (err) {
      setError(err.message || "Failed to load climate zones.");
    }
  }

  const weather = result?.current_weather;
  const zone = result?.climate_zone;
  const season = result?.season;

  return (
    <>
      <header className="content-header">
        <div className="content-heading">
          <div className="content-title-row">
            <div className="badge">
              <span className="badge-dot-blue" />
              Live climate intelligence
            </div>
          </div>
          <h1 className="content-title">Climate</h1>
          <p className="content-subtitle">
            Query your backend&apos;s climate model with coordinates to see
            current weather, derived climate zone, and season‑specific crop
            hints.
          </p>
        </div>
        <div className="content-header-right">
          <div className="page-toolbar">
            <span className="pill-soft">POST /api/climate/predict</span>
            <span className="pill-soft">GET /api/climate/zones</span>
          </div>
          <div className="dot-row">
            <span />
            <span className="mono">
              Latitude / longitude are required · area label is optional.
            </span>
          </div>
        </div>
      </header>

      {error && <div className="error-text">{error}</div>}

      <section className="page-main">
        <section>
          <div className="page-section-title">Location input</div>
          <div className="page-section-description">
            Use decimal degrees for latitude and longitude.
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
                    Latitude <span>*</span>
                  </label>
                  <input
                    className="input"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="e.g. 12.9716"
                  />
                </div>
                <div className="form-row">
                  <label className="label">
                    Longitude <span>*</span>
                  </label>
                  <input
                    className="input"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="e.g. 77.5946"
                  />
                </div>
                <div className="form-row">
                  <label className="label">Area label</label>
                  <input
                    className="input"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Farm name or village (optional)"
                  />
                </div>
                <div className="form-row">
                  <label className="label">Quick tips</label>
                  <div className="pill-stack">
                    <span>Use GPS from phone</span>
                    <span>Reuse coordinates for crops</span>
                    <span>Check after big weather events</span>
                  </div>
                </div>
              </div>

              <div className="flex-between" style={{ marginTop: "0.9rem" }}>
                <button className="btn" type="submit" disabled={loading}>
                  {loading ? "Querying climate…" : "Predict climate"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={loadZones}
                >
                  View climate zones reference
                </button>
              </div>
            </div>
          </form>

          {result && (
            <div className="card" style={{ marginTop: "0.9rem" }}>
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Current weather</div>
                    <div className="card-subtitle">
                      Direct response from your backend weather integration.
                    </div>
                  </div>
                  <span className="pill-top-right">
                    {result.location?.area || "Unnamed area"}
                  </span>
                </div>

                {weather ? (
                  <>
                    <div className="card-grid">
                      <div className="stat">
                        <span className="stat-label">Temperature</span>
                        <span className="stat-value">
                          {weather.temperature} °C
                        </span>
                        <span className="stat-pill stat-label">
                          Feels like {weather.feels_like} °C
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Humidity</span>
                        <span className="stat-value">
                          {weather.humidity} %
                        </span>
                        <span className="stat-pill stat-label">
                          Pressure {weather.pressure} hPa
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Conditions</span>
                        <span className="stat-value">
                          {weather.description}
                        </span>
                        <span className="stat-pill stat-label">
                          Wind {weather.wind_speed} m/s
                        </span>
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="metrics-row">
                      <span className="metrics-chip">
                        <span className="badge-dot-green" /> Latitude:{" "}
                        {result.location?.coordinates?.latitude}
                      </span>
                      <span className="metrics-chip">
                        <span className="badge-dot-blue" /> Longitude:{" "}
                        {result.location?.coordinates?.longitude}
                      </span>
                      <span className="metrics-chip">
                        Backend time:{" "}
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    No weather payload was returned by the backend.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section>
          <div className="page-section-title">Derived context</div>
          <div className="page-section-description">
            Climate zone, season and suitability for farming.
          </div>

          <div className="grid page-main-single" style={{ marginTop: "0.7rem" }}>
            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Climate zone</div>
                    <div className="card-subtitle">
                      Classified by your backend using temperature, humidity and
                      conditions.
                    </div>
                  </div>
                  <span className="badge-soft">
                    {zone?.name ? zone.name : "Unknown zone"}
                  </span>
                </div>

                {zone ? (
                  <>
                    <div className="pill-row">
                      <span className="pill">
                        Type:{" "}
                        <strong style={{ color: "#e5e7eb" }}>
                          {zone.type || "—"}
                        </strong>
                      </span>
                      <span className="pill">
                        Farming suitability:{" "}
                        <strong
                          style={{
                            color: zone.suitable_for_farming
                              ? "#bbf7d0"
                              : "#fed7aa",
                          }}
                        >
                          {zone.suitable_for_farming ? "Good" : "Limited"}
                        </strong>
                      </span>
                    </div>
                    <ul className="list-muted">
                      {(zone.characteristics || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <div className="empty-state">
                    Run a climate prediction to see zone details here.
                  </div>
                )}
              </div>
            </article>

            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Season window</div>
                    <div className="card-subtitle">
                      India‑specific season classification from your backend.
                    </div>
                  </div>
                  <span className="badge-soft-alt">
                    {season?.name || "Unknown"}
                  </span>
                </div>

                {season ? (
                  <>
                    <p className="tagline">
                      <strong>{season.farming_season}</strong> · typical crops
                      suggested by the backend:
                    </p>
                    <div className="pill-row" style={{ marginTop: "0.45rem" }}>
                      {(season.crops || []).map((crop) => (
                        <span key={crop} className="chip">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    Backend returns the current Indian season based on month and
                    suggests matching crops.
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

