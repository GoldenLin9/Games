let header = document.querySelector("header h1");
const title = "Golden Games";
let count = 0;
const glowTime = 125;
const games = [];
const gameDisplay = document.querySelector("#games");
const filters = document.querySelector("#filters");
const filterTags = document.querySelector("#filter-tags");
const sort = document.querySelector("#sort");
const allFilters = [];
const searchBtn = document.querySelector("#search button");
const search = document.querySelector("#search");
const searchBox = document.querySelector("#searchBox");

const aside = document.querySelector("aside");
const main = document.querySelector("main")

function displayAside(){
    let side = document.createElement("div");
    let x = document.createElement("img");

    x.setAttribute("id", "sideX");
    x.setAttribute("src", "img/x.png")
    side.setAttribute("id", "side");

    side.append(x);
    side.append(aside);
    document.querySelector("body").append(side);

    x.addEventListener("click", ()=>{
        document.querySelector("#side").remove();
    })
}

window.addEventListener("resize", ()=>{
    if(window.matchMedia("(max-width: 700px)").matches && main.contains(aside)){
        filters.options[0].textContent = "";
        sort.options[0].textContent = ""
        aside.remove();
        if(!(search.querySelector("#hamburger"))){
            let hamburger = document.createElement("button");
            hamburger.setAttribute("id", "hamburger");
            document.querySelector("#center").append(hamburger);
            hamburger.addEventListener("click", displayAside)
        }
    } else if(window.matchMedia("(min-width:701px)").matches && !(main.contains(aside))){ // >680px and 
        filters.options[0].textContent = " -- select an option -- ";
        sort.options[0].textContent = " -- select an option -- "
        main.append(aside);
        document.querySelector("#hamburger").remove();

    }
})

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

    constructor(dateCreated, filter, name, thumbnail, gameLink){
        this.date = dateCreated;
        this.filter = filter;
        this.name = name;
        this.thumbnail = thumbnail;
        this.link = gameLink;
        games.push(this);
    }
}

let minesweeper = new Game("January 10, 2022", {competitive: "comp", mode: "single"}, "Minesweeper", "../img/mine-thumb.PNG", "../Minesweeper.html");
let connect4 = new Game("January 7 2022", {competitive: "not comp", mode: "multi"}, "Connect 4", "../img/connect4-thumb.PNG", "../Connect4.html");

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
            for(let game of games){
                gameFilters = Object.values(game.filter);

                if(allFilters.some(filter=> gameFilters.includes(filter)) && !(gamesCopy.includes(game))){
                    gamesCopy.push(game)
                } else if(!(allFilters.some(filter=> gameFilters.includes(filter))) && gamesCopy.includes(game)){
                    gamesCopy.splice(gamesCopy.indexOf(game), 1);
                }
            }
            break;

        case "new":
            gamesCopy.sort((f,s)=>{ //Date bigger dates are > smaller and we want big
                if(new Date(f.date) > new Date(s.date)){ //newer
                    return -1;
                } else{
                    return 1;
                }
            });
            break;

        case "alphabetical":
            gamesCopy.sort((a,b)=> (a.name === b.name) ? 0: (a.name > b.name) ? 1: -1);
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
                displayOrder("filter");
                deletedItem.remove();
            })
            btn.setAttribute("id", "x");
            filterTags.append(box);
            filterTags.append(btn);
        } else{
            filterTags.insertBefore(box, document.querySelector("#x"));
        }
        allFilters.push(filters.value);
        displayOrder("filter");
    }
});

sort.addEventListener("change", ()=>{
    displayOrder(sort.value);
});

function displayGames(e){
    e.currentTarget.style.borderRadius = "1em 1em 0 0";

    if(e.currentTarget.value.length >= 1){
        for(let game of games){
            if(!(game.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) === -1)){
                const index = game.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase());
                if(!(searchBox.contains(document.getElementById(game.name)))){
                    let anchor = document.createElement("a");
                    let showBox = document.createElement("div");
                    let text = document.createElement("p");

                    anchor.setAttribute("href", game.link);
                    text.innerHTML = `${game.name.slice(0,index)}<strong>${game.name.slice(index, index + e.currentTarget.value.length + 1)}</strong>${game.name.slice(e.currentTarget.value.length + 1 + index, game.name.length)}`;
                    showBox.setAttribute("id", game.name)
                    showBox.setAttribute("class", "gameSearches")
                    
                    showBox.append(text);
                    anchor.append(showBox);
                    searchBox.append(anchor);
                } else if(searchBox.contains(document.getElementById(game.name))){
                    document.getElementById(game.name).innerHTML = `${game.name.slice(0,index)}<strong>${game.name.slice(index, index + e.currentTarget.value.length)}</strong>${game.name.slice(e.currentTarget.value.length + index, game.name.length)}`;
                }
            
            } else if(game.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) === -1 && searchBox.contains(document.getElementById(game.name))){
                document.getElementById(game.name).remove();
            }
        }
        
        let notFound = document.querySelector("#notFound");

        if(!(searchBox.querySelector(".gameSearches"))){ //if no games
            if(!(notFound)){ // if not appended the not found sign
                let notFound = document.createElement("div");
                notFound.setAttribute("id", "notFound");
                notFound.innerHTML = `<strong>Not found</Strong>`;
                searchBox.append(notFound);
            }
        } else{ //if there are games
            if(notFound){ // then remove the not found sign
                notFound.remove();
            }
        }
    } else{
        for(let div of document.querySelectorAll("#searchBox div")){
            div.remove();
        }
    }
}

//clicked = add text box & "X" click "X" = add search
searchBtn.addEventListener("click", ()=>{

    if(!(search.querySelector("#search input"))){ //if button is search else do the x thing
        searchBtn.style.backgroundImage = `url(../img/x.png)`;

        let input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Search Games");
        searchBox.append(input);

        input.focus();
        input.addEventListener("input", displayGames);

    } else if(search.querySelector("#search input")){ //text box found
        while(searchBox.firstChild){
            searchBox.firstChild.remove();
        }
        searchBtn.style.backgroundImage = `url("../img/search.png")`;
    }
})
