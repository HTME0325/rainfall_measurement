from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from routers import weather

app = FastAPI()

# 加入 CORS 中介層
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 掛載 API
app.include_router(weather.router, prefix="/api", tags=["Weather"])

# 掛載前端 build 完的靜態頁面
frontend_dist_path = os.path.join(os.path.dirname(__file__), "../frontend/dist")
app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist_path, "assets")), name="assets")

# SPA router fallback
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    index_path = os.path.join(frontend_dist_path, "index.html")
    return FileResponse(index_path)

# 這個要放在最後
app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="static")