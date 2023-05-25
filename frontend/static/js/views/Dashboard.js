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
        this.weatherData;      
        this.weatherProcessedData;               
         
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
         searchInput.addEventListener("input", async (e) => {
            if (document.activeElement === searchInput) {
                if(e.target.value){
                    const inputValue = e.target.value.trim();
                    await this.loadSearchResults(inputValue);
                }              
            }            
        });

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

    async loadCityImgData() {

        let lowercaseCityName = decodeURIComponent(this.city.toLowerCase());
        let formattedCityName = lowercaseCityName.replace(/\s+/g, '-'); // replacing spaces with hyphens - because the API only accepts this format
        
        this.cityData = await this.getData(`https://api.teleport.org/api/urban_areas/slug:${formattedCityName}/images/`);
        
        // Extracts the large version of the city photo if exists - otherwise uses a default image
        let photoUrl = this.cityData.photos && this.cityData.photos.length > 0 
                ? this.cityData.photos[0].image?.mobile 
                : "/static/img/cityscape.svg";
  

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
            searchResultsContainer.appendChild(wrappingLink);

            //when user clicks on one of the search results
            searchItem.addEventListener("click", async () => { 

                this.city = searchResult.city; 
                this.country = searchResult.country;  
                this.lat = searchResult.lat;
                this.lon = searchResult.lon;       

                searchResultsContainer.classList.add("hidden");  // hide the search results container 
                console.log(this.city)
                navigateTo(`/dashboard/lat=${this.lat}&lon=${this.lon}&country=${this.country}&city=${this.city}`);       
            });            
        });    
        
        if (fetchedSearchResults.results.length > 0) {
            searchResultsContainer.classList.remove("hidden");
            searchResultsContainer.classList.add("show");
            
        } else {
            searchResultsContainer.classList.add("hidden");
            searchResultsContainer.classList.remove("show");
        }
    } 
    
    //******************************************************/

    async fetchWeatherData() {

        this.weatherData = await this.getData(`https://api.openweathermap.org/data/2.5/forecast?lat=${this.lat}&lon=${this.lon}&appid=4767950b520f4f2d7cee1dcf3010ddf8&units=metric`);

        this.handleWeatherData(this.weatherData);
    }
    
    //******************************************************/
    
    handleWeatherData(weatherData){        

        let dates = weatherData.list.map(item => item.dt_txt.split(" ")[0]); // extracts all the dates without time

        // sunset and sunrise time extraction and conversion
        const unixSunrise = weatherData.city.sunrise;
        const dateSunrise = new Date(unixSunrise * 1000);
        const formattedDateSunrise = dateSunrise.toLocaleTimeString();

        const unixSunset = weatherData.city.sunset;
        const dateSunset = new Date(unixSunset * 1000);
        const formattedDateSunset = dateSunset.toLocaleTimeString();
        

        let uniqueDates = [...new Set(dates)]; // removes duplicates        

        let maxTempForEachDay = []; // empty array where the max temperature values for each day  will be stored
        let minTempForEachDay = []; // empty array where the min temperature values for each day  will be stored

        for(let i = 0; i < uniqueDates.length; i++) {

            let date = uniqueDates[i]; // every unique date

            let filteredData = weatherData.list.filter(item => { // filtering out all data that corresponds to the given unique date

                let itemDate = item.dt_txt.split(" ")[0]; // splitting the date value from the time
                return itemDate === date;
            });

            let maxTempObj = null;
            let minTempObj = null;

            for(let j = 0; j < filteredData.length; j++) {

                if(maxTempObj == null || filteredData[j].main.temp_max > maxTempObj.main.temp_max) {

                    maxTempObj = filteredData[j]; // retrieving the biggest number from all max values for a given date
                }

                if(minTempObj == null || filteredData[j].main.temp_min < minTempObj.main.temp_min) {
                    
                    minTempObj = filteredData[j]; // retrieving the lowest number from all min values for a given date
                }
            }

            maxTempForEachDay.push(maxTempObj); // adding the max values for each day to the array 
            minTempForEachDay.push(minTempObj); // adding the max values for each day to the array             
        }    

        this.weatherProcessedData = {
            maxTempForEachDay: maxTempForEachDay,
            minTempForEachDay: minTempForEachDay,
            formattedDateSunrise: formattedDateSunrise,
            formattedDateSunset: formattedDateSunset
        };
     
    }
    

    //******************************************************/

    async getHtml(){  

        await this.loadCityImgData();      
        await this.fetchWeatherData(); 

        const formatDay = (dateString) => {
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const date = new Date(dateString);
            const today = new Date();

            // displays "Today" if the date is current
            if (date.toDateString() === today.toDateString()) {
                return "Today";
            }
            return daysOfWeek[date.getDay()]; // returning the day of the week by index that is returned by getDay()
        };  
    
        let weatherTilesHtml = this.weatherProcessedData.maxTempForEachDay.map((data, index) => {         
    
            return `
                <a href="/details/lat=${encodeURIComponent(this.lat)}&lon=${encodeURIComponent(this.lon)}&country=${encodeURIComponent(this.country)}&city=${encodeURIComponent(this.city)}&maxTemp=${encodeURIComponent(this.weatherProcessedData.maxTempForEachDay[index].main.temp_max)}&minTemp=${encodeURIComponent(this.weatherProcessedData.minTempForEachDay[index].main.temp_min)}&wdesc=${encodeURIComponent(data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1))}&day=${formatDay(data.dt_txt)}&date=${data.dt_txt.split(" ")[0]}&vis=${data.visibility}&cTemp=${data.main.temp}&pTemp=${data.main.feels_like}&wind=${data.wind.speed}&hum=${data.main.humidity}&pres=${data.main.pressure}&sunr=${this.weatherProcessedData.formattedDateSunrise}&suns=${this.weatherProcessedData.formattedDateSunset}&icon=${data.weather[0].icon}" data-link>    

                    <div class="weather_tile">
                        <div class="tile_header_wrapper">
                            <h2 class="day">${formatDay(data.dt_txt)}</h2>
                            <h3 class="date">${data.dt_txt.split(" ")[0]}</h3>  
                        </div>                
    
                        <div class="tile_details_container_wrapper">                 
    
                            <div class="tile_details_container"> 
                                <span class="max_temp">Max: ${this.weatherProcessedData.maxTempForEachDay[index].main.temp_max}°</span>
                                <span class="min_temp">Min: ${this.weatherProcessedData.minTempForEachDay[index].main.temp_min}°</span>
                                <span class="weather_status">${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</span>
                            </div>
    
                            <div class="weather_icon">
                                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="wether icon">
                            </div>
                        </div>
                    </div>
                </a>
            `;
        }).join(""); 
       
        return  `
        <section class="weather_tiles_section">
            <div class="weather_tiles_wrapper">             
                <h1>6-Day Weather Forecast</h1>
                <div class="weather_tiles_container">            
                    ${weatherTilesHtml}
                </div>   
            </div>  
        </section>`  
    }        
}