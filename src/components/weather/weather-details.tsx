import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherDetailsProps {
  details: {
    sunrise: string;
    sunset: string;
    windDirection: string;
    pressure: string;
    feelsLike: number;
    visibility: string;
    uvIndex: number;
  };
}

export function WeatherDetails({ details }: WeatherDetailsProps) {
  return (
    <Card className="bg-card/50 border-none">
      <CardHeader>
        <CardTitle className="text-white">Weather Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Sunrise</span>
          <span className="text-white font-medium">{details.sunrise}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Sunset</span>
          <span className="text-white font-medium">{details.sunset}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Feels Like</span>
          <span className="text-white font-medium">{details.feelsLike}°C</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Wind Direction</span>
          <span className="text-white font-medium">{details.windDirection}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Pressure</span>
          <span className="text-white font-medium">{details.pressure}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Visibility</span>
          <span className="text-white font-medium">{details.visibility}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">UV Index</span>
          <span className="text-white font-medium">{details.uvIndex}</span>
        </div>
      </CardContent>
    </Card>
  );
}