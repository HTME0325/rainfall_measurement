# 🌧️ Rainfall Measurement App

這是一個歷史雨量資料查詢應用，前端使用 **React + Vite + Tailwind CSS**，後端使用 **FastAPI**，以現代化技術堆疊實作前後端分離。

---

## 📁 專案結構

```
rainfall_measurement/
├── backend/ # FastAPI 後端應用
│ ├── main.py # 主應用，掛載 API 與前端靜態頁面
│ ├── routers/
│ │ └── weather.py # 路由定義：處理 /api/weather/data
│ ├── services/
│ │ └── weather_service.py # 商業邏輯層，調用 utils 並處理回傳資料
│ ├── utils/
│ │ └── cwa_client.py # 中央氣象局 API 請求與資料解析
│ └── .env # 儲存氣象 API 金鑰（已列入 .gitignore）
├── frontend/ # 前端專案（Vite）
│ ├── rainfall/ # 前端開發原始碼
│ └── dist/ # 前端 build 後的靜態頁面
├── venv/ # Python 虛擬環境
└── README.md # 使用說明
```

---
## 🚀 快速開始

### 1️⃣ 建立並啟用虛擬環境

```bash
python -m venv venv
source venv/bin/activate  
```

### 2️⃣ 安裝後端依賴套件

```bash
cd backend
pip install -r requirements.txt
```

### 3️⃣ 🔐 .env 設定
你需要建立一個 .env 檔案在 backend/，內容如下：
```env
CWA_API_KEY=你的中央氣象局金鑰
```

### 4️⃣ 啟動 FastAPI 後端伺服器

```bash
uvicorn main:app --reload
```

### 5️⃣ 啟動後會看到類似訊息：

```nginx
Uvicorn running on http://127.0.0.1:8000
```

啟動前端頁面: http://127.0.0.1:8000/

API: http://127.0.0.1:8000/api


---
## 🔹 API 路徑
```bash
GET /api/weather/data?date=YYYY-MM-DD
```
參數 date: 你要查詢的日期（格式為 2024-06-30）

回傳資料：該日全台各地測站的雨量紀錄（數值已標準化）

## 🔹 資料處理流程圖
```bash
使用者請求
    ↓
[weather.py] router 觸發 GET /data
    ↓
[weather_service.py] 呼叫 get_weather_data_service
    ↓
[cwa_client.py]
    ├─ fetch_weather_data(date)
    │   -> 請求中央氣象署 API 並擷取資料
    └─ parse_weather_data(records, date)
        -> 萃取測站資料、過濾無效欄位，統一為前端可用格式
```

## 🔹 範例回傳格式
```json
{
  "date": "2025-07-11",
  "locations": [
    {
      "locationName": "新北",
      "date": "2025-07-11",
      "Precipitation": 1.5
    },
    ...
  ]
}
```
