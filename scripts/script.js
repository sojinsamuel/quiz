const toRules = document.querySelector('.next_btn');
const toGame = document.querySelector('.small_next_bth');

toRules.onclick = () => {
    document.location.replace("pages/rules.html");
}
toGame.onclick = () => {
    document.location.replace("game.html");
   
}


