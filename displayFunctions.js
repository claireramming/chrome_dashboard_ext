import { getMondayAndNextSunday, getToday } from "./timeFunctions.js"

const SPORT_API_KEY = config.sport_key
const SPORTS_URL = 'https://api-football-v1.p.rapidapi.com/v3'
const NWSL_ID = 254
const SEASON = 2021

// BACKGROUND
export function fetchBackground() {
    fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nwsl")
    .then(res => res.json())
    .then(data => {
            document.body.style.backgroundImage = `url(${data.urls.regular})`
            document.getElementById("author").textContent = `By: ${data.user.name}`
    })
    .catch(err => {
            // Use a default background image/author
            document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
            )`
            document.getElementById("author").textContent = `By: Dodi Achmad`
    })
}


// WEATHER
export function fetchWeather() {
    navigator.geolocation.getCurrentPosition(position => {
        fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial`)
            .then(res => {
                if (!res.ok) {
                    throw Error("Weather data not available")
                }
                return res.json()
            })
            .then(data => {
                const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                document.getElementById("weather").innerHTML = `
                    <img src=${iconUrl} />
                    <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                    <p class="weather-city">${data.name}</p>
                `
            })
            .catch(err => console.error(err))
    });
}

// STANDINGS
function showStandingsData(data) {
    let html = ''
    data.forEach(rank => {
        const {
        team,
        logo,
        points,
        games_won,
        games_lost,
        games_tied,
        games_played,
        } = rank
        html += `
        <div class="rank">
            <img src=${logo} alt=${team}>
            <p>(${games_played}) ${games_won} - ${games_lost} - ${games_tied} : ${points}</p>
        </div>`
    })
    document.getElementById('standings').innerHTML += html
}

function storeStandingsData(data) {
    let standings = []

    data.forEach(rank => {
        let r = {
            team: rank.team.name,
            logo: rank.team.logo,
            points: rank.points,
            games_won: rank.all.win,
            games_lost: rank.all.lose,
            games_tied: rank.all.draw,
            games_played: rank.all.played,
        }
        standings.push(r)
    })
    const updated = localStorage.getItem("updated")
    const today = getToday()
    if (updated != today) {
        localStorage.setItem("updated", getToday())
    }
    localStorage.setItem("standings", JSON.stringify(standings))
    showStandingsData(standings)
}

export function getStandingsData() {
    const data = localStorage.getItem("standings")
    const standings = JSON.parse(data)
    showStandingsData(standings)
}

export function fetchStandingsData() {
    fetch(`${SPORTS_URL}/standings?season=${SEASON}&league=${NWSL_ID}`, {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": SPORT_API_KEY
        }
    })
    .then(response => response.json())
    .then(data => {
        const standings = data.response[0].league.standings[0]
        storeStandingsData(standings)
    })
    .catch(err => {
        console.error(err)
    })
}

// GAMES
function storeGameData(data) {
    let games = []

    data.forEach(game => {
        const game_date = new Date(game.fixture.date)
        let g = {
            home_team: game.teams.home.name,
            home_logo: game.teams.home.logo,
            away_team: game.teams.away.name,
            away_logo: game.teams.away.logo,
            score_home: game.score.fulltime.home,
            score_away: game.score.fulltime.away,
            game_day: new Intl.DateTimeFormat('en-US', {weekday:'short'}).format(game_date),
            game_time: game_date.toLocaleTimeString("en-us", {timeStyle: "short"}),
        }
        games.push(g)
    })
    localStorage.setItem("updated", getToday())
    localStorage.setItem("games", JSON.stringify(games))
    showGameData(games)
}

export function getGameData() {
    const data = localStorage.getItem("games")
    const games = JSON.parse(data)
    showGameData(games)
}

export function fetchGameData() {
    const {mon, sun} = getMondayAndNextSunday()
    fetch(
        `${SPORTS_URL}/fixtures?league=${NWSL_ID}&season=${SEASON}&from=${mon}&to=${sun}`,
        {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            "x-rapidapi-key": SPORT_API_KEY
        }
    })
    .then(resp => resp.json())
    .then(data => {
        const game_data = data.response
        storeGameData(game_data) 
    })
}

function showGameData(games) {
    let html = ''
    games.forEach(game => {
        const {home_team,
            home_logo,
            away_team,
            away_logo,
            score_home,
            score_away,
            game_day,
            game_time,
        } = game
        html += `
        <div class='game'>
            <img class='game-home' src=${home_logo} alt=${home_team}>
            <img class='game-away' src=${away_logo} alt=${away_team}>
            `
        if (score_home == null) {
            html += `
            <p class='game-day'>${game_day}</p>
            <p class='game-time'>${game_time}</p>
            `
        } else {
            html += `
            <p class='score-home'>${score_home}</p>
            <p class='score-away'>${score_away}</p>`
        }
            
        html += '</div>'
    })
    document.getElementById('games').innerHTML = html
}