import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { fetchTrend } from "../api/weather";
import { locationCoords } from "../components/RainMap";

export default function TrendPage() {
    const [station, setStation] = useState("竹子湖"); // 預設測站
    const [startDate, setStartDate] = useState("2025-06-15");
    const [endDate, setEndDate] = useState("2025-07-13");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const stationList = Object.entries(locationCoords)
        .sort((a, b) => b[1].lat - a[1].lat)
        .map(([name]) => name);

    const getDateStr = (daysAgo: number) => {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split("T")[0]; // yyyy-mm-dd 格式
    };


    const handleFetch = async () => {
        setLoading(true);
        setError("");
        try {
            const json = await fetchTrend(station, startDate, endDate);
            setData(json.data || []);
        } catch (err) {
            setError("載入失敗，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    const handleFetchWithDates = async (start: string, end: string) => {
        setLoading(true);
        setError("");
        try {
            const json = await fetchTrend(station, start, end);
            setData(json.data || []);
        } catch (err) {
            setError("載入失敗，請稍後再試");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">雨量趨勢圖</h1>

            <div className="flex flex-wrap gap-4 items-center">
                {/* 測站選單（已排序） */}
                <div>
                    <label className="block text-sm font-medium">測站名稱</label>
                    <select
                        value={station}
                        onChange={(e) => setStation(e.target.value)}
                        className="border p-1 rounded dark:bg-gray-900"
                    >
                        {stationList.map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 日期選擇 */}
                <div>
                    <label className="block text-sm font-medium">起始日期</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-1 rounded" />
                </div>

                <div>
                    <label className="block text-sm font-medium">結束日期</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-1 rounded" />
                </div>

                <button onClick={handleFetch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    查詢
                </button>

                {/* 快速按鈕 */}
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const start = getDateStr(7);
                            const end = getDateStr(0);
                            setStartDate(start);
                            setEndDate(end);
                            handleFetchWithDates(start, end);
                        }}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded border border-gray-300 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600"

                    >
                        近一週
                    </button>

                    <button
                        onClick={() => {
                            const start = getDateStr(30);
                            const end = getDateStr(0);
                            setStartDate(start);
                            setEndDate(end);
                            handleFetchWithDates(start, end);
                        }}
                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded border border-gray-300 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600"

                    >
                        近一個月
                    </button>
                </div>

            </div>

            {loading && <p>載入中...</p>}
            {error && <p className="text-red-600">{error}</p>}

            {data.length > 0 && (
                <div className="mt-6">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#4b5563" />
                            <YAxis stroke="#4b5563" unit=" mm" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#ffffff", borderColor: "#d1d5db" }}
                                labelStyle={{ color: "#374151" }}
                                labelFormatter={(label) => `日期：${label}`}
                                formatter={(value) => [`${value} mm`, "雨量"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="rainfall"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 3, stroke: "#3b82f6", fill: "#ffffff", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
