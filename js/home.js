let header = document.querySelector("header h1");
const title = "Golden Games";
let count = 0;
const glowTime = 125;
document.documentElement.style.setProperty("--navItems", document.querySelectorAll("header ul li").length);
const games = [];
const gameDisplay = document.querySelector("#games");

for(let letter of title){
    let single = document.createElement("span");
    single.textContent = letter;
    header.append(single);
}

function deglow(letter){
    letter.style.textShadow = "3px 3px 3px black";
}

function glow(){
    let letter = document.querySelector(`header h1 span:nth-child(${(count % title.length)+1})`);
    if(letter.textContent === " "){
        count++;
        letter = document.querySelector(`header h1 span:nth-child(${(count % title.length)+1})`);
    }
    letter.style.textShadow = "3px 3px 3px white";
    count+= 1;
    setTimeout(deglow, glowTime, letter)
}
setInterval(glow, glowTime);


class Game{

    constructor(dateCreated, mode, name, thumbnail){
        this.date = dateCreated;
        this.mode = mode;
        this.name = name;
        this.thumbnail = thumbnail;
        games.push(this);
    }
}

let minesweeper = new Game("January 10, 2022", "single", "Minesweeper", "../img/mine-thumb.PNG");
let connect4 = new Game("January 7 2022", "multi", "Connect4", "../img/connect4-thumb.PNG");

for(let game of games){
    let container = document.createElement("div");
    container.setAttribute("class", "containers")

    let anchor = document.createElement("a");
    anchor.setAttribute("href", `../${game.name}.html`)

    let img = document.createElement("img");
    img.setAttribute("src", game.thumbnail);
    
    let gameName = document.createElement("div");
    gameName.textContent = game.name;
    gameName.setAttribute("class", "gameNames");

    anchor.append(img);
    container.append(anchor);
    container.append(gameName);
    gameDisplay.append(container);
}