import AbstractView from "./AbstractView.js";
import { navigateTo } from "../index.js";

export default class extends AbstractView{    

    constructor(params){

        super(params)
        this.setTitle("Dashboard")
        this.lat = null;
        this.lon = null;
         
        if (params && params.lat && params.lon) {
            this.lat = params.lat;
            this.lon = params.lon;
        } 
              
        console.log(params.lat)      
        console.log(params.lon)    
    }

    getGeolocation() {
        if ("geolocation" in navigator) {
            // geolocation is available
            navigator.geolocation.getCurrentPosition((position) => {
              this.lat = position.coords.latitude;
              this.lon = position.coords.longitude;
              console.log(`Latitude: ${this.lat}, Longitude: ${this.lon}`);
            }, function(error) {
              console.error("Error occurred while fetching geolocation", error);
            });
        } else {
            // geolocation is not available
            console.log("Geolocation is not supported by this browser.");
        }
    } 

    async getHtml(){ 
        return  `
        <section class="weather_tiles_section">

        <div class="weather_tiles_wrapper">             

            <h1>5-Day Weather Forecast</h1>

            <div class="weather_tiles_container">            
        
                <a href="#">    
                                    
                    <div class="weather_tile">

                        <div class="tile_header_wrapper">
                            <h2 class="day">Today</h2>
                            <h3 class="date">21/05/2023</h3>  
                        </div>                

                        <div class="tile_details_container_wrapper">                 

                            <div class="tile_details_container"> 
                                <span class="max_temp">Max: 25°</span>
                                <span class="min_temp">Min: 15°</span>
                                <span class="weather_status">Clear</span>
                            </div>

                            <div class="weather_icon">
                                <img src="img/01d@2x (1).png" alt="">
                            </div>
                        </div>
                        
                    </div>
                </a>
                
                <a href="#">      
                    <div class="weather_tile">

                        <div class="tile_header_wrapper">
                        <h2 class="day">Monday</h2>
                        <h3 class="date">22/05/2023</h3>  
                        </div>                

                        <div class="tile_details_container_wrapper">                 

                            <div class="tile_details_container"> 
                                <span class="max_temp">Max: 24°</span>
                                <span class="min_temp">Min: 10°</span>
                                <span class="weather_status">Cloudy</span>
                            </div>

                            <div class="weather_icon">
                                <img src="img/03d@2x.png" alt="">
                            </div>
                        </div>
                        
                    </div>
                </a>    
                
                <a href="#">
                    <div class="weather_tile">

                        <div class="tile_header_wrapper">
                        <h2 class="day">Tuesday</h2>
                        <h3 class="date">23/05/2023</h3>  
                        </div>                

                        <div class="tile_details_container_wrapper">                 

                            <div class="tile_details_container"> 
                                <span class="max_temp">Max: 20°</span>
                                <span class="min_temp">Min: 8°</span>
                                <span class="weather_status">Rain</span>
                            </div>

                            <div class="weather_icon">
                                <img src="img/11d@2x.png" alt="">
                            </div>
                        </div>
                        
                    </div>
                </a>
        
                <a href="#">
                    <div class="weather_tile">

                        <div class="tile_header_wrapper">
                        <h2 class="day">Wednesday</h2>
                        <h3 class="date">24/05/2023</h3>  
                        </div>                

                        <div class="tile_details_container_wrapper">                 

                            <div class="tile_details_container"> 
                                <span class="max_temp">Max: 23°</span>
                                <span class="min_temp">Min: 12°</span>
                                <span class="weather_status">Clear</span>
                            </div>

                            <div class="weather_icon">
                                <img src="img/01d@2x (1).png" alt="">
                            </div>
                        </div>
                        
                    </div>
                </a>
        
                <a href="#">
                    <div class="weather_tile">

                        <div class="tile_header_wrapper">
                        <h2 class="day">Thursday</h2>
                        <h3 class="date">25/05/2023</h3>  
                        </div>                

                        <div class="tile_details_container_wrapper">                 

                            <div class="tile_details_container"> 
                                <span class="max_temp">Max: 25°</span>
                                <span class="min_temp">Min: 20°</span>
                                <span class="weather_status">Cloudy</span>
                            </div>

                            <div class="weather_icon">
                                <img src="img/02d@2x.png" alt="">
                            </div>
                        </div>
                        
                    </div>
                </a>

            </div>   
    
        </div>  
    </section>
                `
    }      
    
}