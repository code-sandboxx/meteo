import AbstractView from "./AbstractView.js";
import { navigateTo } from "../index.js";

export default class extends AbstractView{    

    constructor(params){

        super(params)
        this.setTitle("Location")
        this.lat = null; 
        this.lon = null;   
        this.cityData;
        this.country;
        this.city;
        this.getGeolocation();    
    }

    getGeolocation() {
        if ("geolocation" in navigator) {
            // if geolocation is available
            navigator.geolocation.getCurrentPosition(async (position) => {
               this.lat = position.coords.latitude;
               this.lon = position.coords.longitude;
               console.log(`Latitude: ${this.lat}, Longitude: ${this.lon}`);

               //get the city and country name
               await this.loadData();
               this.country = this.cityData.address.country;
               this.city = this.cityData.address.city;

               // Redirect to the dashboard route with lat and lon parameters
               navigateTo(`/dashboard/lat=${this.lat}&lon=${this.lon}/${this.country}/${this.city}`);               

            }, function(error) {
               console.error("Error occurred while fetching geolocation", error);
            });
        } else {
            // if geolocation is not available
            console.log("Geolocation is not supported by this browser.");
        }
    } 
    
    async loadData() {
        this.cityData = await this.getData(`https://geocode.maps.co/reverse?lat=${this.lat}&lon=${this.lon}`);
    }

    async getData(url){
        const response = await fetch(url)
        return response.json();        
    }     

    async getHtml() {
       
        return `
            <div class="location_view_wrapper">

                <div class="message">

                    <div class="message_wrapper">
                        Welcome! In order to get the weather forecast details, please allow the application to access your location or enter the desired city in the search bar.     
                        
                        <img src="/static/img/searching-location-svgrepo-com.svg" alt="magnifying glass searching location">
                    </div>                   

                </div>                
            </div>            
        `;      
        
    }
    
}