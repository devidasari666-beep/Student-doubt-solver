let allDoubts = [];

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
  const data = await res.json();             //returns array

  allDoubts = data;   
  displaydoubts(allDoubts);
}

function displaydoubts(data) {
    
  const display_cards = document.querySelector(".cards");     //select div named cards which is in index.html
  display_cards.innerHTML = "";
 if (!data || data.length === 0) {
    display_cards.innerHTML = `
      <div class="no-data">
        No doubts found 😕
      </div>
    `;
    return;
  }

  data.forEach(element => {
    const card = document.createElement("div");          //create a div name it as card
    card.className = "card";                              //add a pointer so that when we click it takes us to that specific doubt
card.style.cursor = "pointer"
card.onclick = () => {
  window.location.href = `/doubt.html?id=${element.id}`
}
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
       <button class="delete-btn" onclick="deleteDoubt(event, ${element.id})">
    Delete
  </button>
    `;

    display_cards.appendChild(card);
  });
}

function filterdoubts(category) {
  if (category === "All") {
    displaydoubts(allDoubts);
  } else {
    const filtered = allDoubts.filter(              //when user clicks specific subject it takes us to that specific section
      d => d.subject === category
    );
    displaydoubts(filtered);
  }
}
async function handlesubmit() {
    
  const question = document.getElementById("questionbox").value
  const subject = document.getElementById("subjectbox").value            //after typing question when user clicks submit question
                                                                        // and answer got submitted
if (!question || !subject) {
  alert("Please fill in all fields!")
  return
}
  const response = await fetch("/api/doubts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, subject })
  })

  const data = await response.json()
  alert("Doubt posted successfully!")
  window.location.href = "/" // redirect to home after posting
}
if (document.querySelector(".cards")) {
  getDoubts();
}
function searchDoubts(data){
 const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allDoubts.filter(d =>
    d.question.toLowerCase().includes(searchText)
  );

  displaydoubts(filtered);
}
async function deleteDoubt(event, id) {
  event.stopPropagation(); // prevents card redirect click

  const confirmDelete = confirm("Are you sure you want to delete this doubt?");
  if (!confirmDelete) return;

  const res = await fetch(`/api/doubts/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();

  alert(data.message || "Deleted successfully");

  // refresh list after delete
  getDoubts();
}
