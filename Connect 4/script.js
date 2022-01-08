const board = document.querySelector("#board");
const rows = 6;
const columns = 7;
let player1 = true;
const DR = [-1, -1, 0, 1, 1, 1, 0, -1];
const DC = [0, 1, 1, 1, 0, -1, -1, -1];
let win;
let won = false;
let tie;
const button = document.querySelector("button");

let grid = Array.from(Array(rows), row => Array(columns));

function isTie(){
    for(let row of grid){
        for(let column of row){
            if(column === undefined){
                return false;
            }
        }
    }
    return true;
}

function connect(type, r, c){
    if(["firebrick", "turquoise"].includes(type)){
        for(let i = 0; i < DR.length; i++){
            let pairs = [grid[r][c]]
            for(let j = 1; j < 4; j++){
                let new_r = r + (j * DR[i]);
                let new_c = c + (j * DC[i]);
                if(new_r >= 0 && new_r < rows && new_c >= 0 && new_c <= columns){
                    pairs.push(grid[new_r][new_c]);
                }
            }
            if(pairs.every(word => word === type) && pairs.length === 4){
                return true;
            }
        }
    }
}

for(let r = 0; r < rows; r++){
    for(let c = 0; c< columns; c++){
        const box = document.createElement("div");
        box.style.width = `calc((50vw / ${columns})`;
        box.style.height = `calc(75vh / ${rows})`;
        box.style.backgroundColor = "royalblue";

        const circle = document.createElement("div");
        circle.setAttribute("class", "circle");
        circle.setAttribute("id", `${r},${c}`)
        circle.style.width = `calc((50vw / ${columns})`;
        circle.style.height = `calc(75vh / ${rows})`;
        circle.style.backgroundColor = "orange";
        circle.style.borderRadius = "50%";
        circle.style.transform = "scale(0.8)";

        box.append(circle);
        board.append(box);
    }
}

board.addEventListener("mousedown", (e)=>{
    if(e.target.getAttribute("class") === "circle" && !(won)){
        
        tie = isTie();
        let spot = e.target.getAttribute("id").split(",").map( num => Number(num));

        const position = spot[0] === (grid.length  - 1) || grid[spot[0] + 1][spot[1]] != undefined; //if on bottom row or ontop of another circle
        const place = e.target.style.backgroundColor === "orange"; //if on a orange circle and not on another color
    
        if(position && place && !(tie)){ //if 
            if(player1 === true){ //could check if background color !== orange, then put, fixes replacement
                e.target.style.backgroundColor = "turquoise";
                 //raise alert if placed circle is not above another circle
                grid[spot[0]][spot[1]] = "turquoise";
                win = connect("turquoise", spot[0], spot[1]);
                player1 = false;
            } else if(player1 === false){
                e.target.style.backgroundColor = "firebrick";
                grid[spot[0]][spot[1]] = "firebrick";
                win = connect("firebrick", spot[0], spot[1]);
                player1 = true;
            }
            if(win){
                if(!(player1)){
                    document.querySelector("#player1 h1").textContent = " Player 1 has won!!!"
                } else if(player1){
                    document.querySelector("#player2 h1").textContent = "Player 2 has won!!!"
                }
                won = true;
                document.querySelector("button").style.visibility = "visible";
            }
        } else{
            if(!(position)){
                alert(`PLACE YOUR CIRCLE ON THE BOTTOMOST ROW OR ON TOP ON ANOTHER CIRCLE`)
            } else if (!(place)){
                alert(`DON'T TAKE SOMEONE ELSE'S SPOT 😠`)
            } else if(tie){
                document.querySelector("button").style.visibility = "visible";
            }
        }
    }
});

button.addEventListener("click", ()=>{
    document.querySelector("button").style.visibility = "hidden";
    player1 = true;
    won = false;
    let circles = document.querySelectorAll(".circle");
    let circles_lst = Array.from(circles);
    for(let circle of circles_lst){
        circle.style.backgroundColor = "orange";
    }
    grid = Array.from(Array(rows), row => Array(columns));
    document.querySelector("#player1 h1").textContent = " Player 1";
    document.querySelector("#player2 h1").textContent = "Player 2";
})