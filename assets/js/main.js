var gameState = null;
var teamOneName = "";
var teamTwoName = "";

var teamOnePlayers = [];
var teamTwoPlayers = [];
var teamOneScore = 0;
var teamTwoScore = 0;

//elements
const teamOneScoreEl = document.querySelector("#top .score .leftScore");
const teamTwoScoreEl = document.querySelector("#top .score .rightScore");

const teamOneNameEl = document.querySelector("#teamOneName");
const teamTwoNameEl = document.querySelector("#teamTwoName");

const teamOnePlayersEl = document.querySelectorAll("#left .player");
const teamTwoPlayersEl = document.querySelectorAll("#right .player");
const playersEl = document.querySelectorAll(".player");

const currentlySpectatedPlayer = document.querySelector("#currentlySpectatedPlayer");
var lastSpectatedPlayer = null;

var gameTime = 0;
const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");


window.onload = (e) => {
    WsSubscribers.init(49322, true);
    //game_state
    WsSubscribers.subscribe("game", "initialized", (state) => {
        // console.log(state);
    });
    WsSubscribers.subscribe("game", "statfeed", (state) => {
        // console.log(state);
    });
    WsSubscribers.subscribe("game", "update_state", (game_state) => {
        



        if (gameState == null || gameState == undefined) {

            if (game_state["players"].length > 1) {
                gameState = game_state;
                gameState["players"].forEach(player => {
                    player["team"] == 0 ? teamOnePlayers.push(player) : teamTwoPlayers.push(player);

                });
            }

            gameState = game_state;
            teamOneName = game_state["game"]["teams"][0]["name"];
            teamTwoName = game_state["game"]["teams"][1]["name"];
            teamOneNameEl.innerHTML = teamOneName;
            teamTwoNameEl.innerHTML = teamTwoName;

        }
        //set players
        if (teamOnePlayers.length == 0) {
            if (Object.keys(game_state["players"]).length == 6) {
                createPlayers(game_state["players"]);
                for (let index = 0; index < teamOnePlayersEl.length; index++) {
                    const element = teamOnePlayersEl[index];
                    element.querySelectorAll(".player-name")[0].innerHTML = teamOnePlayers[index];
                }
                for (let index = 0; index < teamTwoPlayersEl.length; index++) {
                    const element = teamTwoPlayersEl[index];
                    element.querySelectorAll(".player-name")[0].innerHTML = teamTwoPlayers[index];
                }
            }
        }

        //update score
        if (teamOneScore != game_state["game"]["teams"][0]["score"]) {
            teamOneScore = game_state["game"]["teams"][0]["score"];
        }
        if (teamTwoScore != game_state["game"]["teams"][1]["score"]) {
            teamTwoScore = game_state["game"]["teams"][1]["score"];
        }
        if ((gameTime) > (game_state["game"]["time"])) {
        } else {
            gameTime = game_state["game"]["time"];
            var min = Math.floor(game_state["game"]["time"] / 60);
            var sec = game_state["game"]["time"] - (min * 60);
            minutes.innerHTML = min;
            seconds.innerHTML = Math.round(sec);
        }

        //update elements
        teamOneScoreEl.innerHTML = teamOneScore;
        teamTwoScoreEl.innerHTML = teamTwoScore;
        updatePlayers(game_state["players"]);
        updateCurrentlySpectating(game_state["game"]["target"], game_state["players"]);

    });
}

function updateCurrentlySpectating(playerName, players) {
    var currentPlayer = null;
    console.log(players);
    for (let [key, value] of Object.entries(players)) {
        //#TODO: some stuff here
    };
}

function updatePlayers(players) {
    for (let [key, value] of Object.entries(players)) {
        //console.log(`${key}: ${value}`);
        playersEl.forEach(el => {
            if (el.querySelector(".player-name").innerHTML == key) {
                el.querySelector(".boost span").innerHTML = value["boost"];
                el.querySelector(".boost").style.width = value["boost"] + '%';
                el.querySelector(".goals").innerHTML = value["goals"];
                el.querySelector(".assists").innerHTML = value["assists"];
                el.querySelector(".saves").innerHTML = value["saves"];
            }

        });
    }
}

function createPlayers(players) {

    if (teamOnePlayers.length == 0) {
        for (let [key, value] of Object.entries(players)) {
            // console.log(`${key}: ${value}`);
            switch (value["team"]) {
                case 0:
                    teamOnePlayers.push(key);
                    break;
                case 1:
                    teamTwoPlayers.push(key);
                    break;
                default:
                    break;
            }
        }


    }

}