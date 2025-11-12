import { Card, CardContent } from '@/components/ui/card';

interface ForecastData {
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

interface ForecastProps {
  forecast: ForecastData[];
}

export function Forecast({ forecast }: ForecastProps) {
  const getWeatherIcon = (iconCode: string) => {
    return (
      <img 
        src={`https://openweathermap.org/img/wn/${iconCode}.png`}
        alt="Weather icon"
        className="w-10 h-10"
      />
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">7-Day Forecast</h3>
      {forecast.map((day, index) => (
        <Card key={index} className="bg-card/50 border-none">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="min-w-20">
                    <p className="font-medium text-white">{day.day}</p>
                    <p className="text-sm text-muted-foreground">{day.date}</p>
                  </div>
                  <div className="text-center">
                    {getWeatherIcon(day.icon)}
                    <p className="text-sm text-muted-foreground capitalize mt-1">{day.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    💨 {day.windSpeed} km/h
                  </span>
                  <span className="flex items-center gap-1">
                    💧 {day.humidity}%
                  </span>
                  <span className="flex items-center gap-1">
                    🌧️ {day.precipitation}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold text-lg">
                  {day.maxTemp}° / {day.minTemp}°
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}