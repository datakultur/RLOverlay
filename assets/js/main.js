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
const currentlySpectatedPlayerName = currentlySpectatedPlayer.querySelector(".name");
const currentlySpectatedPlayerImg = currentlySpectatedPlayer.querySelector("img");
const specBoostContainer = document.querySelector(".spec-boost-container");
const overTimeEl = document.querySelector(".overtime");
var lastSpectatedPlayer = null;

const replayEl = document.querySelector("#replay");

var gameTime = 300;
var OTgameTime = 0;
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
        console.log(game_state);

        if (game_state["game"]["isReplay"]) {
            replayEl.style.display = "flex";
        } else {
            replayEl.style.display = "none";
        }
        if (game_state["game"]["isOT"]) {
            overTimeEl.style.display = "block";
        } else {
            overTimeEl.style.display = "none";
        }

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
                    element.querySelectorAll(".player-name")[0].innerHTML = teamOnePlayers[index].substring(0, teamOnePlayers[index].length - 2);
                }
                for (let index = 0; index < teamTwoPlayersEl.length; index++) {
                    const element = teamTwoPlayersEl[index];
                    element.querySelectorAll(".player-name")[0].innerHTML = teamTwoPlayers[index].substring(0, teamTwoPlayers[index].length - 2);
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
        if (game_state["game"]["isOT"]) {
            if (OTgameTime < game_state["game"]["time"]) {

                OTgameTime = game_state["game"]["time"];
                var min = Math.floor(game_state["game"]["time"] / 60);
                var sec = game_state["game"]["time"] - (min * 60);
                minutes.innerHTML = min;
                seconds.innerHTML = Math.round(sec);
                if (seconds.innerHTML.length == 1) {
                    seconds.innerHTML = "0" + seconds.innerHTML;
                }
            }
        } else {
            if (gameTime > game_state["game"]["time"]) {

                gameTime = game_state["game"]["time"];
                var min = Math.floor(game_state["game"]["time"] / 60);
                var sec = game_state["game"]["time"] - (min * 60);
                minutes.innerHTML = min;
                seconds.innerHTML = Math.round(sec);
                if (seconds.innerHTML.length == 1) {
                    seconds.innerHTML = "0" + seconds.innerHTML;
                }
            }
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
    if (playerName == "") {
        currentlySpectatedPlayer.style.display = "none";
    }
    else {
        currentlySpectatedPlayer.style.display = "block";

        for (let [key, value] of Object.entries(players)) {
            if (playerName == key) {
                if (value["team"] == 1) {
                    specBoostContainer.querySelector(".spec-boost").classList.add("right");
                    currentlySpectatedPlayer.querySelector(".player-container").classList.add("right");
                } else {
                    specBoostContainer.querySelector(".spec-boost").classList.remove("right");
                    currentlySpectatedPlayer.querySelector(".player-container").classList.remove("right");
                }
                console.log(key);
                currentlySpectatedPlayerName.innerHTML = key.substring(0, key.length - 2);
                currentlySpectatedPlayerImg.src = "C:/Rocket league stuff/RLOverlay/assets/img/player-images/" + key.substring(0, key.length - 2) + ".png";
                currentlySpectatedPlayer.querySelector("#spec-score").innerHTML = value["score"];
                currentlySpectatedPlayer.querySelector("#spec-assists").innerHTML = value["assists"];
                currentlySpectatedPlayer.querySelector("#spec-goals").innerHTML = value["goals"];
                currentlySpectatedPlayer.querySelector("#spec-shots").innerHTML = value["shots"];
                currentlySpectatedPlayer.querySelector("#spec-saves").innerHTML = value["saves"];
                currentlySpectatedPlayer.querySelector(".spec-boost").style.width = value["boost"] + '%';
                currentlySpectatedPlayer.querySelector(".spec-boost-number").innerHTML = value["boost"];
            }
        };
    }
}

function updatePlayers(players) {
    for (let [key, value] of Object.entries(players)) {
        //console.log(`${key}: ${value}`);
        playersEl.forEach(el => {
            if (el.querySelector(".player-name").innerHTML == key.substring(0, key.length - 2)) {
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