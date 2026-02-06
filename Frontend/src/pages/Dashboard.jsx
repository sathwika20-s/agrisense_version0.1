import { useEffect, useState } from "react";
import { getHealth, getClimateZones, getAllCrops, getAllDiseases } from "../services/api.js";

function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    health: null,
    zones: null,
    crops: null,
    diseases: null,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [health, zones, crops, diseases] = await Promise.allSettled([
          getHealth(),
          getClimateZones(),
          getAllCrops(),
          getAllDiseases(),
        ]);

        if (!active) return;

        setData({
          health: health.status === "fulfilled" ? health.value : null,
          zones: zones.status === "fulfilled" ? zones.value : null,
          crops: crops.status === "fulfilled" ? crops.value : null,
          diseases: diseases.status === "fulfilled" ? diseases.value : null,
        });

        const failures = [health, zones, crops, diseases].filter(
          (r) => r.status === "rejected"
        );
        if (failures.length) {
          setError(
            "Some sections failed to load. Backend might not be running for all routes."
          );
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || "Failed to load overview");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { loading, error, data };
}

export default function Dashboard() {
  const { loading, error, data } = useDashboardData();

  const totalCrops = data.crops?.total_crops ?? data.crops?.crops?.length;
  const totalDiseases =
    data.diseases?.total_diseases ?? data.diseases?.diseases?.length;
  const zonesCount = Array.isArray(data.zones?.zones)
    ? data.zones.zones.length
    : 0;

  return (
    <>
      <header className="content-header">
        <div className="content-heading">
          <div className="content-title-row">
            <div className="badge">
              <span className="badge-dot" />
              Smart agriculture cockpit
            </div>
          </div>
          <h1 className="content-title">Overview</h1>
          <p className="content-subtitle">
            High‑level view of your climate, crop knowledge base, disease
            library and AI assistant. Start here, then dive into each module.
          </p>
        </div>
        <div className="content-header-right">
          <div className="page-toolbar">
            <span className="pill-soft">Backend base URL · /api</span>
            <span className="pill-soft">
              Health status:{" "}
              {data.health?.status === "OK" ? (
                <span style={{ color: "#bbf7d0" }}>OK</span>
              ) : (
                <span style={{ color: "#fecaca" }}>Unknown</span>
              )}
            </span>
          </div>
          <div className="dot-row">
            <span />
            <span className="mono">
              {data.health?.time
                ? `Last ping · ${new Date(data.health.time).toLocaleString()}`
                : "Waiting for health check…"}
            </span>
          </div>
        </div>
      </header>

      {error && <div className="error-text">{error}</div>}

      <section className="page-main">
        <section>
          <div className="page-section-title">Knowledge base</div>
          <div className="page-section-description">
            Data that powers your recommendations and diagnostics.
          </div>
          <div className="grid grid-cols-3" style={{ marginTop: "0.7rem" }}>
            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Crop library</div>
                    <div className="card-subtitle">
                      Structured data for recommendations.
                    </div>
                  </div>
                  <span className="badge-soft">/crops</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Total crops</span>
                  <span className="stat-value">
                    {loading && totalCrops == null ? "…" : totalCrops ?? "—"}
                  </span>
                  <span className="stat-pill pill">
                    Climate‑aware scoring · 0‑100
                  </span>
                </div>
              </div>
            </article>

            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Disease library</div>
                    <div className="card-subtitle">
                      Used by image scanner & chatbot.
                    </div>
                  </div>
                  <span className="badge-soft-alt">/disease</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Disease profiles</span>
                  <span className="stat-value">
                    {loading && totalDiseases == null
                      ? "…"
                      : totalDiseases ?? "—"}
                  </span>
                  <span className="stat-pill pill">
                    With treatment & prevention tips
                  </span>
                </div>
              </div>
            </article>

            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Climate zones</div>
                    <div className="card-subtitle">
                      For understanding your location context.
                    </div>
                  </div>
                  <span className="badge-soft">/climate/zones</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Defined zones</span>
                  <span className="stat-value">
                    {loading && zonesCount === 0 ? "…" : zonesCount || "—"}
                  </span>
                  <span className="stat-pill pill">
                    Linked to seasonal crop windows
                  </span>
                </div>
              </div>
            </article>
          </div>

          <div className="divider" />

          <div className="grid grid-cols-2">
            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Recommended workflow</div>
                    <div className="card-subtitle">
                      Use all modules in one decision loop.
                    </div>
                  </div>
                </div>

                <ol className="list-muted">
                  <li>
                    <strong style={{ color: "#e5e7eb" }}>Check climate</strong>{" "}
                    · use your GPS or coordinates in the{" "}
                    <span className="mono">Climate</span> tab to understand
                    temperature, humidity and climate zone.
                  </li>
                  <li>
                    <strong style={{ color: "#e5e7eb" }}>
                      Get crop recommendations
                    </strong>{" "}
                    · feed climate values into{" "}
                    <span className="mono">Crop advisor</span> to see ranked
                    crops by suitability score.
                  </li>
                  <li>
                    <strong style={{ color: "#e5e7eb" }}>
                      Monitor plant health
                    </strong>{" "}
                    · upload leaf photos in{" "}
                    <span className="mono">Disease scanner</span> for quick risk
                    assessment.
                  </li>
                  <li>
                    <strong style={{ color: "#e5e7eb" }}>
                      Ask follow‑up questions
                    </strong>{" "}
                    · clarify anything in{" "}
                    <span className="mono">Smart chatbot</span>, which can use
                    context from all previous modules.
                  </li>
                </ol>
              </div>
            </article>

            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Backend snapshot</div>
                    <div className="card-subtitle">
                      Quick glance at runtime status.
                    </div>
                  </div>
                  <span className="badge-gradient">Express + MongoDB</span>
                </div>

                <div className="grid grid-cols-2" style={{ marginTop: "0.4rem" }}>
                  <div className="stat">
                    <span className="stat-label">Health</span>
                    <span className="stat-value">
                      {data.health?.status || "Unknown"}
                    </span>
                    <span className="stat-pill surface-soft">
                      <span>MONGO_URI</span> must be configured
                    </span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">APIs</span>
                    <span className="stat-value">4</span>
                    <span className="stat-pill pill-row">
                      <span className="chip">/climate</span>
                      <span className="chip">/crops</span>
                      <span className="chip">/disease</span>
                      <span className="chip">/chatbot</span>
                    </span>
                  </div>
                </div>

                <div className="divider" />

                <div className="mono">
                  <div>Base URL: http://localhost:5000/api</div>
                  <div>
                    Auth: <span className="text-muted">none (local only)</span>
                  </div>
                  <div>
                    Errors: surfaced inline in each module for faster debugging.
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section>
          <div className="page-section-title">Shortcuts</div>
          <div className="page-section-description">
            Jump straight into a specific task.
          </div>

          <div className="grid grid-cols-2" style={{ marginTop: "0.7rem" }}>
            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Today&apos;s weather</div>
                    <div className="card-subtitle">
                      Start a new climate run with your coordinates.
                    </div>
                  </div>
                  <span className="badge-soft-alt">/climate/predict</span>
                </div>
                <p className="tagline">
                  Use the <strong>Climate</strong> page to enter latitude,
                  longitude and optional label for your farm area. You&apos;ll
                  get current weather plus a derived climate zone.
                </p>
              </div>
            </article>

            <article className="card">
              <div className="card-inner">
                <div className="card-header">
                  <div>
                    <div className="card-title">Quick advice</div>
                    <div className="card-subtitle">
                      Ask the chatbot about any scenario.
                    </div>
                  </div>
                  <span className="badge-soft">/chatbot/query</span>
                </div>
                <p className="tagline">
                  Go to <strong>Smart chatbot</strong> for free‑form questions
                  on fertilizer, irrigation, pests, or to interpret other
                  module results in plain language.
                </p>
              </div>
            </article>
          </div>
        </section>
      </section>
    </>
  );
}

