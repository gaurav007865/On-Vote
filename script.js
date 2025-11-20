const scriptURL = "https://script.google.com/macros/s/AKfycbzHf3hyB4b2Xl64boVgeoSbWdQhPANkHpId2XRIwkletRMO_9DSiHJbEDxrqtzG-B_NFA/exec";  

// ================= REGISTER ==================
async function register() {
  let data = new URLSearchParams();
  data.append("action", "register");
  data.append("name", document.getElementById("name").value);
  data.append("email", document.getElementById("email").value);
  data.append("password", document.getElementById("password").value);

  let res = await fetch(scriptURL, { method: "POST", body: data });
  let voterID = await res.text();

  document.getElementById("voterMessage").innerHTML =
    "Registration Successful!<br>Your Voter ID: <b>" + voterID + "</b>";

  setTimeout(() => window.location.href = "index.html", 3000);
}

// ================= LOGIN ==================
async function login() {
  let data = new URLSearchParams();
  data.append("action", "login");
  data.append("voterid", document.getElementById("voterid").value);
  data.append("password", document.getElementById("password").value);

  let res = await fetch(scriptURL, { method: "POST", body: data });
  let text = await res.text();

  if (text === "SUCCESS") {
    localStorage.setItem("voterid", document.getElementById("voterid").value);
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid Login!");
  }
}

// ================ LOAD USER DASHBOARD =================
async function loadDashboard() {
    let vid = localStorage.getItem("voterid");
    let data = new URLSearchParams();

    data.append("action", "getUser");
    data.append("voterid", vid);

    let res = await fetch(scriptURL, { method: "POST", body: data });
    let user = await res.json();

    // Show User info
    document.getElementById("username").innerText = user.name;
    document.getElementById("email").innerText = user.email;
    document.getElementById("voterid").innerText = user.voterid;

    // Voting Status update
    if (user.hasVoted === "YES") {
        document.getElementById("votestatus").innerText = "Already Voted";

        // 🔥 POPUP SHOW
        setTimeout(() => {
            alert("You have already voted! You cannot vote again.");
        }, 500);

        // 🔒 Disable candidate list
        const area = document.getElementById("candidateList");
        area.innerHTML = `
            <div style="padding:20px;background:rgba(255,255,255,0.15);border-radius:15px;">
                <h3 style="color:#ffe066;">You have already voted.</h3>
                <p style="color:white;">Voting again is not allowed.</p>
            </div>
        `;

    } else {
        document.getElementById("votestatus").innerText = "Not Voted Yet";
    }
}

// ================= LOAD CANDIDATES ================
async function loadCandidates() {
    let data = new URLSearchParams();
    data.append("action", "getCandidates");

    let res = await fetch(scriptURL, { method: "POST", body: data });
    let candidates = await res.json();

    // Load user voting status
    let userdata = new URLSearchParams();
    userdata.append("action", "getUser");
    userdata.append("voterid", localStorage.getItem("voterid"));

    let res2 = await fetch(scriptURL, { method: "POST", body: userdata });
    let user = await res2.json();

    let html = "";

    for (let i = 1; i < candidates.length; i++) {

        let name = candidates[i][0];
        let party = candidates[i][1];
        let logo = candidates[i][2];
        let desc = candidates[i][3];

        html += `
        <div class="candidate-card">

            <img src="${logo}" class="party-logo">

            <h2 class="candidate-name">${name}</h2>

            <p class="party-name">${party}</p>

            <p class="description">${desc}</p>

            ${
                user.hasVoted === "YES"
                ? `<button class="vote-btn" disabled style="opacity:0.5;">Already Voted</button>`
                : `<button class="vote-btn" onclick="submitVote('${name}')">Vote</button>`
            }

        </div>
        `;
    }

    document.getElementById("candidateList").innerHTML = html;
}

// REGISTER FUNCTION

async function register() {
    let data = new URLSearchParams();
    data.append("action", "register");
    data.append("name", document.getElementById("name").value);
    data.append("email", document.getElementById("email").value);
    data.append("password", document.getElementById("password").value);

    let res = await fetch(scriptURL, { method: "POST", body: data });
    let voterID = await res.text();

    let info = document.getElementById("userInfo");
    info.style.display = "block";

    info.innerHTML = `
        <h3>Registration Successful 🎉</h3>
        <p><b>Name:</b> ${document.getElementById("name").value}</p>
        <p><b>Email:</b> ${document.getElementById("email").value}</p>
        <p><b>Voter ID:</b> <span style="color:#ffe066">${voterID}</span></p>

        <br>
        <button class="btn" onclick="window.location.href='index.html'">Go to Login</button>
    `;
}
async function submitVote(name) {

    let voterid = localStorage.getItem("voterid");

    let data = new URLSearchParams();
    data.append("action", "vote");
    data.append("voterid", voterid);
    data.append("candidate", name);

    let res = await fetch(scriptURL, { method: "POST", body: data });
    let text = await res.text();

    if (text === "VOTED") {
        alert("Your vote has been submitted successfully!");

        // Lock dashboard
        loadDashboard();
        loadCandidates();
    }
}
async function loadAdminData() {

    let data = new URLSearchParams();
    data.append("action", "getResults");

    let res = await fetch(scriptURL, { method: "POST", body: data });
    let results = await res.json();

    let names = [];
    let votes = [];
    let totalVotes = 0;

    for (let i = 1; i < results.length; i++) {
        names.push(results[i][0]);
        votes.push(results[i][4]);  // Votes column
        totalVotes += results[i][4];
    }

    // Show stats
    let html = "";
    for (let i = 0; i < names.length; i++) {
        let percent = totalVotes === 0 ? 0 : ((votes[i] / totalVotes) * 100).toFixed(2);

        html += `
            <p><b>${names[i]}</b> → Votes: ${votes[i]} (${percent}%)</p>
        `;
    }
    document.getElementById("statsBox").innerHTML = html;

    // Winner prediction
    let maxVotes = Math.max(...votes);
    let winnerIndex = votes.indexOf(maxVotes);

    document.getElementById("winnerBox").innerHTML =
        `Predicted Winner: <span style="color:#ffe066">${names[winnerIndex]}</span>`;

    // Chart.js - Bar Graph
    const ctx = document.getElementById('voteChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Votes',
                data: votes,
                backgroundColor: ['#ff6b6b', '#4dabf7', '#ffd43b'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: { legend: { labels: { color: 'white' }}},
            scales: {
                y: { beginAtZero: true, ticks: { color: "white" }},
                x: { ticks: { color: "white" }}
            }
        }
    });

}
