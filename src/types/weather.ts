export interface WeatherData {
  location: {
    name: string
    country: string
    lat: number
    lon: number
  }
  current: {
    temp_c: number
    temp_f: number
    condition: {
      text: string
      icon: string
      code: number
    }
    humidity: number
    wind_kph: number
    wind_dir: string
    pressure_mb: number
    feelslike_c: number
    feelslike_f: number
    uv: number
    vis_km: number
  }
  forecast: {
    forecastday: ForecastDay[]
  }
}

export interface ForecastDay {
  date: string
  day: {
    maxtemp_c: number
    maxtemp_f: number
    mintemp_c: number
    mintemp_f: number
    avgtemp_c: number
    avgtemp_f: number
    condition: {
      text: string
      icon: string
      code: number
    }
    humidity: number
    wind_kph: number
    chance_of_rain: number
    uv: number
  }
  hour: HourlyForecast[]
}

export interface HourlyForecast {
  time: string
  temp_c: number
  temp_f: number
  condition: {
    text: string
    icon: string
    code: number
  }
  humidity: number
  wind_kph: number
  chance_of_rain: number
}