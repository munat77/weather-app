import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// CN function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format temperature function
export function formatTemperature(temp: number): string {
  return `${Math.round(temp)}°`;
}

// Other utility functions you might need
export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Format wind speed
export function formatWindSpeed(speed: number, unit: string = 'km/h'): string {
  return `${Math.round(speed)} ${unit}`;
}

// Format humidity
export function formatHumidity(humidity: number): string {
  return `${humidity}%`;
}

// Format pressure
export function formatPressure(pressure: number): string {
  return `${pressure} hPa`;
}