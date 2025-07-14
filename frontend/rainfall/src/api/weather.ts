import type { WeatherResponse } from "../types/weather";

const BASE_URL = "http://localhost:8000/api"; // 請依據實際後端調整

export async function fetchWeather(date: string): Promise<WeatherResponse> {
    const res = await fetch(`${BASE_URL}/data?date=${date}`);
    if (!res.ok) throw new Error("無法取得天氣資料");
    return await res.json();
}

export async function fetchTrend(station: string, start: string, end: string) {
    const res = await fetch(`${BASE_URL}/trend?station=${station}&start=${start}&end=${end}`);
    if (!res.ok) throw new Error("無法取得趨勢資料");
    return await res.json();
}