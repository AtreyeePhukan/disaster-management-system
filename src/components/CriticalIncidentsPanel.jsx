import React, { useState, useEffect } from "react";
import { AlertTriangle, Flame, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  Cell,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const DUMMY_INCIDENTS = [
  { type: "fire", severity: "critical", location: "Mumbai" },
  { type: "earthquake", severity: "high", location: "Delhi" },
  { type: "flood", severity: "medium", location: "Assam" },
  { type: "fire", severity: "medium", location: "Chennai" },
  { type: "earthquake", severity: "low", location: "Punjab" }
];

export default function CriticalIncidentsPanel() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetchIncidentData();
    const interval = setInterval(fetchIncidentData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchIncidentData = async () => {
    try {
      const res = await fetch(`${API_BASE}/fetchDisasterData`);

      const data = await res.json();

      if (Array.isArray(data)) {
        setIncidents([...DUMMY_INCIDENTS, ...data]);
      } else if (data.incidents) {
        setIncidents([...DUMMY_INCIDENTS, ...data.incidents]);
      } else {
        setIncidents([...DUMMY_INCIDENTS]);
      }

      setLoading(false);
    } catch (error) {
      setIncidents([...DUMMY_INCIDENTS]);
      setLoading(false);
    }
  };

  const severityStats = [
  {
    name: "Critical",
    value: incidents.filter((i) => i.severity === "critical").length || 0,
    color: "#ef4444",
  },
  {
    name: "High",
    value: incidents.filter((i) => i.severity === "high").length || 0,
    color: "#f97316",
  },
  {
    name: "Medium",
    value: incidents.filter((i) => i.severity === "medium").length || 0,
    color: "#eab308",
  },
  {
    name: "Low",
    value: incidents.filter((i) => i.severity === "low").length || 0,
    color: "#22c55e",
  },
];


  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSeverityIcon = (type) => {
    switch (type) {
      case "fire":
        return <Flame className="w-4 h-4" />;
      case "earthquake":
        return <Activity className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full h-full bg-black text-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300">Fires</span>
                </div>
                <div className="text-2xl text-white font-bold mt-1">
                  {incidents.filter((i) => i.type === "fire").length}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-gray-300">Earthquakes</span>
                </div>
                <div className="text-2xl text-white font-bold mt-1">
                  {incidents.filter((i) => i.type === "earthquake").length}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white font-semibold">
                Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {severityStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      ></div>
                      <span className="text-xs text-gray-300">{stat.name}</span>
                    </div>
                    <span className="text-sm text-white font-semibold">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 h-40">
                <ResponsiveContainer width="100%" height="100%">
  <BarChart
    data={severityStats}
    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
    barCategoryGap="30%"
  >
    <defs>
      <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff4d4d" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#991b1b" stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff7a18" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#7c2d12" stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id="mediumGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#facc15" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#854d0e" stopOpacity={0.9} />
      </linearGradient>
      <linearGradient id="lowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4ade80" stopOpacity={0.9} />
        <stop offset="100%" stopColor="#166534" stopOpacity={0.9} />
      </linearGradient>
    </defs>

    <CartesianGrid
      stroke="#1f2937"
      strokeDasharray="4 4"
      vertical={false}
    />

    <XAxis
      dataKey="name"
      tick={{ fontSize: 11, fill: "#d1d5db" }}
      axisLine={false}
      tickLine={false}
    />

    <YAxis
      tick={{ fontSize: 10, fill: "#6b7280" }}
      axisLine={false}
      tickLine={false}
      width={28}
    />

    <Bar
      dataKey="value"
      radius={[8, 8, 0, 0]}
      animationDuration={500}
    >
      {severityStats.map((entry, index) => (
        <Cell
          key={`cell-${index}`}
          fill={
            entry.name === "Critical"
              ? "url(#criticalGrad)"
              : entry.name === "High"
              ? "url(#highGrad)"
              : entry.name === "Medium"
              ? "url(#mediumGrad)"
              : "url(#lowGrad)"
          }
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>

              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-white font-semibold">
                Recent Incidents ({incidents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {loading ? (
                  <div className="text-xs text-gray-400 text-center py-4">
                    Loading incidents...
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-4">
                    No critical incidents
                  </div>
                ) : (
                  incidents.map((incident, index) => (
                    <div
                      key={index}
                      className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-start space-x-2">
                        <div
                          className={`w-8 h-8 rounded-full ${getSeverityColor(
                            incident.severity
                          )} flex items-center justify-center`}
                        >
                          {getSeverityIcon(incident.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold capitalize">
                              {incident.type}
                            </span>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                incident.severity === "critical"
                                  ? "border-red-500 text-red-400"
                                  : incident.severity === "high"
                                  ? "border-orange-500 text-orange-400"
                                  : "border-yellow-500 text-yellow-400"
                              }`}
                            >
                              {incident.severity}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            {incident.location}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
