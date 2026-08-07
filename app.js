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

  const filePath = fileMap[subject] || fileMap["hrm"];

  try {
    const response = await fetch(filePath);
    if (!response.ok) throw new Error("JSON file load nahi hui");
    
    questions = await response.json();
    document.getElementById("total").textContent = questions.length;
    loadQuestion();
  } catch (error) {
    console.error("Error loading quiz data:", error);
    document.getElementById("question").textContent = "Data load nahi hua! Kripya check karein ki 'data/" + subject + ".json' file upload hai ya nahi.";
  }
}

function loadQuestion() {
  if (!questions || questions.length === 0) return;

  const q = questions[currentIndex];

  document.getElementById("questionNo").textContent = currentIndex + 1;
  document.getElementById("question").textContent = q.question;

  const options = document.getElementById("options");
  options.innerHTML = "";

  const labels = ["A", "B", "C", "D"];

  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.innerText = labels[index] + ". " + option;

    btn.onclick = () => checkAnswer(index, btn);

    options.appendChild(btn);
  });

  document.getElementById("explanation").style.display = "none";
  document.getElementById("explanation").innerHTML = "";
}

function checkAnswer(selected, btn) {
  const q = questions[currentIndex];
  document.querySelectorAll(".option").forEach(b => b.disabled = true);

  if (selected === q.answer) {
    btn.style.background = "#28a745";
    btn.style.color = "#fff";
    btn.style.borderColor = "#28a745";
    score++;
  } else {
    btn.style.background = "#dc3545";
    btn.style.color = "#fff";
    btn.style.borderColor = "#dc3545";

    const correctBtn = document.querySelectorAll(".option")[q.answer];
    if (correctBtn) {
      correctBtn.style.background = "#28a745";
      correctBtn.style.color = "#fff";
      correctBtn.style.borderColor = "#28a745";
    }
  }

  document.getElementById("score").textContent = score;

  const expBox = document.getElementById("explanation");
  expBox.style.display = "block";
  expBox.innerHTML = "<b>Explanation:</b> " + (q.explanation || "Not Available");
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    showResult();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion();
  }
}

function showResult() {
  document.getElementById("quizBox").style.display = "none";
  document.getElementById("resultBox").style.display = "block";

  document.getElementById("finalScore").textContent = score;
  document.getElementById("finalTotal").textContent = questions.length;

  const percentage = Math.round((score / questions.length) * 100);
  document.getElementById("finalPercent").textContent = percentage + "% Score";
}

window.onload = init;
