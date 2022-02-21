const colors = ["orange", "indigo", "magenta", "silver", "teal", "yellow", "purple", "fuchsia", "sage green", "beige"];
const clothing = ["sweatshirt", "jacket", "scarf", "turtleneck", "pants", "shoes", "shorts", "dress", "skirt", "socks"];
const seaAnimals = ["octopus", "shark", "squid", "puffer fish", "starfish", "lionfish", "manatee", "sea urchin", "lobster"];
const countries = ["Venezuela", "Uruguay", "Canada", "Czechoslovakia", "Germany", "Singapore", "Belarus", "Paraguay", "Guatemala", "Taiwan"];
const celebrities = ["Tom Cruise", "Brad Pitt", "Leonardo DiCaprio", "Angelina Jolie", "Jennifer Aniston", "Taylor Swift", "Kourtney Kardashian", "Emma Stone", "Steve Carell", "Johnny Depp"];
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const fruits = ["strawberry", "pineapple", "grapefruit", "mango", "papaya", "blueberry", "pomegranate", "avocado", "watermelon", "cantaloupe"];
const vegetables = ["carrot", "broccoli", "cabbage", "asparagus", "cauliflower", "brussels sprout", "arugula", "celery", "artichoke", "mushroom"];
const expressions = ["busy as bee", "better late than never", "sticks out like a sore thumb", "absence makes the heart grow fonder", "practice makes perfect", "blood is thicker than water", "easy as pie", "fish out of water", "last but not least", "raining cats and dogs"];
const vehicles = ["motorcycle", "airplane", "truck", "steamboat", "train", "bus", "car", "bicycle", "skateboard", "electric scooter"];
const instruments = ["trumpet", "saxophone", "guitar", "piano", "trombone", "flute", "clarinet", "cow bell", "keyboard", "drums"];
const categories = [[fruits, "fruits"], [vegetables, "vegetables"], [expressions, "expressions"], [vehicles, "vehicles"], [instruments, "instruments"], [celebrities, "celebrities"], [colors, "colors"], [clothing, "clothing"], [seaAnimals, "seaAnimals"], [countries, "countries"]];
let word;
let category;
let pair;
let guessBank = document.querySelector("#guess");
let letterBank = document.querySelector("#words");
const wrongBox = document.querySelector("#wrong");
const bodyParts = Array.from(document.querySelector("#hang").children).slice(3);
let lives = bodyParts.length;
 
function newWord(){
   pair = categories[Math.floor(Math.random() * (categories.length -1))];
   category = pair[1];
   word = pair[0][Math.floor(Math.random() *  (pair[0].length-1))];
}
 
function guess(){//split between spaces and make words

    for(let part of word.split(" ")){
        let container = document.createElement("div");
        for(let letter of Array.from(part)){
            let mini = document.createElement("div");
            mini.textContent = letter;
            mini.setAttribute("class", "block");
            container.append(mini);
        }
        guessBank.append(container);
        container.setAttribute("class", "container");
    }    
}
 
function alpha(){
   for(let letter of letters){
       let block = document.createElement("button");
       block.setAttribute("class", "letter");
       block.textContent = letter;
       letterBank.appendChild(block);
   }
}
 
newWord();
guess();
alpha();

function endGame(condition){
    let container = document.querySelector("body");
    let box = document.createElement("div");
    let text = document.createElement("h1");
    let text2 = document.createElement("h1");
    box.setAttribute("id", "box");

 
    if(condition === "lose"){
        text.textContent = "YOU LOST, BOO HOO!";
        text.style.color = "red";
        text2.textContent = `Correct Answer: ${word}`
        text2.style.color = "red";
    } else if(condition === "win"){
        text.textContent = "CONGRATULATIONS, YOU SAVED HANGMAN!";
        text.style.color = "lawngreen";
    }


    box.append(text);
    box.append(text2)
    container.append(box);

    let restart = document.querySelector("button");
    restart.textContent = "PLAY AGAIN";
    restart.style.margin = "2em";
    restart.style.backgroundColor = "gold";
    restart.style.cursor = "pointer";
    restart.addEventListener("click", ()=>{
        let box = document.querySelector("#box");
        box.remove();
        newWord();

        allLimbs = document.querySelector("#hang");
        limbs = allLimbs.children;
        for(let i = 0; i < limbs.length; i++){
            limbs[i].style.visibility = "visible";
        }

        if(lives<= 4){
            document.querySelector("#hint").remove();
        }
        
        let wrongs = document.querySelectorAll(".wrongs");
        for(let a of wrongs){
            a.remove();
        }

        let container = document.querySelectorAll(".container");
        for(let a of container){
            a.remove();
        }

        guess();

        while(letterBank.firstChild){
            letterBank.firstChild.remove();
        }
        alpha();

        lives = bodyParts.length;
    });
    
    box.append(restart);
}

function win(){ //spaghetti
    let allBlocks = document.querySelectorAll(".block");

    for(let block of allBlocks){
        if(block.style.color !== "black"){
            return false; 
        }
    }

    return true;

}
 
letterBank.addEventListener("click", (e)=>{
    if(e.target.getAttribute("class") === "letter"){
        let blocks = document.querySelectorAll("#guess .block");
        let match = false
        for(let block of blocks){
            if(block.textContent === String(e.target.textContent).toLowerCase() || block.textContent === String(e.target.textContent).toUpperCase()){
                match = true
                block.style.color = "black";
            }
        }
     
        if(match){
             e.target.style.backgroundColor = "rgba(0,0,0,.5)";
             e.target.style.cursor = "not-allowed";

             if(win()){
                endGame("win")
             }
        } else{

            let letterBlock = e.target;
            letterBlock.style.visibility = "hidden";

            let wrongLetter = document.createElement("button");
            wrongLetter.textContent = letterBlock.textContent;
            wrongBox.append(wrongLetter);
            wrongLetter.setAttribute("class", "wrongs");

            bodyParts[lives-1].style.visibility = "hidden";

            if(lives === 1){
                endGame("lose");
            } else if(lives === 4){
                let hintBox = document.querySelector("#hints");
                let container = document.createElement("h2");
                container.setAttribute("id", "hint")
                container.textContent = `Category: ${category}`;
                hintBox.append(container);
                lives--;
            }else{
                lives--;
            }
        }
    }
});
