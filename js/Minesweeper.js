const board = document.querySelector("#grid");
const btn = document.querySelector("#btn");
let columns = 10;
let rows = 8;
let blockSize = "5vw";
let bombs = 10;
const DR = [-1, -1, 0, 1, 1, 1, 0, -1];
const DC = [0, 1, 1, 1, 0, -1, -1, -1]
let first = true;
let running = true;
let flags = bombs;
let flagging = false;
let selection = document.querySelector("#levels");
let flagCount = document.querySelector("#flagBox h1");

let grid = Array.from(Array(rows), row => Array(columns));
//free, clear, bomb
//free = starting spaces that you get
//clear = you work to actually clear it
//bomb = you lose
//cleared = background cleared

function settings(col, row, block, NumBombs){
    columns = col;
    rows = row;
    blockSize = block;
    bombs = NumBombs;
    flags = bombs;
}

createBoard();

selection.addEventListener("click", ()=>{
    selection.style.backgroundColor = selection.selectedOptions[0].value;
    let level = selection.selectedOptions[0].textContent;
    switch(level){
        case "easy":
            settings(10, 8, "5vw", 10);
            break;
        case "medium":
            settings(15,11, "4vw", 20);
            break;
        case "hard":
            settings(20, 13, "3.5vw", 40);
            break;
        case "expert":
            settings(30,16, "2.5vw", 99);
            break;
        case "impossible":
            settings(33,17, "2.3vw", 150);
            break;
    }
    while(board.firstChild){
        board.removeChild(board.firstChild);
    }
    createBoard();
    board.style.width = `calc(${blockSize} * ${columns})`;
    running = true;
    grid = Array.from(Array(rows), row => Array(columns));
    first = true;
})

function randColor(){
    return Math.floor(Math.random() * 256);
}

board.addEventListener("contextmenu", e =>{
    e.preventDefault();
})

function firstClear(spot){
    grid[spot[0]][spot[1]] = "free";
    let around = [];

    for(let d = 0; d < DR.length; d++){
        new_r = spot[0]+DR[d];
        new_c = spot[1] + DC[d];
        if(new_r >= 0 && new_r < rows && new_c >= 0 && new_c < columns){
            around.push([new_r, new_c]);
        }
    }

    let num = Math.floor(Math.random() * around.length);
    grid[around[num][0]][around[num][1]] = "free";
    around.splice(num, 1);
    
    for(let place of around){
        if(Math.random() < 0.5){
            grid[place[0]][place[1]] = "free";
        }
    }

    for(let r = 0; r < rows; r++){
        for(let c = 0; c <columns; c++){
            if(grid[r][c] === "free"){
                for(let d = 0; d< DR.length; d++){
                    new_r = r + DR[d];
                    new_c = c + DC[d];
                    if(new_r >= 0 && new_r < rows && new_c >= 0 && new_c < columns && grid[new_r][new_c] !== "free"){
                        grid[new_r][new_c] = "clear";
                    }
                }
            }
        }
    }
}

function checkWin(){
    //if not bomb && background is not none then not win 
    for(let r = 0; r < rows; r++){
        for(let c = 0; c< columns; c++){
            let square = document.getElementById(`${r},${c}`);
            if(square.style.backgroundImage !== "none" && grid[r][c] !== "bomb"){
                return false
            }
        }
    }
    return true;
}

function clean(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c< columns; c++){
            let square = document.getElementById(`${r},${c}`);
            square.textContent = "";
            square.style.backgroundImage = `url(../img/block.png)`;
            //might have a bomb problem since i didnt' delete pic
        }
    }
}

function plantBombs(bombs, spot){
    firstClear(spot);
    const coordinates = [];
    while(bombs > 0){
        let row = Math.floor(Math.random() * rows);
        let column = Math.floor(Math.random() * columns);
        if(grid[row][column] === undefined){
            grid[row][column] = "bomb";
            let place = document.getElementById(`${row},${column}`);
            let bomb = document.createElement("img");
            bomb.setAttribute("class", "bomb");
            bomb.setAttribute("src", "../img/bomb.png");
            bomb.style.width = `${blockSize}`;
            bomb.style.height = `${blockSize}`;
            bomb.style.transform = "scale(0.8)";
            place.append(bomb);
            coordinates.push([row,column]);
            bombs--;
        }
    }

    for(let point of coordinates){
        for(let d = 0; d< DR.length; d++){

            incR = point[0] + DR[d];
            incC = point[1] + DC[d];
            if(incR >= 0 && incR < rows && incC >= 0 && incC < columns && grid[incR][incC] !== "bomb"){
                if([undefined, "free", "clear"].includes(grid[incR][incC])){
                    grid[incR][incC] = 1;
                } else{
                    grid[incR][incC] += 1
                }
            }
        }
    }
}

