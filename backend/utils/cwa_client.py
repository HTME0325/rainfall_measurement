import requests
from fastapi import HTTPException
import os
from dotenv import load_dotenv
from datetime import datetime
from utils.station_filter import is_valid_station  

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
        station_id = station.get("StationID", "")
        date = matched_obs.get("Date")
        elements = matched_obs.get("weatherElements", {})

        item = {
            "stationId": station_id,
            "locationName": location_name,
            "date": date,
        }

        for key, val in elements.items():
            try:
                item[key] = float(val)
            except (ValueError, TypeError):
                item[key] = None

        result.append(item)

    return result

# 抓取多日資料
def fetch_weather_range_data(start_date: str, end_date: str, station_name: str = None):
    try:
        time_from = f"{start_date}T00:00:00"
        time_to = f"{end_date}T23:59:59"
        url = f"{CWA_BASE_URL}?Authorization={API_KEY}&StationName={station_name}&timeFrom={time_from}&timeTo={time_to}"

        res = requests.get(url, timeout=10)
        res.raise_for_status()
        data = res.json()

        if not data.get("records") or "location" not in data["records"]:
            raise HTTPException(status_code=404, detail="No records found")

        return data["records"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# 解析資料
def parse_station_trend_data(records: dict, target_station: str, start: str = None, end: str = None):
    start_dt = datetime.strptime(start, "%Y-%m-%d") if start else None
    end_dt = datetime.strptime(end, "%Y-%m-%d") if end else None

    for loc in records.get("location", []):
        station = loc.get("station")
        if not station:
            continue

        station_name = station.get("StationName")
        station_id = station.get("StationID") or station.get("StationId")

        # ✅ 比對名稱 + 排除汰換觀測站
        if station_name != target_station or not is_valid_station(station_id):
            continue

        obs_times = loc.get("stationObsTimes", {}).get("stationObsTime", [])
        result = []
        for obs in obs_times:
            date_str = obs.get("Date")
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")

            if (start_dt and date_obj < start_dt) or (end_dt and date_obj > end_dt):
                continue  # 篩選掉不在範圍的

            elements = obs.get("weatherElements", {})
            try:
                rainfall = float(elements.get("Precipitation", 0))
            except (ValueError, TypeError):
                rainfall = None

            result.append({
                "date": date_str,
                "rainfall": rainfall
            })

        return sorted(result, key=lambda x: x["date"])

    raise HTTPException(status_code=404, detail=f"Station '{target_station}' not found or is excluded.")

