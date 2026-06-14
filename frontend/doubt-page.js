let allanswers = [];
function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const seconds = Math.floor((now - past) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  return `${days} day${days > 1 ? "s" : ""} ago`;
}
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function getDoubtById(id) {
  const res = await fetch(`/api/doubts/${id}`);
  const data = await res.json();

  display(data[0]);
}

function display(data) {
  const displaydoubt = document.querySelector(".question-box");

  const postedTime = timeAgo(data.created_at);

  const answerText =
    data.answers_count === 0
      ? "No answers yet"
      : `${data.answers_count} answer${data.answers_count > 1 ? "s" : ""}`;

  displaydoubt.innerHTML = `
    <span class="badge-maths">${data.subject}</span>
    <p class="question-title">${data.question}</p>
    <p class="question-meta">${postedTime} · ${answerText}</p>
  `;
}
async function getAnswers() {
  const res = await fetch(`/api/doubts/${id}/answers`)
  const answers = await res.json()
  // display answers
  allanswers=answers;
  displayanswers(allanswers);
}
function displayanswers(answers) {
  const answercount = document.querySelector(".answers-count");

  const answerText =
    answers.length === 0
      ? "No answers yet"
      : `${answers.length} answer${answers.length > 1 ? "s" : ""}`;

  answercount.textContent = `💬 ${answerText}`;

  const display_answers = document.getElementById("answers-container");
  display_answers.innerHTML = "";

  if (!answers || answers.length === 0) {
    display_answers.innerHTML = `
      <div class="no-data">
        No answers found 😕
      </div>
    `;
    return;
  }

  answers.forEach(element => {
    const card = document.createElement("div");
    card.className = "answer-box";

    const postedTime = timeAgo(element.created_at);

    card.innerHTML = `
      <div class="answer-header">
        <span class="answer-name">Anonymous</span>
        <span class="answer-time">${postedTime}</span>
      </div>
      <p class="answer-text">${element.answer_text}</p>
    `;

    display_answers.appendChild(card);
  });
}
async function submitanswer() {
  const textarea = document.querySelector(".write-textarea");
  const answer = textarea.value.trim();

  if (!answer) {
    alert("Please enter an answer.");
    return;
  }

  const response = await fetch(`/api/doubts/${id}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      answer_text: answer
    })
  });

  if (!response.ok) {
    alert("Failed to submit answer.");
    return;
  }

  textarea.value = "";
  alert("Answer submitted!");

  getAnswers(); // refresh answers list
}
if (!id) {
  alert("Invalid doubt ID");
  window.location.href = "index.html";
} else {
  getDoubtById(id);
  getAnswers();
}