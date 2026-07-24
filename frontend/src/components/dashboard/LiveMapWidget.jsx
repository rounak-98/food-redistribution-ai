import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon asset URLs safely
try {
  if (L && L.Icon && L.Icon.Default && L.Icon.Default.prototype) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }
} catch (e) {
  console.warn("Leaflet icon patch warning:", e);
}

// City Geocoding lookup helper for accurate location plotting
const CITY_COORDINATES = {
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
  newdelhi: [28.6139, 77.2090],
  hyderabad: [17.3850, 78.4867],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
};

export const getCityCoordinates = (cityName, fallbackLat = 12.9716, fallbackLng = 77.5946) => {
  if (!cityName) return [fallbackLat, fallbackLng];
  const cleaned = cityName.toLowerCase().replace(/[^a-z]/g, "");
  if (CITY_COORDINATES[cleaned]) {
    return CITY_COORDINATES[cleaned];
  }
  return [fallbackLat, fallbackLng];
};

// Custom colored map marker icons
const createCustomIcon = (emoji, bgColor) => {
  return L.divIcon({
    className: "custom-map-pin",
    html: `
      <div style="
        background-color: ${bgColor};
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        ${emoji}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
};

const donorIcon = createCustomIcon("🏢", "#2563eb");
const ngoIcon = createCustomIcon("🤝", "#059669");
const riderIcon = createCustomIcon("🛵", "#d97706");
const individualIcon = createCustomIcon("👤", "#7c3aed");

// Component to dynamically re-center map when locations change
function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1] && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function LiveMapWidget({
  locations = [],
  route = null,
  center = [12.9716, 77.5946],
  zoom = 13,
  title = "Live Platform GIS Logistics Map",
  height = "400px",
  showFilters = true,
}) {
  const [filter, setFilter] = useState("all");

  // Default accurate nodes if locations prop is empty
  const defaultLocations = [
    {
      id: "biz-1",
      name: "Royal Palace Hotel & Bakery",
      type: "business",
      lat: 12.9716,
      lng: 77.5946,
      address: "12 MG Road, Indiranagar, Bengaluru",
      phone: "+91 98765 43210",
      details: "🍱 50 Portions Biryani Available",
    },
    {
      id: "ngo-1",
      name: "Asha Care NGO Center",
      type: "ngo",
      lat: 12.9800,
      lng: 77.6050,
      address: "45 Brigade Road, Bengaluru",
      phone: "+91 91234 56789",
      details: "🤝 Verified Recipient Shelter (Cap: 200 Meals)",
    },
    {
      id: "rider-1",
      name: "Vikram Singh (Rider)",
      type: "rider",
      lat: 12.9750,
      lng: 77.6000,
      address: "En Route to Pickup Location",
      phone: "+91 99887 76655",
      details: "🛵 Active Delivery #104 (In Transit)",
    },
    {
      id: "ind-1",
      name: "Sharma Household Donor",
      type: "individual",
      lat: 12.9352,
      lng: 77.6245,
      address: "7th Cross, Koramangala, Bengaluru",
      phone: "+91 98111 22334",
      details: "👤 Surplus Home Cooked Food (10 Servings)",
    },
  ];

  const mapData = locations && locations.length > 0 ? locations : defaultLocations;

  const filteredData = mapData.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  // Calculate accurate map center
  let mapCenter = center;
  if (filteredData.length > 0) {
    const firstLat = parseFloat(filteredData[0].lat);
    const firstLng = parseFloat(filteredData[0].lng);
    if (!isNaN(firstLat) && !isNaN(firstLng) && firstLat !== 0 && firstLng !== 0) {
      mapCenter = [firstLat, firstLng];
    }
  }

  const getMarkerIcon = (type) => {
    switch (type) {
      case "business":
        return donorIcon;
      case "ngo":
        return ngoIcon;
      case "rider":
      case "volunteer":
        return riderIcon;
      case "individual":
        return individualIcon;
      default:
        return donorIcon;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5 overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span>🗺️</span> {title}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time geospatial tracking of food donors, recipient NGOs, and logistics riders.
          </p>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition ${
                filter === "all" ? "bg-white text-gray-900 shadow font-bold" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              🌐 All Nodes ({mapData.length})
            </button>
            <button
              onClick={() => setFilter("business")}
              className={`px-3 py-1.5 rounded-xl transition ${
                filter === "business"
                  ? "bg-blue-600 text-white shadow font-bold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              🏢 Donors
            </button>
            <button
              onClick={() => setFilter("ngo")}
              className={`px-3 py-1.5 rounded-xl transition ${
                filter === "ngo"
                  ? "bg-emerald-600 text-white shadow font-bold"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              🤝 NGOs
            </button>
            <button
              onClick={() => setFilter("rider")}
              className={`px-3 py-1.5 rounded-xl transition ${
                filter === "rider"
                  ? "bg-amber-500 text-slate-900 shadow font-bold"
                  : "text-gray-600 hover:text-amber-600"
              }`}
            >
              🛵 Riders
            </button>
          </div>
        )}
      </div>

      {/* Leaflet Map Container */}
      <div style={{ height, width: "100%" }} className="rounded-2xl overflow-hidden shadow-inner border border-gray-200 z-10 relative">
        <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <MapRecenter center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Route Polyline if provided */}
          {route && route.length > 1 && (
            <Polyline positions={route} color="#2563eb" weight={5} opacity={0.7} dashArray="8, 8" />
          )}

          {/* Render Markers */}
          {filteredData.map((item) => {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lng);
            if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;

            return (
              <Marker key={item.id} position={[lat, lng]} icon={getMarkerIcon(item.type)}>
                <Popup>
                  <div className="p-1 max-w-xs font-sans">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-base">
                        {item.type === "business"
                          ? "🏢"
                          : item.type === "ngo"
                          ? "🤝"
                          : item.type === "rider"
                          ? "🛵"
                          : "👤"}
                      </span>
                      <h4 className="font-extrabold text-sm text-gray-900 m-0">{item.name}</h4>
                    </div>

                    <p className="text-xs text-gray-600 mb-1">{item.address}</p>

                    {item.phone && (
                      <p className="text-xs font-semibold text-indigo-600 mb-1">
                        📞 <a href={`tel:${item.phone}`}>{item.phone}</a>
                      </p>
                    )}

                    {item.details && (
                      <div className="bg-slate-100 p-2 rounded-lg text-[11px] font-medium text-gray-700 mt-2">
                        {item.details}
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-gray-500 px-1">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Donor
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Verified NGO
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Transport Rider
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Household
          </span>
        </div>
        <p className="text-[11px] text-gray-400">Powered by OpenStreetMap & GIS Logistics</p>
      </div>
    </div>
  );
}
