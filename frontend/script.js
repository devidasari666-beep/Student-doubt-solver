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
  try {
    const res = await fetch('/api/doubts')
    const data = await res.json()
    allDoubts = data
    displaydoubts(allDoubts)
  } catch (err) {
    console.error(err)
    alert("Failed to load doubts!")
  }
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
      <button class="delete-btn">Delete</button>
    `;
const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.onclick = async (event) => {
      event.stopPropagation(); // Block card background navigation click trigger
      
      const confirmDelete = confirm("Are you sure you want to delete this doubt?");
      if (!confirmDelete) return;

      try {
        const res = await fetch(`/api/doubts/${element.id}`, { method: "DELETE" });
        const resData = await res.json();
        alert(resData.message || "Deleted successfully");
        getDoubts(); // reload UI contents
      } catch (err) {
        console.error("Delete request error:", err);
      }
    };
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
try{
  const response = await fetch("/api/doubts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, subject })
  })

  const data = await response.json()
  alert("Doubt posted successfully!")
  document.getElementById("questionbox").value = ""
document.getElementById("subjectbox").value = ""
  window.location.href = "/" // redirect to home after posting
}catch(err){
  console.error(err)
    alert("Failed to load doubts!")
}
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

