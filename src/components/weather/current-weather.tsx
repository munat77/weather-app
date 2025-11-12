import { Card, CardContent } from '@/components/ui/card';
import { Thermometer, Droplets, Wind, Gauge, Eye, Sun } from 'lucide-react';
import { formatTemperature } from '@/lib/utils';

interface CurrentWeatherProps {
  data?: {
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
        icon: string; // Added icon property
      };
    };
    location: {
      name: string;
      country: string;
    };
  };
  isCelsius?: boolean;
}

export function CurrentWeather({ data, isCelsius = true }: CurrentWeatherProps) {
  // Add safety checks
  if (!data || !data.current) {
    return (
      <Card className="bg-card/50 border-none text-white">
        <CardContent className="p-6">
          <div className="text-center">
            <p>No weather data available</p>
            <p className="text-sm text-muted-foreground">Search for a city to see weather information</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const current = data.current;
  const location = data.location;

  const weatherCards = [
    {
      title: "Feels Like",
      value: formatTemperature(isCelsius ? current.feelslike_c : current.feelslike_f),
      icon: <Thermometer className="h-4 w-4" />
    },
    {
      title: "Humidity",
      value: `${current.humidity}%`,
      icon: <Droplets className="h-4 w-4" />
    },
    {
      title: "Wind",
      value: `${current.wind_kph} km/h`,
      icon: <Wind className="h-4 w-4" />
    },
    {
      title: "Pressure",
      value: `${current.pressure_mb} mb`,
      icon: <Gauge className="h-4 w-4" />
    },
    {
      title: "Visibility",
      value: `${current.vis_km} km`,
      icon: <Eye className="h-4 w-4" />
    },
    {
      title: "UV Index",
      value: current.uv.toString(),
      icon: <Sun className="h-4 w-4" />
    },
  ];

  return (
    <Card className="bg-card/50 border-none text-white">
      <CardContent className="p-6">
        {/* Location */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{location.name}, {location.country}</h2>
          <p className="text-muted-foreground capitalize">{current.condition.text}</p>
        </div>

        {/* Main Temperature with Icon */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="text-6xl font-bold">
              {formatTemperature(isCelsius ? current.temp_c : current.temp_f)}
            </div>
            {current.condition.icon && (
              <img 
                src={`https://openweathermap.org/img/wn/${current.condition.icon}@2x.png`}
                alt={current.condition.text}
                className="w-20 h-20"
              />
            )}
          </div>
          <p className="text-muted-foreground">
            Feels like {formatTemperature(isCelsius ? current.feelslike_c : current.feelslike_f)}
          </p>
        </div>

        {/* Weather Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {weatherCards.map((card, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-background/20 rounded-lg">
              <div className="text-blue-400">
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="font-semibold">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}