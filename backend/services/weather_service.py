from utils.cwa_client import fetch_weather_data, parse_weather_data, fetch_weather_range_data, parse_station_trend_data
from utils.station_filter import is_valid_station



# 一日期取得雨量資料
def get_weather_data_service(date: str):
    records = fetch_weather_data(date)
    parsed = parse_weather_data(records, date)

    # 過濾掉汰換站
    filtered = [item for item in parsed if is_valid_station(item.get("stationId"))]

    return {"date": date, "locations": filtered}

# 多日區間資料：取得某站點的每日雨量趨勢
def get_rainfall_trend_service(station: str, start: str, end: str):
    records = fetch_weather_range_data(start, end, station_name=station)
    trend = parse_station_trend_data(records, station, start, end)
    return {
        "station": station,
        "start": start,
        "end": end,
        "data": trend
    }