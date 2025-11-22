import Header from "../components/Header";
import MapView from "../components/MapView";
import CriticalIncidentsPanel from "../components/CriticalIncidentsPanel";

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      <main className="flex-1 p-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-64px)]">
          {/* Map - 80% */}
          <section className="lg:col-span-4 bg-[#1a1a1a] rounded-xl shadow-md overflow-hidden">
            <MapView />
          </section>

          {/* Sidebar - 20% */}
          <section className="lg:col-span-1 bg-[#1f1f1f] rounded-xl shadow-md flex flex-col overflow-hidden">
            {/* Critical Incident Panel directly fills remaining space */}
            <CriticalIncidentsPanel />
          </section>
        </div>
      </main>
    </div>
  );
}
