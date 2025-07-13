import requests
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()
CWA_BASE_URL = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/C-B0025-001"
API_KEY = os.getenv("CWA_API_KEY")


# 抓取氣象局資料
def fetch_weather_data(date: str):
    try:
        time_from = f"{date}T00:00:00"
        time_to = f"{date}T23:59:59"
        url = f"{CWA_BASE_URL}?Authorization={API_KEY}&timeFrom={time_from}&timeTo={time_to}"

        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()

        if not data.get("records") or "location" not in data["records"]:
            raise HTTPException(status_code=404, detail="No records found")

        return data["records"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 整理資料格式
def parse_weather_data(records: dict, target_date: str):
    result = []
    for loc in records.get("location", []):
        station = loc.get("station")
        obs_times = loc.get("stationObsTimes", {}).get("stationObsTime", [])

        if not station or not obs_times:
            continue

        matched_obs = next((obs for obs in obs_times if obs.get("Date") == target_date), None)
        if not matched_obs:
            continue

        location_name = station.get("StationName", "Unknown")
        date = matched_obs.get("Date")
        elements = matched_obs.get("weatherElements", {})

        item = {"locationName": location_name, "date": date}
        for key, val in elements.items():
            try:
                item[key] = float(val)
            except (ValueError, TypeError):
                item[key] = None

        result.append(item)

    return result
