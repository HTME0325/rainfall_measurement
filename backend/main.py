from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from routers import weather

app = FastAPI()

# 加入 CORS 中介層（若前後端部署在同一網域，也可以移除）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 線上部署時建議指定網域
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 掛載 API
app.include_router(weather.router, prefix="/api", tags=["Weather"])

# 掛載前端 build 完的靜態頁面
frontend_dist_path = os.path.join(os.path.dirname(__file__), "../frontend/dist")
app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="static")

# 可選：針對 SPA router fallback（讓刷新頁面也能對應 index.html）
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    index_path = os.path.join(frontend_dist_path, "index.html")
    return FileResponse(index_path)
