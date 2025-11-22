import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import L from "leaflet";
import { useEffect, useState } from "react";

// Heatmap Layer
function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 17,
      minOpacity: 0.3,
      gradient: {
        0.2: "green",
        0.4: "yellow",
        0.6: "orange",
        0.8: "red",
        1.0: "#7f0000",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

// Click Inspector
function ClickInspector() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const onClick = async (e) => {
      const { lat, lng } = e.latlng;

      // Only allow clicks inside India bounding box
      if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
        // Fake "disaster proneness" score based on lat/lng
        const riskScore = ((lat * lng) % 100).toFixed(2);

        L.popup()
          .setLatLng(e.latlng)
          .setContent(
            `<div style="color:white;">
              <b>📍 Location Info</b><br/>
              Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}<br/>
              <b>Disaster Proneness:</b> ${riskScore}%
            </div>`
          )
          .openOn(map);
      } else {
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`<div style="color:white;">Outside India boundaries 🚫</div>`)
          .openOn(map);
      }
    };

    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [map]);

  return null;
}

export default function MapView() {
  const [heatmapPoints, setHeatmapPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState("ALL");
  const [lastUpdate, setLastUpdate] = useState(null);
  const [apiStatus, setApiStatus] = useState({});
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // ----------------- NASA FIRMS -----------------
  const fetchNASAFIRMS = async () => {
    try {
      console.log("Fetching NASA FIRMS active fires (via proxy)...");
      setApiStatus((prev) => ({ ...prev, nasa: "Loading..." }));

      const response = await fetch(`${API_BASE}/fetchDisasterData`);

      if (!response.ok) {
        throw new Error(`NASA FIRMS API error: ${response.status}`);
      }

      const csvText = await response.text();
      return processNASAFIRMS(csvText);
    } catch (error) {
      console.error("NASA FIRMS Error:", error);
      setApiStatus((prev) => ({ ...prev, nasa: "API temporarily unavailable" }));
      return [];
    }
  };

  const processNASAFIRMS = (csvText) => {
    const points = [];
    const lines = csvText.split("\n");
    let fireCount = 0;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(",");
      if (columns.length >= 6) {
        const lat = parseFloat(columns[0]);
        const lng = parseFloat(columns[1]);
        const brightness = parseFloat(columns[2]);

        if (!isNaN(lat) && !isNaN(lng) && lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
          const intensity = Math.min(1.0, brightness / 400);
          points.push([lat, lng, Math.max(0.3, intensity)]);
          fireCount++;
        }
      }
    }

    setApiStatus((prev) => ({ ...prev, nasa: `${fireCount} fires detected` }));
    return points;
  };

  // ----------------- USGS Earthquakes -----------------
  const fetchUSGSEarthquakes = async () => {
    try {
      console.log("Fetching USGS earthquake data (via proxy)...");
      setApiStatus((prev) => ({ ...prev, usgs: "Loading..." }));

      const response = await fetch(`${API_BASE}/fetchDisasterData`);

      if (!response.ok) {
        throw new Error(`USGS API error: ${response.status}`);
      }

      const data = await response.json();
      return processUSGSEarthquakes(data);
    } catch (error) {
      console.error("USGS Earthquake Error:", error);
      setApiStatus((prev) => ({ ...prev, usgs: "API Error" }));
      return [];
    }
  };

  const processUSGSEarthquakes = (data) => {
    const points = [];
    let earthquakeCount = 0;

    if (data.features) {
      data.features.forEach((earthquake) => {
        const coords = earthquake.geometry.coordinates;
        const props = earthquake.properties;

        const lng = coords[0];
        const lat = coords[1];
        const magnitude = props.mag;

        const intensity = Math.min(1.0, magnitude / 7);
        points.push([lat, lng, Math.max(0.4, intensity)]);
        earthquakeCount++;
      });
    }

    setApiStatus((prev) => ({ ...prev, usgs: `${earthquakeCount} earthquakes` }));
    return points;
  };

  // ----------------- GDACS Alerts -----------------
  const fetchGDACS = async () => {
    try {
      console.log("Fetching GDACS UN disaster alerts (via proxy)...");
      setApiStatus((prev) => ({ ...prev, gdacs: "Loading..." }));

      const response = await fetch(`${API_BASE}/fetchDisasterData`);

      if (!response.ok) {
        throw new Error(`GDACS API error: ${response.status}`);
      }

      const xmlText = await response.text();
      return processGDACS(xmlText);
    } catch (error) {
      console.error("GDACS Error:", error);
      setApiStatus((prev) => ({ ...prev, gdacs: "API Error" }));
      return [];
    }
  };

  const processGDACS = (xmlText) => {
    const points = [];
    let alertCount = 0;

    try {
      const regex = /<georss:point>([\d.-]+)\s+([\d.-]+)<\/georss:point>/g;
      let match;

      while ((match = regex.exec(xmlText)) !== null) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);

        if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
          points.push([lat, lng, 0.8]);
          alertCount++;
        }
      }
    } catch (error) {
      console.error("GDACS parsing error:", error);
    }

    setApiStatus((prev) => ({ ...prev, gdacs: `${alertCount} UN alerts` }));
    return points;
  };

  // ----------------- Fetch Data Controller -----------------
  const fetchDisasterData = async () => {
    setLoading(true);
    let allPoints = [];

    try {
      switch (selectedDataSource) {
        case "NASA":
          allPoints = await fetchNASAFIRMS();
          break;
        case "USGS":
          allPoints = await fetchUSGSEarthquakes();
          break;
        case "GDACS":
          allPoints = await fetchGDACS();
          break;
        case "ALL":
          const [nasa, usgs, gdacs] = await Promise.all([
            fetchNASAFIRMS(),
            fetchUSGSEarthquakes(),
            fetchGDACS(),
          ]);
          allPoints = [...nasa, ...usgs, ...gdacs];
          break;
        default:
          allPoints = [];
      }

      setHeatmapPoints(allPoints);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching disaster data:", error);
      setHeatmapPoints([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount + data source change
  useEffect(() => {
    fetchDisasterData();
  }, [selectedDataSource]);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(fetchDisasterData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedDataSource]);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[22.9734, 78.6569]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
          className="dark-satellite"
        />

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png"
          attribution="&copy; CARTO"
          opacity={0.6}
        />

        <HeatmapLayer points={heatmapPoints} />
        <ClickInspector />
      </MapContainer>

      {/* Data Source Selector */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-zinc-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-sm font-semibold mb-2">Real-Time Data Sources</div>
        <select
          value={selectedDataSource}
          onChange={(e) => setSelectedDataSource(e.target.value)}
          className="bg-zinc-700 text-white text-xs px-2 py-1 rounded w-full"
        >
          <option value="NASA">🔥 Active Fires</option>
          <option value="USGS">🌍 Earthquakes</option>
          <option value="GDACS">🚨Disasters</option>
          <option value="ALL">🌐 All Real-Time Sources</option>
        </select>

        <div className="mt-2 text-xs text-gray-300">
          <div>Active Points: {heatmapPoints.length}</div>
          <div>{loading ? "Loading real-time data..." : "Live Data Active"}</div>
          {lastUpdate && <div>Last Update: {lastUpdate.toLocaleTimeString()}</div>}
        </div>

        <button
          onClick={fetchDisasterData}
          disabled={loading}
          className="text-xs bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-2 py-1 rounded mt-2 w-full"
        >
          {loading ? "Fetching..." : "Refresh Real-Time Data"}
        </button>
      </div>

      {/* API Status */}
      <div className="absolute top-4 right-4 z-[1000] bg-zinc-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-sm font-semibold">Live API Status</div>
        <div className="text-xs text-gray-300 mt-1 space-y-1">
          <div>FIRES: {apiStatus.nasa || "Ready"}</div>
          <div>EARTHQUAKES: {apiStatus.usgs || "Ready"}</div>
          <div>ALERTS: {apiStatus.gdacs || "Ready"}</div>
        </div>
        <div className="text-xs mt-2">Source: {selectedDataSource}</div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-zinc-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-3 text-white">
        <div className="text-sm font-semibold mb-2">Real-Time Intensity</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#7f0000" }}></div>
            <span>Critical Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span>High Intensity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-600"></div>
            <span>Medium Intensity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
            <span>Low Intensity</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span>Minimal Activity</span>
          </div>
        </div>
      </div>

      {/* Dark overlay filter */}
      <div
        className="absolute inset-0 pointer-events-none z-[400]"
        style={{
          background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3))",
          mixBlendMode: "multiply",
        }}
      />

      {/* Custom styles */}
      <style>{`
        .dark-satellite {
          filter: brightness(0.6) contrast(1.2) saturate(0.8);
        }

        .leaflet-container {
          background: #0f1419 !important;
        }

        .leaflet-control-attribution {
          display: none !important;
        }

        .leaflet-control-zoom a {
          background-color: rgba(31, 41, 55, 0.9) !important;
          color: white !important;
          border: 1px solid #4b5563 !important;
          backdrop-filter: blur(8px);
        }

        .leaflet-control-zoom a:hover {
          background-color: rgba(55, 65, 81, 0.9) !important;
        }

        .leaflet-popup-content-wrapper {
          background-color: rgba(17, 24, 39, 0.95) !important;
          color: white !important;
          border-radius: 8px !important;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(75, 85, 99, 0.5);
        }

        .leaflet-popup-tip {
          background-color: rgba(17, 24, 39, 0.95) !important;
        }
      `}</style>
    </div>
  );
}
