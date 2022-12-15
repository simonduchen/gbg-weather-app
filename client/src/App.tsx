import './App.css';
import { useState, useEffect } from 'react';
import { fetchCurrentWeather, WeatherResult, fetchForecastWeather, ForecastResult } from './utils/fetch';
import WeatherTile from './components/WeatherTile';
function App() {

  const [currentWeather, setCurrentWeather] = useState<WeatherResult>();
  const [forecast, setForecast] = useState<ForecastResult[]>();

  useEffect(() => {
    // Fetch initial data on app start
    fetchCurrentWeather().then((weather) => 
      setCurrentWeather(weather)
    );
    fetchForecastWeather().then((forecast) => 
      setForecast(forecast)
    );

    // Call APIs, to update weather data every 30 seconds
    setInterval(() => {
      fetchCurrentWeather().then((weather) => 
        setCurrentWeather(weather)
      );
      fetchForecastWeather().then(forecast => 
        setForecast(forecast)
      );
    }, 30000)
  }, [])
  return (
    <div className='app'>
      <div className='app-container flex-center'>
        <span className='title'>GBG Weather</span>
        {!currentWeather ? "Loading..." : <WeatherTile 
              key={0}
              day="Today" 
              temperature={currentWeather.temp}
              feelsLike={currentWeather.feels_like}
              icon={currentWeather.icon}
              description={currentWeather.description}
            />}
        
        <div className='forecast-container'>
          <span className='sub-title'>4-day forecast</span>
          <div className='forecast-tiles'>
          {!forecast ? "Loading..." : forecast.map((weather, i) => 
            <WeatherTile
              key={i}
              day={weather.day} 
              temperature={weather.temp_average}
              feelsLike={weather.feels_like_average}
              icon={weather.icon}
              description={weather.description}
              additionalTemps={{
                median: weather.temp_median,
                min: weather.temp_min,
                max: weather.temp_max
              }}
            />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}



export default App;
