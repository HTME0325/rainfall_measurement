export interface WeatherLocation {
    locationName: string;
    date: string;
    Precipitation?: number | null;
    [key: string]: any;
}

export interface WeatherResponse {
    date: string;
    locations: WeatherLocation[];
}
