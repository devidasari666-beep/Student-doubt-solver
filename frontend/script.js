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

async function getDoubts() {
  const res = await fetch('/api/doubts');
  const data = await res.json();

  const display_cards = document.querySelector(".cards");
  display_cards.innerHTML = "";

  data.forEach(element => {
    const card = document.createElement("div");
    card.className = "card";

    const answerText =
      element.answers_count === 0
        ? "No answers yet"
        : `${element.answers_count} answer${element.answers_count > 1 ? "s" : ""}`;

    const postedTime = timeAgo(element.created_at);

    card.innerHTML = `
      <span class="${element.subject}">${element.subject}</span>
      <p>${element.question}</p>
      <div class="card-meta">
        <span>💬 ${answerText}</span>
        <span>posted ${postedTime}</span>
      </div>
    `;

    display_cards.appendChild(card);
  });
}
getDoubts();