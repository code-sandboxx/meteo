import AbstractView from "./AbstractView.js";

export default class extends AbstractView{    

    constructor(params){
        
        super(params);     

        this.maxTemp = params.maxTemp;
        this.minTemp = params.minTemp; 
        this.city = decodeURIComponent(params.city);
        this.weatherDescription = decodeURIComponent(params.wdesc); // to remove the encoding symbols such as %20 between words.
        this.day = params.day; 
        this.date = params.date; 
        this.visibility = params.vis;
        this.currentTemp = params.cTemp;
        this.perceivedTemp = params.pTemp;
        this.windSpeed = params.wind;
        this.humidity = params.hum;
        this.pressure = params.pres;
        this.sunrise = decodeURIComponent(params.sunr);
        this.sunset = decodeURIComponent(params.suns);
        this.icon = decodeURIComponent(params.icon);        
    }    

    async getHtml(){ 
        return  `
            <div class="day_details">  
                <div class="details">   

                    <h1 class="city">${this.city}</h1>  
                    <div class="header_wrapper">                   

                        <div class="details_header">
                            <h2 class="day">${this.day}</h2> 
                            <h3 class="date">${this.date}</h3>    
                            <span class="weather_status_description">${this.weatherDescription}</span> 
                        </div>  
                        
                        <div class="weather_icon weather_icon_large">
                            <img src="http://openweathermap.org/img/wn/${this.icon}@2x.png" alt="weather icon">
                        </div>

                    </div>    
                        
                    <div class="details_wrapper">                        
                        <span class="current_temp">Current temperature: ${this.currentTemp} °</span>
                        <span class="perceived_temp">Feels like: ${this.perceivedTemp} °</span>
                        <span class="max_temp">Max temperature on this day: ${this.maxTemp} °</span>
                        <span class="min_temp">Min temperature on this day: ${this.minTemp} °</span>
                        <span class="wind">Wind speed: ${this.windSpeed} m/s</span>
                        <span class="humidity">Humidity: ${this.humidity} %</span>
                        <span class="visibility">Visibility: ${this.visibility} m</span>
                        <span class="pressure">Pressure:  ${this.visibility} hPa</span>
                        <span class="sunrise">Sunrise: ${this.sunrise}</span>
                        <span class="sunset">Sunset: ${this.sunset}</span>  
                    </div>   
                </div>
            </div>
        `
    }          
}