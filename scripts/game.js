const chooseBtn = document.querySelector('#check_btn');
const modal = document.querySelector('.modal');
const answersList = document.querySelector('.answers_list');
const questionField = document.querySelector('#question');
const prizeSum = document.querySelector("#prize_sum");
const varA = document.querySelector('#varA');
const varB = document.querySelector('#varB');
const varC = document.querySelector('#varC');
const varD = document.querySelector('#varD');

const fifty = document.querySelector('.fifty_fifty');
const phone = document.querySelector('.phone_friend');

let userAnswer = [];
let currCorrect;
let lastQuestions = [];
let currSum = 0;
let questionNum = 0;
let winningSum = 0;

window.onload = () => {
  renderQuestion()
};


let opacity = [];

function lifeline_fifty() {

  let variants = ['A', 'B', 'C', 'D'];
  let disable = new Set();
  while (disable.size != 2) {
    let num = Math.floor(Math.random() * 4);
    if (variants[num] !== currCorrect) {
      disable.add(document.querySelector(`#${variants[num]}`))
      opacity.push(document.querySelector(`#var${variants[num]}`))
    }
  }

  disable.forEach(element => element.disabled = 'true');
  opacity.forEach(elem => elem.style.opacity = '.5')

  fifty.disabled = 'true';
  fifty.style.opacity = '.5'
};

fifty.onclick = lifeline_fifty;

function lifeline_phone() {

  let varLetters = ['A', 'B', 'C', 'D']
  let variants = [document.querySelector(`#varA`), document.querySelector(`#varB`), document.querySelector(`#varC`), document.querySelector(`#varD`)]
  if (opacity.length !== 0) {
    variants.forEach((elem, index) => {
      if (elem === opacity[0] || elem === opacity[1]) {
        variants.splice(index, 1);
      }
    })
  }
  let num = Math.floor(Math.random() * variants.length);

  let friend_variant = variants[num].innerHTML;

  showModal(`Ваш друг считает, что правильный ответ - ${friend_variant}`, 'Выбрать этот ответ', "Вернуться к выбору");
  modal.querySelector('button').onclick = () => {
    userAnswer.push(varLetters[num])
    chooseClick()
  };
  modal.querySelector('#modal_close_btn').onclick = hideModal;
  phone.disabled = 'true';
  phone.style.opacity = '.5';
}

phone.onclick = lifeline_phone;

function jsonDecode(json) {
  let arr = JSON.parse(json);
  return arr;
}

function randomizer(arr) {
  let len = arr.length;
  return Math.floor(Math.random() * len);
}

function addQuestion(arr) {
  let newArr = jsonDecode(arr);
  let num = randomizer(newArr);
  if (!lastQuestions.includes(newArr[num].question)) {
    lastQuestions.push(newArr[num].question);
    questionField.innerHTML = newArr[num].question;
    varA.innerHTML = newArr[num].A;
    varB.innerHTML = newArr[num].B;
    varC.innerHTML = newArr[num].C;
    varD.innerHTML = newArr[num].D;
    currCorrect = newArr[num].Correct;
  } else {
    addQuestion(arr)
  }
}



answersList.addEventListener("change", function (event) {
  chooseBtn.disabled = false;
  userAnswer.push(event.target.id);

  if (questionNum % 4 === 0) {
    setTimeout(showModal, 500, 'Вы уверены?', "Да", "Нет");

    modal.querySelector('button').onclick = chooseClick;
    modal.querySelector('#modal_close_btn').onclick = hideModal;
  }
})

function removeChecked() {
  let array = Array.from(document.querySelectorAll('.radio_input'));
  array.forEach(function (element) {
    element.checked = false;
    element.disabled = false;
  })
  let arraySpan = Array.from(document.querySelectorAll('.answer_text'));
  arraySpan.forEach(elem => elem.style.opacity = '1')
}


