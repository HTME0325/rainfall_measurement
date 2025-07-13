import { useEffect, useMemo, useState } from "react";
import { fetchWeather } from "../api/weather";
import type { WeatherLocation } from "../types/weather";
import RainMap, { locationCoords } from "../components/RainMap";

export default function Home() {
    const [locations, setLocations] = useState<WeatherLocation[]>([]);
    const [top3, setTop3] = useState<WeatherLocation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState<'northToSouth' | 'southToNorth'>('northToSouth');
    const [precipSort, setPrecipSort] = useState<'desc' | 'asc' | null>(null);
    const [highlightedLocation, setHighlightedLocation] = useState<string | null>(null);

    const [date, setDate] = useState(() => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    });

    useEffect(() => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            setError("⚠️ 氣象局尚未提供未來日期的資料");
            setLocations([]);
            setTop3([]);
            return;
        }

        fetchWeather(date)
            .then((data) => {
                if (!data.locations || data.locations.length === 0) {
                    setError("⚠️ 此日期無資料，可能尚未發布");
                } else {
                    setError(null);
                }

                setLocations(data.locations);

                const sorted = data.locations
                    .filter((loc) => loc.Precipitation != null)
                    .sort((a, b) => (b.Precipitation! as number) - (a.Precipitation! as number))
                    .slice(0, 3);
                setTop3(sorted);
            })
            .catch((err) => {
                setError(err.message);
                setLocations([]);
                setTop3([]);
            });
    }, [date]);

    const filteredLocations = useMemo(() => {
        let result = locations.filter((loc) => loc.locationName.includes(search));

        if (precipSort) {
            result = result.sort((a, b) => {
                const valA = a.Precipitation ?? -1;
                const valB = b.Precipitation ?? -1;
                return precipSort === 'desc' ? valB - valA : valA - valB;
            });
        } else {
            result = result.sort((a, b) => {
                const aLat = locationCoords[a.locationName]?.lat ?? 0;
                const bLat = locationCoords[b.locationName]?.lat ?? 0;
                return sortOrder === 'northToSouth' ? bLat - aLat : aLat - bLat;
            });
        }

        return result;
    }, [locations, search, sortOrder, precipSort]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">全台降雨資料查詢</h1>

            <div className="mb-6">
                <label className="font-medium mr-2">選擇日期：</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className="border px-2 py-1 rounded"
                />
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {top3.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">雨量 Top 3 地區</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {top3.map((item, index) => {
                            const medal = ["🥇", "🥈", "🥉"][index];
                            return (
                                <div
                                    key={item.locationName}
                                    className="border rounded-xl p-4 shadow bg-gradient-to-br from-blue-100 to-blue-50 dark:from-slate-800 dark:to-slate-900"
                                >
                                    <h3 className="text-3xl font-semibold mb-1">
                                        {medal} {item.locationName}
                                    </h3>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
                                        {item.Precipitation} mm
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="mb-4 relative">
                <h2 className="text-xl font-semibold mb-2">所有地區資料</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <input
                        type="text"
                        placeholder="搜尋地區名稱..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-3 py-2 rounded w-full sm:max-w-xs"
                    />
                    {search && (
                        <ul className="absolute z-20 mt-1 bg-white dark:bg-gray-800 dark:border-gray-700 rounded shadow w-full sm:max-w-xs max-h-60 overflow-auto">
                            {locations
                                .filter((loc) => loc.locationName.includes(search) && loc.locationName !== search)
                                .slice(0, 5)
                                .map((loc) => (
                                    <li
                                        key={loc.locationName}
                                        className="px-3 py-2 hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer"
                                        onClick={() => {
                                            setSearch(loc.locationName);
                                            setHighlightedLocation(loc.locationName);
                                        }}
                                    >
                                        {loc.locationName}
                                    </li>
                                ))}
                        </ul>
                    )}
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                        className="border px-3 py-2 rounded w-full sm:w-auto dark:bg-gray-900"
                    >
                        <option value="northToSouth">由北到南</option>
                        <option value="southToNorth">由南到北</option>
                    </select>
                    <select
                        value={precipSort ?? ''}
                        onChange={(e) =>
                            setPrecipSort(e.target.value === '' ? null : (e.target.value as 'asc' | 'desc'))
                        }
                        className="border px-3 py-2 rounded w-full sm:w-auto dark:bg-gray-900"
                    >
                        <option value="">預設排序</option>
                        <option value="desc">雨量由多到少</option>
                        <option value="asc">雨量由少到多</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                        {filteredLocations.map((loc) => (
                            <div
                                key={loc.locationName}
                                onClick={() => setHighlightedLocation(loc.locationName)}
                                className={`border rounded-lg p-4 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition ${highlightedLocation === loc.locationName ? 'ring-2 ring-blue-500' : ''}`}
                            >
                                <h3 className="font-semibold text-lg mb-1">{loc.locationName}</h3>
                                <p>
                                    {loc.Precipitation === null
                                        ? "❓"
                                        : loc.Precipitation === 0
                                            ? "☀️"
                                            : "☔"} 降雨量：{loc.Precipitation ?? "無資料"} mm
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-[400px] xl:w-[500px]">
                    <h2 className="text-xl font-semibold mb-2">地圖視覺化</h2>
                    <RainMap locations={locations} selected={highlightedLocation} />
                </div>
            </div>
        </div>
    );
}
