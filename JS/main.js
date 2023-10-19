const countSpan = document.querySelector(".count span");
const bulletsSpanContainer = document.querySelector(".bullets .spans");
const MainBullet = document.querySelector(".bullets");
const quizArea = document.querySelector(".quiz-area");
const answerArea = document.querySelector(".answer-area");
const submitBtn = document.querySelector(".submit-btn");
const resultsDiv = document.querySelector(".result");
const countDownElement = document.querySelector(".countdown");

// Set option
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

// Function to get question
function getQuestion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onload = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionObject = JSON.parse(this.responseText);

      let qCount = questionObject.length;

      //Count Down Function
      countDown(60, qCount);

      //create bullet and set questions count
      createBullets(qCount);

      //Add questions Data
      addQuestionData(questionObject[currentIndex], qCount);

      submitBtn.onclick = () => {
        let rightAnswer = questionObject[currentIndex].right_answer;

        // Countdown
        clearInterval(countdownInterval);
        countDown(60, qCount);

        // Increase CurrentIndex
        currentIndex++;

        //Check The Answer
        checkAnswer(rightAnswer, qCount);

        // Remove previous question
        quizArea.innerHTML = ``;
        answerArea.innerHTML = ``;

        addQuestionData(questionObject[currentIndex], qCount);

        // Handel bullets
        handelBullets();

        // Show result
        showResult(qCount);
      };
    }
  };

  myRequest.open("GET", "JS/html_question.json");
  myRequest.send();
}

getQuestion();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let span = document.createElement("span");
    bulletsSpanContainer.appendChild(span);
    if (i === 0) {
      span.className = "on";
    }
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // create h2
    let questionTitle = document.createElement("h2");
    questionTitle.appendChild(document.createTextNode(obj.title));

    quizArea.appendChild(questionTitle);

    // Create Answers
    for (let i = 1; i <= 4; i++) {
      // Main Div
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";
      answerArea.appendChild(mainDiv);

      // radio
      let radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "question";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      mainDiv.appendChild(radioInput);
      // label
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      label.appendChild(document.createTextNode(obj[`answer_${i}`]));

      mainDiv.appendChild(label);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("good");
  }
}

function handelBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpan = Array.from(bulletsSpan);

  arrayOfSpan.forEach((span, index) => {
    if (index === currentIndex) {
      span.className = "on";
    }
  });
}

function showResult(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answerArea.remove();
    submitBtn.remove();
    MainBullet.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `Result is <span class="good">Good</span> [${rightAnswers} from ${count}]`;
    } else if (rightAnswers === count) {
      theResults = `Result is <span class="perfect">Perfect</span>, All answer is right`;
    } else {
      theResults = `Result is <span class="bad">Bad</span> [${rightAnswers} from ${count}]`;
    }
    resultsDiv.innerHTML = theResults;
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countDownElement.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}