function changePrize(num) {
  const sums = [0, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
  prizeSum.innerHTML = sums[num];
}


function checkAnswer() {
  if (currCorrect === userAnswer[userAnswer.length - 1]) {
    return true;
  } else {
    return false;
  }
};


chooseBtn.addEventListener('click', function () {
  if (questionNum < 15) {
    chooseClick()
  } else {
    if (checkAnswer()) {
      ++currSum;
      changePrize(currSum)
      showModal(`${prizeSum.innerHTML} Ваши!`, 'Завершить');
      modal.querySelector('#modal_btn').onclick = () => {
        sessionStorage.setItem('prizeSum', JSON.stringify(prizeSum.innerHTML));
        sessionStorage.setItem('action', JSON.stringify(3));
        window.location.replace('final.html');
      }
    }
  }
})

function chooseClick() {
  if (checkAnswer()) {
    ++currSum;
    changePrize(currSum)
    userAnswer.length = 0;
    chooseBtn.disabled = true;
    showModal(`${RIGHT_ANSWERS[randomizer(RIGHT_ANSWERS)]} Заберете ${prizeSum.innerHTML} или продолжите играть?`, "Продолжить", 'Завершить')
    modal.querySelector('#modal_btn').onclick = () => {
      hideModal();
      renderQuestion();
      removeChecked();
    }
    modal.querySelector('#modal_close_btn').onclick = () => {
      sessionStorage.setItem('prizeSum', JSON.stringify(prizeSum.innerHTML));
      sessionStorage.setItem('action', JSON.stringify(1));
      window.location.replace('final.html')
    }

  } else {
    if (winningSum === 0) {
      showModal('Вы дали неверный ответ, но всегда можно попробовать еще раз!', 'Играть')
      modal.querySelector('button').onclick = () => document.location.replace("../index.html");
    } else {
      sessionStorage.setItem('action', JSON.stringify(2));
      showModal(`Вы дали неверный ответ, но все равно забираете ${winningSum}!`, 'Завершить');
      modal.querySelector('button').onclick = () => document.location.replace("final.html");
    }
  }
}


function showModal(text, btn, btn2) {
  document.querySelector('.opacity').style.opacity = '0.4';
  if (btn2 === undefined) {
    modal.querySelector('#modal_close_btn').style.display = 'none';
  }
  modal.querySelector('h1').innerHTML = text;
  modal.querySelector('#modal_btn').innerHTML = btn;
  modal.querySelector('#modal_close_btn').innerHTML = btn2;
  modal.classList.add('display_modal');

}

function hideModal() {
  modal.classList.remove('display_modal');
  document.querySelector('.opacity').style.opacity = '1';
}


function renderQuestion() {
  questionNum++;
  if (questionNum <= 5) {
    addQuestion(FIRST_LEVEL_QUESTIONS);
  } else if (questionNum > 5 && questionNum <= 10) {
    if (questionNum === 6) {
      winningSum = prizeSum.innerHTML;
      sessionStorage.setItem('winningSum', JSON.stringify(winningSum));
      showModal(`Текущая сумма Вашего выиграша неcгораемая, ${prizeSum.innerHTML} уже у Вас в кармане!`, 'Продолжить', "Забрать деньги");
      modal.querySelector('button').onclick = hideModal;
    }
    addQuestion(SECOND_LEVEL_QUESTIONS);
  } else if (questionNum > 10 && questionNum <= 15) {
    if (questionNum === 11) {
      winningSum = prizeSum.innerHTML;
      sessionStorage.setItem('winningSum', JSON.stringify(winningSum));
      showModal(`Текущая сумма Вашего выиграша неcгораемая, ${prizeSum.innerHTML} уже у Вас в кармане!`, 'Продолжить', "Забрать деньги");
      modal.querySelector('button').onclick = hideModal;
    }
    addQuestion(THIRD_LEVEL_QUESTIONS);
  }
}



/*
var reloaded  = function(){} //страницу перезагрузили

function checkIfReload() {
  var loaded = sessionStorage.getItem('loaded');
  if(loaded) {
    reloaded();
  } else {
    sessionStorage.setItem('loaded', true);
  }
}
*/