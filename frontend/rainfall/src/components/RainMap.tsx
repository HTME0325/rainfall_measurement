import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { WeatherLocation } from '../types/weather';
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';


// 將 marker 預設圖示修正（避免地圖 marker 不見）
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// 經緯度對照表（只列出幾筆，可擴充）
export const locationCoords: Record<string, { lat: number; lng: number }> = {
    "新北": { "lat": 25.016982, "lng": 121.462786 },
    "淡水": { "lat": 25.164889, "lng": 121.448906 },
    "鞍部": { "lat": 25.182586, "lng": 121.529731 },
    "臺北": { "lat": 25.033964, "lng": 121.562321 },
    "竹子湖": { "lat": 25.162078, "lng": 121.544547 },
    "基隆": { "lat": 25.128982, "lng": 121.741830 },
    "彭佳嶼": { "lat": 25.685556, "lng": 122.041389 },
    "花蓮": { "lat": 23.984557, "lng": 121.601509 },
    "新屋": { "lat": 24.918431, "lng": 121.028572 },
    "宜蘭": { "lat": 24.692139, "lng": 121.725711 },
    "金門": { "lat": 24.432480, "lng": 118.318771 },
    "田中": { "lat": 23.968160, "lng": 120.574332 },
    "後龍": { "lat": 24.550000, "lng": 120.803056 },
    "古坑": { "lat": 23.650000, "lng": 120.650000 },
    "東吉島": { "lat": 23.169722, "lng": 121.469167 },
    "澎湖": { "lat": 23.565910, "lng": 119.625609 },
    "臺南": { "lat": 22.999728, "lng": 120.227027 },
    "永康": { "lat": 23.016670, "lng": 120.226112 },
    "高雄": { "lat": 22.627278, "lng": 120.301435 },
    "嘉義": { "lat": 23.480000, "lng": 120.449722 },
    "臺中": { "lat": 24.147736, "lng": 120.673648 },
    "阿里山": { "lat": 23.510000, "lng": 120.800000 },
    "大武": { "lat": 22.383595, "lng": 120.899170 },
    "玉山": { "lat": 23.474320, "lng": 120.957750 },
    "新竹": { "lat": 24.813829, "lng": 120.967479 },
    "恆春": { "lat": 21.960278, "lng": 120.747222 },
    "成功": { "lat": 23.100000, "lng": 121.362778 },
    "蘭嶼": { "lat": 22.037778, "lng": 121.546389 },
    "日月潭": { "lat": 23.842820, "lng": 120.914170 },
    "臺東": { "lat": 22.760000, "lng": 121.150000 },
    "馬祖": { "lat": 26.157300, "lng": 119.953200 },
    "桃園": { "lat": 24.993628, "lng": 121.300979 },
    "彰化": { "lat": 24.075000, "lng": 120.540000 },
    "雲林": { "lat": 23.708000, "lng": 120.542000 },
    "屏東": { "lat": 22.675000, "lng": 120.482000 },
    "苗栗": { "lat": 24.563600, "lng": 120.820000 }
};

interface Props {
    locations: WeatherLocation[];
    selected?: string | null;
}

// 地圖自動飛過去 + 開啟 Popup
function MapFlyTo({
    selected,
    markerRefs,
}: {
    selected: string | null;
    markerRefs: RefObject<Record<string, L.Marker>>;
}) {
    const map = useMap();

    useEffect(() => {
        if (!selected) return;
        const coord = locationCoords[selected];
        if (coord) {
            map.flyTo([coord.lat, coord.lng], 10, { duration: 1.5 });

            const marker = markerRefs.current?.[selected];
            if (marker) {
                marker.openPopup();
            }
        }
    }, [selected, map, markerRefs]);

    return null;
}

export default function RainMap({ locations, selected }: Props) {
    const markerRefs = useRef<Record<string, L.Marker>>({});

    return (
        <div className="w-full h-[500px] rounded-lg overflow-hidden">
            <MapContainer
                center={[23.7, 121]}
                zoom={7}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />

                {/* 飛過去並開啟對應 Popup */}
                <MapFlyTo selected={selected ?? null} markerRefs={markerRefs} />

                {locations.map((loc) => {
                    const coord = locationCoords[loc.locationName];
                    if (!coord) return null;

                    let icon = "❓";
                    if (loc.Precipitation === 0) icon = "☀️";
                    else if (loc.Precipitation && loc.Precipitation > 0) icon = "☔";

                    return (
                        <Marker
                            key={loc.locationName}
                            position={[coord.lat, coord.lng]}
                            ref={(ref) => {
                                if (ref) {
                                    markerRefs.current[loc.locationName] = ref;
                                }
                            }}
                        >
                            <Popup>
                                <div className="text-sm">
                                    <strong>{loc.locationName}</strong><br />
                                    {icon} {loc.Precipitation ?? '無資料'} mm
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}