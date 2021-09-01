import { getToday, getCurrentTime } from "./timeFunctions.js"
import { 
    fetchBackground, 
    fetchWeather, 
    getGameData, 
    fetchGameData,
    getStandingsData,
    fetchStandingsData
 } from "./displayFunctions.js"

const today = getToday()
const last_updated = localStorage.getItem('updated')

fetchBackground()

getCurrentTime()
setInterval(getCurrentTime, 1000)

fetchWeather()

if (last_updated == today) {
    getGameData()
    getStandingsData()
    console.log('got data from storage')
} else {
    fetchGameData()
    fetchStandingsData()
    console.log('fetched data')
}







