import express, { Router, Request, Response } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

interface ForecastResult {
  list: HourForecast[];
  cnt: number;
}

interface HourForecast {
  dt: number;
  dt_txt: string;
  weather: Weather[];
  main: Temperature;
}

interface Weather {
    description: string,
    icon: string,
    main: string,
}

interface Temperature {
    temp_min: number,
    temp_max: number,
    temp: number,
    feels_like: number
}

dotenv.config();
export const router: Router = express.Router();
const lat = 57.70887;
const lon = 11.97456;
const units = "metric";

router.get("/now", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=${units}`
    );
    const data = await response.json();
    const weather = {
      temp: Number(data.main.temp.toFixed(1)),
      feels_like: Number(data.main.feels_like.toFixed(1)),
      description: data.weather[0].description,
      icon: data.weather[0].icon
    };

    res.status(200);
    res.json(weather);
  } catch(error) {
    res.status(500);
    res.send({msg: "Something went in the API call on the server side."})
  }
});


router.get("/forecast", async (req: Request, res: Response) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=${units}`
    );
    const data: ForecastResult = await response.json();
    // Prepare the data, remove data from today and only save data for 4 days ahead.
    const preparedData = data.list.filter(
      forecast => new Date(forecast.dt_txt).getDate() !== new Date().getDate()
    ).slice(0,32);

    const weather: object[] = [];
    let day_temps: number[] = [];
    let day_feels_like : number[] = [];
    let day_min: number = 9999;
    let day_max: number = -9999;
    let day_icon: string = "";

    preparedData.forEach((hour: HourForecast, i: number) => {
      day_temps.push(hour.main.temp);
      day_feels_like.push(hour.main.temp)
  
      if(day_min > hour.main.temp_min)
          day_min = hour.main.temp_min;
  
      if(day_max < hour.main.temp_max)
          day_max = hour.main.temp_max;

      if(new Date(hour.dt_txt).getHours() === 12)
        day_icon = hour.weather[0].icon

      
  
      // When we have gone thorugh 8 values we have values for one day,
      // then we calculate average and median temps for that day.    
      if ((i + 1) % 8 === 0) {
        const temp_average = Number((day_temps.reduce((sum, temp) => sum + temp, 0) / day_temps.length).toFixed(1));
        const feels_like_average = Number((day_feels_like.reduce((sum, temp) => sum + temp, 0) / day_feels_like.length).toFixed(1));
        const temp_median = Number(((day_temps.sort()[3] + day_temps.sort()[4])/2).toFixed(1));
        const date = new Date(hour.dt_txt);
        const day = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
        const formattedDate = `${date.getDay()}/${date.getMonth()}`;
        // Add the weather data for the day to 
        weather.push({
          day,
          date: formattedDate,
          description: hour.weather[0].description,
          icon: day_icon,
          temp_average,
          feels_like_average,
          temp_median,
          temp_min: day_min,
          temp_max: day_max,
        });
        day_temps = [];
        day_feels_like = [];
        day_min = 9999;
        day_max = -9999;
        day_icon = "";
      } 
    });
    res.status(200)
    res.json(weather);
  } catch(error) {
    res.status(500)
    res.send({msg: "Something went in the API call on the server side."})
  }
});
