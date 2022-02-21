function color(e){

    num = Number(e.currentTarget.getAttribute("id").split("star")[1]);

    if(e.currentTarget.getAttribute("src").includes("black")){
        for(let index = 1; index <= num; index++){
            document.querySelector(`#star${index}`).setAttribute("src", "img/gold-star.png");
        }
    } else{
        for(let index = (num+1); index <= stars; index++){
            document.querySelector(`#star${index}`).setAttribute("src", "img/black-star.png");
        }
    }
}

rating = document.querySelector("header ul li:nth-child(2)");
const stars = 5;

for(let star = 1; star <= stars; star++){
    let img = document.createElement("img");
    img.setAttribute("src", "img/black-star.png");
    img.setAttribute("id", `star${star}`);
    img.setAttribute("class", "star");
    rating.append(img);

    img.addEventListener("click", color);
}