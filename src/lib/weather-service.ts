import axios from 'axios';

const API_KEY = 'e4e1871fb483f1131e910aebc5e0b15e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  location: {
    name: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    feelslike_c: number;
    feelslike_f: number;
    humidity: number;
    wind_kph: number;
    pressure_mb: number;
    vis_km: number;
    uv: number;
    condition: {
      text: string;
      icon: string;
    };
  };
}

export interface ForecastData {
  date: string;
  day: string;
  condition: string;
  windSpeed: number;
  humidity: number;
  maxTemp: number;
  minTemp: number;
  icon: string;
  precipitation: number;
}

export interface WeatherDetails {
  sunrise: string;
  sunset: string;
  windDirection: string;
  pressure: string;
  feelsLike: number;
  visibility: string;
  uvIndex: number;
}

export interface HourlyData {
  time: string;
  temperature: number;
  icon: string;
  precipitation: number;
}

export const weatherAPI = {
  async getCurrentWeather(city: string): Promise<WeatherData> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        },
        timeout: 10000
      });

      const data = response.data;
      
      return {
        location: {
          name: data.name,
          country: data.sys.country
        },
        current: {
          temp_c: Math.round(data.main.temp),
          temp_f: Math.round((data.main.temp * 9/5) + 32),
          feelslike_c: Math.round(data.main.feels_like),
          feelslike_f: Math.round((data.main.feels_like * 9/5) + 32),
          humidity: data.main.humidity,
          wind_kph: Math.round(data.wind.speed * 3.6),
          pressure_mb: data.main.pressure,
          vis_km: Math.round(data.visibility / 1000),
          uv: 0, // Not available in free tier
          condition: {
            text: data.weather[0].description,
            icon: data.weather[0].icon
          }
        }
      };
    } catch (error: any) {
      console.error('Weather API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch weather data: ${error.response?.data?.message || error.message}`);
    }
  },

  async get7DayForecast(city: string): Promise<ForecastData[]> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        },
        timeout: 10000
      });

      const forecastData = response.data;
      
      // Group forecast by day
      const dailyData: { [key: string]: any } = {};
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = {
            temps: [],
            conditions: [],
            windSpeeds: [],
            humidities: [],
            icons: [],
            pops: []
          };
        }
        
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].conditions.push(item.weather[0].description);
        dailyData[date].windSpeeds.push(item.wind.speed);
        dailyData[date].humidities.push(item.main.humidity);
        dailyData[date].icons.push(item.weather[0].icon);
        dailyData[date].pops.push(item.pop);
      });

      // Convert to ForecastData format
      const forecast: ForecastData[] = Object.keys(dailyData)
        .slice(0, 7)
        .map((dateString, index) => {
          const dayData = dailyData[dateString];
          const date = new Date(dateString);
          const today = new Date();
          const isToday = date.toDateString() === today.toDateString();

          // Get most frequent condition and icon
          const mostFrequentCondition = dayData.conditions.reduce((a: string, b: string) => 
            dayData.conditions.filter((v: string) => v === a).length >= 
            dayData.conditions.filter((v: string) => v === b).length ? a : b
          );

          const mostFrequentIcon = dayData.icons.reduce((a: string, b: string) => 
            dayData.icons.filter((v: string) => v === a).length >= 
            dayData.icons.filter((v: string) => v === b).length ? a : b
          );

          return {
            date: date.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            }),
            day: isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long' }),
            condition: mostFrequentCondition,
            windSpeed: Math.round(dayData.windSpeeds.reduce((a: number, b: number) => a + b) / dayData.windSpeeds.length * 3.6),
            humidity: Math.round(dayData.humidities.reduce((a: number, b: number) => a + b) / dayData.humidities.length),
            maxTemp: Math.round(Math.max(...dayData.temps)),
            minTemp: Math.round(Math.min(...dayData.temps)),
            icon: mostFrequentIcon,
            precipitation: Math.round(dayData.pops.reduce((a: number, b: number) => a + b) / dayData.pops.length * 100)
          };
        });

      return forecast;
    } catch (error: any) {
      console.error('Forecast API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch forecast: ${error.response?.data?.message || error.message}`);
    }
  },

  async getHourlyForecast(city: string): Promise<HourlyData[]> {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        },
        timeout: 10000
      });

      const forecastData = response.data;
      
      // Get next 8 time periods (24 hours)
      const hourlyData: HourlyData[] = forecastData.list.slice(0, 8).map((item: any) => {
        const date = new Date(item.dt * 1000);
        const time = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true
        }).replace(' ', '');

        return {
          time,
          temperature: Math.round(item.main.temp),
          icon: item.weather[0].icon,
          precipitation: Math.round(item.pop * 100)
        };
      });

      return hourlyData;
    } catch (error: any) {
      console.error('Hourly Forecast API Error:', error.response?.data || error.message);
      return this.getMockHourlyData();
    }
  },

  async getWeatherDetails(city: string): Promise<WeatherDetails> {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric'
        },
        timeout: 10000
      });

      const data = response.data;
      
      const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      return {
        sunrise,
        sunset,
        windDirection: data.wind.deg ? `${Math.round(data.wind.deg)}°` : 'N/A',
        pressure: `${data.main.pressure} hPa`,
        feelsLike: Math.round(data.main.feels_like),
        visibility: `${Math.round(data.visibility / 1000)} km`,
        uvIndex: 0 // Not available in free tier
      };
    } catch (error: any) {
      console.error('Weather Details API Error:', error.response?.data || error.message);
      throw new Error(`Failed to fetch weather details: ${error.response?.data?.message || error.message}`);
    }
  },

  getMockHourlyData(): HourlyData[] {
    const now = new Date();
    const currentHour = now.getHours();
    
    const hourlyData: HourlyData[] = [];
    const baseTemp = 20;
    
    for (let i = 0; i < 8; i++) {
      const hour = (currentHour + i * 3) % 24;
      const time = hour === 0 ? '12AM' : 
                   hour < 12 ? `${hour}AM` : 
                   hour === 12 ? '12PM' : `${hour - 12}PM`;
      
      let temp = baseTemp;
      if (hour >= 22 || hour <= 6) temp -= 5;
      if (hour >= 12 && hour <= 16) temp += 5;
      
      hourlyData.push({
        time,
        temperature: temp + Math.floor(Math.random() * 3) - 1,
        icon: '01d',
        precipitation: Math.floor(Math.random() * 30)
      });
    }
    
    return hourlyData;
  },

  async searchCities(query: string): Promise<Array<{name: string, country: string}>> {
    try {
      const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY
        },
        timeout: 10000
      });

      return response.data.map((city: any) => ({
        name: city.name,
        country: city.country,
        state: city.state
      }));
    } catch (error) {
      console.error('City search error:', error);
      return [];
    }
  }
};