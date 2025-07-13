from utils.cwa_client import fetch_weather_data, parse_weather_data

# 一日期取得雨量資料
def get_weather_data_service(date: str):
    records = fetch_weather_data(date)
    parsed = parse_weather_data(records, date)
    return {"date": date, "locations": parsed}


