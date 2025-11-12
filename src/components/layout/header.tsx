import { ThemeToggle } from './theme-toggle'

export function Header() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            MyWeather
          </h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}