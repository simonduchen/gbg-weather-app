
export interface WeatherResult {
    feels_like: number,
    temp: number,
    temp_max: number,
    temp_min: number
    icon: string
    description: string
}

export interface ForecastResult {
    day: string,
    date: string,
    temp_average: number,
    feels_like_average: number,
    temp_median: number,
    temp_max: number,
    temp_min: number
    icon: string
    description: string
}


export async function fetchCurrentWeather() {
    const res = await fetch("/api/now");
    const data : WeatherResult = await res.json();
    
    return data;
}

export async function fetchForecastWeather() {
    const res = await fetch("/api/forecast");
    const data : ForecastResult[] = await res.json();
    
    return data;
}