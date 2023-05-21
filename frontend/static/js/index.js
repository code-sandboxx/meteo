
// router
const router = async () => {

    const routes = [
        {path: "/", view: Dashboard},        
    ]

    // match function
    const potentialMatches = routes.map(route => {

        return{
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        }
    })

    console.log(potentialMatches)
}    