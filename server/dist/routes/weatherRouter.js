"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.router = express_1.default.Router();
const lat = 57.70887;
const lon = 11.97456;
const units = "metric";
exports.router.get("/now", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, node_fetch_1.default)(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=${units}`);
        const data = yield response.json();
        const weather = {
            temp: Number(data.main.temp.toFixed(1)),
            feels_like: Number(data.main.feels_like.toFixed(1)),
            description: data.weather[0].description,
            icon: data.weather[0].icon
        };
        res.status(200);
        res.json(weather);
    }
    catch (error) {
        res.status(500);
        res.send({ msg: "Something went in the API call on the server side." });
    }
}));
exports.router.get("/forecast", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, node_fetch_1.default)(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=${units}`);
        const data = yield response.json();
        // Prepare the data, remove data from today and only save data for 4 days ahead.
        const preparedData = data.list.filter(forecast => new Date(forecast.dt_txt).getDate() !== new Date().getDate()).slice(0, 32);
        const weather = [];
        let day_temps = [];
        let day_feels_like = [];
        let day_min = 9999;
        let day_max = -9999;
        let day_icon = "";
        preparedData.forEach((hour, i) => {
            day_temps.push(hour.main.temp);
            day_feels_like.push(hour.main.temp);
            if (day_min > hour.main.temp_min)
                day_min = hour.main.temp_min;
            if (day_max < hour.main.temp_max)
                day_max = hour.main.temp_max;
            if (new Date(hour.dt_txt).getHours() === 12)
                day_icon = hour.weather[0].icon;
            // When we have gone thorugh 8 values we have values for one day,
            // then we calculate average and median temps for that day.    
            if ((i + 1) % 8 === 0) {
                const temp_average = Number((day_temps.reduce((sum, temp) => sum + temp, 0) / day_temps.length).toFixed(1));
                const feels_like_average = Number((day_feels_like.reduce((sum, temp) => sum + temp, 0) / day_feels_like.length).toFixed(1));
                const temp_median = Number(((day_temps.sort()[3] + day_temps.sort()[4]) / 2).toFixed(1));
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
        res.status(200);
        res.json(weather);
    }
    catch (error) {
        res.status(500);
        res.send({ msg: "Something went in the API call on the server side." });
    }
}));
//# sourceMappingURL=weatherRouter.js.map