import { useEffect, useState, useMemo } from "react";
import { api } from "./api";
import {
  METRICS,
  type MetricKey,
  type DataPoint,
  type MetricsMeta,
} from "./data";
import MultiMetricLine from "./components/MultiMetricLine";
import TrainMap from "./components/TrainMap";

export default function App() {
  const [metric, setMetric] = useState<MetricKey>("speed");
  const [serverData, setServerData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stop = false;

    async function load() {
      try {
        setLoading(true);
        const rows = await api.list();
        if (!stop) {
          setServerData(rows);
          setError(null);
        }
      } catch (e: any) {
        if (!stop) setError(e.message || "Errore di rete");
      } finally {
        if (!stop) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, 5000);
    return () => {
      stop = true;
      clearInterval(id);
    };
  }, []);

  const latest = serverData.at(-1) ?? null;
  const m = METRICS[metric];

  return (
    <div className="container">
      <div className="header">
        <div>
          <div className="h-title">Dashboard Treno</div>
          <div className="small">Monitoraggio in tempo reale</div>
        </div>

        <select
          className="select"
          value={metric}
          onChange={(e) => setMetric(e.target.value as MetricKey)}
        >
          {(Object.entries(METRICS) as [MetricKey, MetricsMeta][]).map(
            ([k, v]) => (
              <option key={k} value={k}>
                {v.label} ({v.unit})
              </option>
            )
          )}
        </select>
      </div>

      {loading && <div className="small">⏳ Caricamento…</div>}
      {error && <div className="small" style={{ color: "#f87171" }}>⚠️ {error}</div>}

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="card" style={{ minHeight: 380 }}>
          <h3>Andamento {m.label}</h3>
          <MultiMetricLine data={serverData} metric={metric} />
        </div>

        <div className="card" style={{ minHeight: 380 }}>
          <h3>Posizione Attuale</h3>
          {latest ? (
            <TrainMap latest={latest} power={latest.power} />
          ) : (
            <div>Nessun dato ancora disponibile</div>
          )}
        </div>
      </div>
    </div>
  );
}
