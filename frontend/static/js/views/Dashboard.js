import AbstractView from "./AbstractView.js";
import { navigateTo } from "../index.js";

export default class extends AbstractView{    

    constructor(params){

        super(params);
        this.setTitle("Dashboard");
        this.lat = null;
        this.lon = null;
        this.cityData;
        this.country = null;
        this.city = null;        
         
        if (params && params.lat && params.lon && params.country && params.city) {
            this.lat = params.lat;
            this.lon = params.lon;
            this.country = params.country;
            this.city = params.city;
        }
        else navigateTo(`/location`); 

        const searchInput = document.querySelector(".search_input");  
        const searchResultsContainer = document.querySelector(".search_results_container");
        const searchButton = document.getElementById("btnSearch");

        // the search results will be regenerated upon each character input
     /*    searchInput.addEventListener("input", async (e) => {
            if (document.activeElement === searchInput) {
                if(e.target.value){
                    const inputValue = e.target.value.trim();
                    await this.loadSearchResults(inputValue);
                }              
            }            
        }); */

        // event listener for the submit button
        searchButton.addEventListener("click", async (e) => {
            e.preventDefault();
            const inputValue = searchInput.value.trim();
            await this.loadSearchResults(inputValue);
        });

        // Checks if the clicked element is outside the search input and search results container and hides the results list
        document.addEventListener("click", (e) => {                    
            if (!searchInput.contains(e.target) && !searchResultsContainer.contains(e.target)) {
               searchResultsContainer.classList.remove("show");
               searchResultsContainer.classList.add("hidden");
            }
        })    
    }

    //******************************************************/

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

    //******************************************************/

    async loadCityImgData() {

        let lowercaseCityName = this.city.toLowerCase();
        let formattedCityName = lowercaseCityName.replace(/\s+/g, '-'); // replacing spaces with hyphens - because the API only accepts this format
        this.cityData = await this.getData(`https://api.teleport.org/api/urban_areas/slug:${formattedCityName}/images/`);
        
        // Extracts the large version of the city photo
        let photoUrl = this.cityData.photos[0].image.mobile;        

        // Creates an image element and set the source to the web version of the photo
        let cityPhoto = document.createElement('img');
        cityPhoto.src = photoUrl;    

        // Append the image element to the DOM
        const photoContainer = document.querySelector("main");       
        photoContainer.style.backgroundImage = `url(${photoUrl})`;       
    }

    //******************************************************/

    async getData(url){
        const response = await fetch(url)
        return response.json();             
    }   

    //******************************************************/

    async loadSearchResults(value) {      

        const fetchedSearchResults = await this.getData(`https://api.geoapify.com/v1/geocode/search?text=${value}&lang=en&limit=10&type=city&format=json&apiKey=868dc020ef9a48648f958a38385f3626`);      

        const searchResultsContainer = document.querySelector(".search_results_container");
        //console.log(searchResultsContainer)
        searchResultsContainer.innerHTML = ""; // clears from the previous searches
      
        fetchedSearchResults.results.forEach(searchResult => {

            //console.log(searchResult.city, searchResult.country)
            const searchItem = document.createElement("div"); // creates the container for each search result
            searchItem.classList.add("search_result");  
            const wrappingLink = document.createElement("a");
            wrappingLink.href = "#";
            wrappingLink.appendChild(searchItem); // wraps the div with the link

            if (searchResult.city && searchResult.city.trim() !== "") {

                //checking if all the properties exist, otherwise assigning an empty string value to them.
                const district = searchResult.district && searchResult.district.trim() !== "" ? `${searchResult.district}, ` : "";

                const municipality = searchResult.municipality && searchResult.municipality.trim() !== "" ? `${searchResult.municipality}, ` : "";

                const county = searchResult.county && searchResult.county.trim() !== "" ? `${searchResult.county}, ` : "";

                const province = searchResult.province && searchResult.province.trim() !== "" ? `${searchResult.province}, ` : "";

                const state = searchResult.state && searchResult.state.trim() !== "" ? `${searchResult.state}, ` : "";

                const country = searchResult.country && searchResult.country.trim() !== "" ? `${searchResult.country}` : "";
            
                //filling the search result item with the available city information
                searchItem.textContent = `${district}${searchResult.city}, ${municipality}${county}${province}${state}${country}`;
            }  
            // if the city name is not provided in the search result- hide the empty div
            else searchItem.style.display = "none";
            
            console.log(searchResult)
           
            searchResultsContainer.appendChild(wrappingLink);

            //when user clicks on one of the search results
            searchItem.addEventListener("click", async () => {           
                this.city = searchResult.city; 
                searchResultsContainer.classList.add("hidden");   
                await this.loadCityImgData();           
            });            
        });    
        
        if (fetchedSearchResults.results.length > 0) {
            searchResultsContainer.classList.remove("hidden");
            searchResultsContainer.classList.add("show");
            console.log(fetchedSearchResults.results.length);
        } else {
            searchResultsContainer.classList.add("hidden");
            searchResultsContainer.classList.remove("show");
        }

    }    
    

    //******************************************************/

    async getHtml(){   

        await this.loadCityImgData();

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
    </section>`
    
    }      
    
}