
const urlParams = new URLSearchParams(window.location.search);
const subject = urlParams.get("subject") || "hrm";

let questions = [];
let currentIndex = 0;
let score = 0;

async function init() {
  const fileMap = {
    hrm: "data/hrm.json",
    material: "data/material.json",
    computer: "data/computer.json"
  };

  const response = await fetch(fileMap[subject]);
  questions = await response.json();

  document.getElementById("total").textContent = questions.length;
  loadQuestion();
}

function loadQuestion() {
  const q = questions[currentIndex];

  document.getElementById("questionNo").textContent = currentIndex + 1;
  document.getElementById("question").textContent = q.question;

  const options = document.getElementById("options");
  options.innerHTML = "";

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = option;

    btn.onclick = () => checkAnswer(index, btn);

    options.appendChild(btn);
  });

  document.getElementById("explanation").innerHTML = "";
}

function checkAnswer(selected, btn) {

  document.querySelectorAll(".option").forEach(b => b.disabled = true);

  if (selected === questions[currentIndex].answer) {
    btn.style.background = "#28a745";
    score++;
  } else {
    btn.style.background = "#dc3545";

    document.querySelectorAll(".option")[questions[currentIndex].answer].style.background="#28a745";
  }

  document.getElementById("score").innerHTML = score;

  document.getElementById("explanation").innerHTML =
      "<b>Explanation:</b> " + (questions[currentIndex].explanation || "Not Available");
}

function nextQuestion() {

  if(currentIndex < questions.length-1){
      currentIndex++;
      loadQuestion();
  }else{
      alert("Quiz Completed!\nYour Score : "+score+" / "+questions.length);
  }

}

function prevQuestion(){

  if(currentIndex>0){
      currentIndex--;
      loadQuestion();
  }

}

window.onload = init;
