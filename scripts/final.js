let action = sessionStorage.getItem('action');

let prizeSum = sessionStorage.getItem('prizeSum');
let winningSum = sessionStorage.getItem('winningSum');

if (JSON.parse(action) == 1) {
    document.querySelector(".game_over").innerHTML = `Вы выиграли ${JSON.parse(prizeSum)}! Еще круг?`;
} else if (JSON.parse(action) == 2) {
    document.querySelector(".game_over").innerHTML = `Вы выиграли ${JSON.parse(winningSum)}! Еще круг?`;
} else {
    document.querySelector(".game_over").innerHTML = `Вы абсолютный победитель! ${JSON.parse(prizeSum)} Ваши!  Еще круг?`;
}




const btn = document.querySelector('.next_btn');
btn.onclick = () => window.location.replace('../index.html')