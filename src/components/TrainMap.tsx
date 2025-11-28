import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { DataPoint } from "../data";
import "./TrainMap.css";

type Props = {
    latest: DataPoint | null;
    power: number;
};

const trainIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/809/809957.png",
    iconSize: [38, 38],
    iconAnchor: [19, 19]
});

export default function TrainMap({ latest, power }: Props) {
    if (!latest) return <div className="map-placeholder">Nessun dato GPS</div>;

    const lat = (latest as any).latitude ?? 41.12;
    const lon = (latest as any).longitude ?? 16.85;

    return (
        <div className="map-card">
            <h3>Posizione del treno</h3>
            <MapContainer
                center={[lat, lon]}
                zoom={12}
                scrollWheelZoom={false}
                style={{ width: "100%", height: "100%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap"
                />
                <Marker position={[lat, lon]} icon={trainIcon}>
                    <Popup>
                        <b>🚆 ETR500</b><br />
                        Velocità: {latest.speed.toFixed(1)} km/h <br />
                        Potenza: {power.toFixed(0)} kW <br />
                        Lat: {lat.toFixed(5)}, Lon: {lon.toFixed(5)}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
