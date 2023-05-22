import AbstractView from "./AbstractView.js";

export default class extends AbstractView{    

    constructor(params){
        super(params)   
    }    

    async getHtml(){ 
        return  `
            <div class="day_details">  
                <div class="details">   

                    <h1 class="city">Montreal</h1>  
                    <div class="header_wrapper">                   

                        <div class="details_header">
                            <h2 class="day">Today</h2> 
                            <h3 class="date">21/05/2023</h3>    
                            <span class="weather_status_description">Clear</span> 
                        </div>  
                        
                        <div class="weather_icon weather_icon_large">
                            <img src="img/01d@2x (1).png" alt="">
                        </div>

                    </div>    
                        
                    <div class="details_wrapper">                        
                        <span class="current_temp">Current temperature: 24°</span>
                        <span class="perceived_temp">Feels like: 18°</span>
                        <span class="max_temp">Max temperature on this day: 25°</span>
                        <span class="min_temp">Min temperature on this day: 15°</span>
                        <span class="wind">Wind speed: 5 mph</span>
                        <span class="humidity">Humidity: 69</span>
                        <span class="visibility">Visibility: 1000</span>
                        <span class="pressure">Pressure: 1018</span>
                        <span class="sunrise">Sunrise: 6 a.m.</span>
                        <span class="sunset">Sunset: 8 p.m.</span>  
                    </div>   
                </div>
            </div>
        `
    }      
    
}