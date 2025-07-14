from fastapi import APIRouter, Query
from services.weather_service import get_weather_data_service
from services.weather_service import get_rainfall_trend_service

router = APIRouter()

@router.get("/data")
def get_weather_data(date: str = Query(..., description="格式為 YYYY-MM-DD")):
    return get_weather_data_service(date)

@router.get("/trend")
def get_rainfall_trend(
    station: str = Query(..., description="測站名稱（StationName）"),
    start: str = Query(..., description="開始日期 YYYY-MM-DD"),
    end: str = Query(..., description="結束日期 YYYY-MM-DD")
):
    return get_rainfall_trend_service(station, start, end)