function clear(spot){
    let open = document.getElementById(`${spot[0]},${spot[1]}`);
    if(Number.isFinite(grid[spot[0]][spot[1]])){
        open.style.backgroundImage = "none";

        let num = document.createElement("div");
        num.style.fontSize = blockSize;
        num.setAttribute("class", "num");
        let numBlock = document.getElementById(`${spot[0]},${spot[1]}`);
        num.textContent = `${grid[spot[0]][spot[1]]}`;
        numBlock.append(num);

        grid[spot[0]][spot[1]] = "cleared";

        return
    } else{
        open.style.backgroundImage = "none";
        grid[spot[0]][spot[1]] = "cleared";
        for(let d = 0; d <DR.length; d++){
            newR = spot[0] + DR[d];
            newC = spot[1] + DC[d];
            if(newR >= 0 && newR < rows && newC >= 0 && newC < columns && grid[newR][newC] !== "bomb" && grid[newR][newC] !== "cleared"){
                clear([newR,newC]);
            }
        }
    }
}

function createBoard(){
    flagCount.textContent = `Flags: ${flags}`;
    for(let r = 0; r < rows; r++){
        let row = document.createElement("div");
        row.setAttribute('class', "row");
        for(let c = 0; c < columns; c++){
            let block = document.createElement("div");
            block.style.width = blockSize;
            block.style.height = blockSize;
            (r % 2 === 0 && c % 2 === 1) ? block.style.backgroundColor = "rgb(67, 176, 71)": (r % 2 === 1 && c % 2 === 0) ? block.style.backgroundColor = "rgb(67, 176, 71)": block.style.backgroundColor = 
            "rgb(251, 208, 0)";
            block.style.backgroundSize = blockSize;
            block.setAttribute("class", "block");
            block.setAttribute("id", `${r},${c}`);
            row.append(block);
        }
        board.append(row);
    }
}

board.addEventListener("click", (e)=>{
    if(running && btn.style.backgroundColor !== "red"){
        let spot = e.target.getAttribute("id").split(",").map(num => Number(num));

        if(first){
            plantBombs(bombs, spot);
            first = false;
        }
    
        if(grid[spot[0]][spot[1]] === "bomb"){
            const allBombs = document.querySelectorAll(".bomb");
            console.log(allBombs);
            for(let bomb of allBombs){
                bomb.style.visibility = "visible";
                bomb.parentElement.style.backgroundImage = "none";
                bomb.parentElement.style.backgroundColor = `rgb(${randColor()},${randColor()},${randColor()})`;
            }
            alert(`BOOM! The city exploded : (`)
            running = false;
        } else{
            clear(spot);
        }

        let win = checkWin();
        if(win && !(first)){
            alert(`YAY, you saved city from the bombs being set off!!!`)
            grid = Array.from(Array(rows), row => Array(columns));
            first = true;
            flags = bombs;
            flagCount.textContent = `Flags: ${flags}`;
            clean();
        }
    }

// set timer, reset game, bomb flashing, Leaderboard for how fast? timer, resets whenever change difficulty or win
// save princess peach mario vs bowser
//first click of when changing difficulty says i saved city
//hover opacity can see background
});

board.addEventListener("mousedown", e =>{
    if(running && (e.button === 2 || flagging)){
        let taken = e.target.getAttribute("class") === "flag";
        if(taken){
            e.target.remove();
            flags++;
        } else if(flags > 0){
            let flag = document.createElement("img");
            flag.setAttribute("src", "../img/flag.png");
            flag.setAttribute("class", "flag");
            flag.style.width = blockSize;
            flag.style.height = blockSize;
            e.target.append(flag);
            flags--;
        }
        flagCount.textContent = `Flags: ${flags}`;
        flagging = false;
        setTimeout(change, 100);
    }
});

function change(){
    btn.style.backgroundColor = "white";
}

btn.addEventListener("click", ()=>{
    if(!(flagging)){
        flagging = true;
        btn.style.backgroundColor = "red";
    } else if(flagging){
        flagging = false;
        btn.style.backgroundColor = "white";
    }
});
