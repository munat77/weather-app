'use client';

import { useState, useEffect } from 'react';
import { CurrentWeather } from '@/components/weather/current-weather';
import { TemperatureChart } from '@/components/weather/temperature-chart';
import { Forecast } from '@/components/weather/forecast';
import { WeatherDetails } from '@/components/weather/weather-details';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { weatherAPI, type WeatherData, type ForecastData, type WeatherDetails as WeatherDetailsType, type HourlyData } from '@/lib/weather-service';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetailsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('New York');
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{name: string, country: string}>>([]);

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      setSearchSuggestions([]);

      const [current, forecast, hourly, details] = await Promise.all([
        weatherAPI.getCurrentWeather(cityName),
        weatherAPI.get7DayForecast(cityName),
        weatherAPI.getHourlyForecast(cityName),
        weatherAPI.getWeatherDetails(cityName)
      ]);

      setWeatherData(current);
      setForecastData(forecast);
      setHourlyData(hourly);
      setWeatherDetails(details);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data. Please check the city name.');
      console.error('Error fetching weather data:', err);
      
      setWeatherData(null);
      setForecastData([]);
      setHourlyData([]);
      setWeatherDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setSearchSuggestions([]);
      return;
    }

    try {
      const suggestions = await weatherAPI.searchCities(query);
      setSearchSuggestions(suggestions);
    } catch (error) {
      console.error('Error searching cities:', error);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, []);

  const handleSearch = (searchCity: string) => {
    if (searchCity.trim()) {
      setCity(searchCity);
      fetchWeatherData(searchCity);
    }
  };

  const handleInputChange = (value: string) => {
    setCity(value);
    searchCities(value);
  };

  const selectSuggestion = (suggestion: {name: string, country: string}) => {
    const fullName = `${suggestion.name}, ${suggestion.country}`;
    setCity(fullName);
    setSearchSuggestions([]);
    fetchWeatherData(suggestion.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">MyWeather</h1>
          <ThemeToggle />
        </div>

        <div className="mb-6 relative">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search for a city..."
                value={city}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(city)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="text-gray-900 dark:text-white">
                        {suggestion.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {suggestion.country}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleSearch(city)}
              disabled={loading}
              className="px-6 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/30 hover:bg-white/30 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {error && (
            <p className="text-red-200 mt-2 text-sm bg-red-500/20 p-2 rounded-lg">
              {error}
            </p>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white text-xl">Loading weather data...</div>
          </div>
        ) : weatherData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-1">
              <CurrentWeather data={weatherData} isCelsius={true} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <TemperatureChart hourlyData={hourlyData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Forecast forecast={forecastData} />
                {weatherDetails && <WeatherDetails details={weatherDetails} />}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-white text-lg">
              Enter a city name to see weather information
            </div>
          </div>
        )}
      </div>
    </div>
  );
}