from fastapi import APIRouter, Query
from services.weather_service import get_weather_data_service

router = APIRouter()

@router.get("/data")
def get_weather_data(date: str = Query(..., description="格式為 YYYY-MM-DD")):
    return get_weather_data_service(date)

