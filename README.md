# 🌧️ Rainfall Measurement App

這是一個歷史雨量資料查詢應用，前端使用 **React + Vite + Tailwind CSS**，後端使用 **FastAPI**，以現代化技術堆疊實作前後端分離。支援以圖表與地圖方式查詢每日雨量與雨量趨勢。

---
## 環境需求
- Python 3.12.4
- 建議使用 `venv` 建立虛擬環境
- 作業系統：Windows 11
- 本專案在 Windows 11 上開發與測試，理論上支援其他平台，但可能需要調整啟動方式（如 shell 指令）。

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

### 1️⃣ 建立並啟用虛擬環境 (For Windows)

```bash
python -m venv venv
venv/Scripts/activate  
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

### 5️⃣ 前端開啟方式

啟動前端頁面: http://127.0.0.1:8000/

API: http://127.0.0.1:8000/api


---
## 🖥️ 前端功能特色
* 🗺️ 地圖介面：可視化各測站當日降雨量

* 📈 雨量趨勢圖：查詢特定測站在一段時間內的降雨變化

* 🔍 測站選單：下拉選單顯示所有測站，依由北到南（緯度）排序

* ⏱️ 快速時間範圍：支援一鍵查詢「近一週」與「近一個月」趨勢

---
## 🔹 API 路徑

### 📅 每日雨量查詢
```bash
GET /api/weather/data?date=YYYY-MM-DD
```
* 參數 date: 你要查詢的日期（格式為 2024-06-30）

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

---
### 📈 雨量趨勢查詢
```bash
GET /api/trend?station=竹子湖&start=2025-06-15&end=2025-07-13
```
參數：
* station：測站名稱（如「竹子湖」）

* start：起始日期

* end：結束日期

## 🔹 範例回傳格式
```json
{
  "station": "竹子湖",
  "start": "2025-07-01",
  "end": "2025-07-10",
  "data": [
    {
      "date": "2025-07-01",
      "rainfall": 0
    },
    
    ...
  ]
}
```

---
## 🔹 資料處理流程圖
```text
使用者請求
    ↓
[weather.py] router 接收 GET /data 或 GET /trend
    ↓
[weather_service.py] 呼叫 get_weather_data_service / get_trend_data_service
    ↓
[cwa_client.py]
    ├─ fetch_weather_data(date)
    │   → 發送 API 請求，擷取中央氣象局 JSON 資料
    └─ parse_weather_data(records, date)
        → 資料清洗與統一格式，處理缺漏值、欄位對應
```

