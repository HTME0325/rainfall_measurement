EXCLUDED_STATION_IDS = {"C0R170"}

def is_valid_station(station_id: str):
    return station_id not in EXCLUDED_STATION_IDS