// 7 - import view
import LocationView from "./views/LocationView.js"
import Dashboard from "./views/Dashboard.js"

// 10 - regex
const pathToRegex = path => new RegExp("^"+ path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$") // transforms a path string into a regular expression that can be used to match routes.

// 11 - get params
const getParams = match => {
    const values = match.result.slice(1) //skips the first element in the array of results
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]) //finds all the parameter names in the original URL path and converts the iterator of all matches to an array; creates an object that maps parameter names to parameter values

    //console.log(Array.from(match.route.path.matchAll(/:(\w+)/g))) 
    
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]]
    }))
}

// 1 - router
const router = async () => {

    const routes = [
        {path: "/", view: Dashboard},        
        {path: "/home", view: Dashboard},
        {path: "/location", view: LocationView},
        {path: "/dashboard/lat=:lat&lon=:lon", view: Dashboard }
    ]

    // 2 - match function
    const potentialMatches = routes.map(route => {
        return{
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        }
    })    

    // 3 - find view
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null)

    if(!match){
        match = {
            route: routes[0], // redirects to the home page no matter which path the user enters after the '/'
            result: [location.pathname]
        }
    }
    
   // 8 - view rendering
   const view = new match.route.view(getParams(match));   

   // Check if lat and lon are detected
    if (view.lat !== null && view.lon !== null) {
         document.querySelector('#app').innerHTML = await view.getHtml();
    } else {  
        // If not detected the view LocationView() will be generated    
        const locationView = new LocationView();
        document.querySelector('#app').innerHTML = await locationView.getHtml();          
    }       
    //console.log(getParams(match));  
}  

// 9 - use back button
window.addEventListener("popstate", router)

// 5 - navigate state
export const navigateTo = url => {
    history.pushState(null, null, url)
    router()
}    

// 4 - execute the route
document.addEventListener("DOMContentLoaded", () =>{
    
    // 6 - SPA link    
    document.body.addEventListener("click", e => {
        if(e.target.matches("[data-link]")){
            e.preventDefault()   // prevents the navigation by default
            navigateTo(e.target.href) // redirects to navigateTo - prevents the page reload
        }
    })

    router()
})