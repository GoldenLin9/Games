let header = document.querySelector("header h1");
const title = "Golden Games";
let count = 0;
const glowTime = 125;
document.documentElement.style.setProperty("--navItems", document.querySelectorAll("header ul li").length);
const games = [];
const gameDisplay = document.querySelector("#games");
const filters = document.querySelector("#filters");
const filterTags = document.querySelector("#filter-tags");
const sort = document.querySelector("#sort");
const allFilters = [];

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

    constructor(dateCreated, mode, name, thumbnail, gameLink){
        this.date = dateCreated;
        this.mode = mode;
        this.name = name;
        this.thumbnail = thumbnail;
        this.link = gameLink;
        games.push(this);
    }
}

let minesweeper = new Game("January 10, 2022", "single", "Minesweeper", "../img/mine-thumb.PNG", "../Minesweeper.html");
let connect4 = new Game("January 7 2022", "multi", "Connect 4", "../img/connect4-thumb.PNG", "../Connect4.html");

function displayContent(array){

    while(document.querySelector("#games").firstElementChild){
        document.querySelector("#games").firstElementChild.remove();
    }

    if(array.length === 0){
        array = games.map(thing => thing);
        gamesCopy = games.map(thing => thing);
    } 

    for(let game of array){
        let container = document.createElement("div");
        container.setAttribute("class", "containers")
    
        let anchor = document.createElement("a");
        anchor.setAttribute("href", game.link)
    
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
}
displayContent(games);

let gamesCopy = games.map(thing => thing);
function displayOrder(operation){ // filter arrays using switch and passing new array

    switch(operation){
        case "filter":
            for(let r = 0; r < games.length; r++){
                if(allFilters.includes(games[r].mode) && !(gamesCopy.includes(games[r]))){
                    gamesCopy.push(games[r])
                } else if(!(allFilters.includes(games[r].mode) && gamesCopy.includes(games[r]))){
                    gamesCopy.splice(gamesCopy.indexOf(games[r]), 1);
                }
            }
            break;
    }
    displayContent(gamesCopy)
}

filters.addEventListener("change", ()=>{
    let tag = `${filters.options[filters.selectedIndex].text}`;
    let spans = document.querySelectorAll("#filter-tags span");
    if(Array.from(spans).every(word => word.textContent !== tag)){
        box = document.createElement("span");
        box.setAttribute("class", "tag");
        box.textContent = tag;
        if(spans.length === 0){
            let btn = document.createElement("button");
            btn.addEventListener("click", ()=>{
                let spanCount = document.querySelectorAll("#filter-tags span").length;
                if(spanCount === 1){
                    document.querySelector("#x").remove();
                    filters.selectedIndex = 0;
                }
                let deletedItem = document.querySelector(`#filter-tags span:nth-child(${spanCount})`);
                allFilters.pop();
                displayOrder("filter")
                deletedItem.remove();
            })
            btn.setAttribute("id", "x")
            btn.textContent = "X";
            filterTags.append(box);
            filterTags.append(btn);
        } else{
            filterTags.insertBefore(box, document.querySelector("#x"));
        }
        allFilters.push(filters.value);
        displayOrder("filter");
    }
});
