const scriptURL = "https://script.google.com/macros/s/AKfycbzHf3hyB4b2Xl64boVgeoSbWdQhPANkHpId2XRIwkletRMO_9DSiHJbEDxrqtzG-B_NFA/exec";  

// ====================== REGISTER USER ======================
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

// ====================== USER LOGIN ======================
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

// ====================== LOAD USER DASHBOARD ======================
async function loadDashboard() {
    let vid = localStorage.getItem("voterid");

    let data = new URLSearchParams();
    data.append("action", "getUser");
    data.append("voterid", vid);

    let res = await fetch(scriptURL, { method: "POST", body: data });
    let user = await res.json();

    // Show User data
    document.getElementById("username").innerText = user.name;
    document.getElementById("email").innerText = user.email;
    document.getElementById("voterid").innerText = user.voterid;

    // Voting Status
    if (user.hasVoted === "YES") {
        document.getElementById("votestatus").innerText = "Already Voted";

        // Disable candidates
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

// ====================== LOAD CANDIDATES ======================
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
        </div>`;
    }

    document.getElementById("candidateList").innerHTML = html;
}

// ====================== SUBMIT VOTE ======================
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
        loadDashboard();
        loadCandidates();
    }
}

// ====================== ADMIN LOGIN ======================
function adminLogin() {
    let id = document.getElementById("adminid").value;
    let pass = document.getElementById("adminpass").value;

    const ADMIN_ID = "admin@123";
    const ADMIN_PASS = "admin123";

    if (id === ADMIN_ID && pass === ADMIN_PASS) {
        localStorage.setItem("adminLogged", "true");
        window.location.href = "admin.html";
    } else {
        alert("Invalid Admin Credentials!");
    }
}

// ====================== ADMIN LOGOUT ======================
function adminLogout() {
    localStorage.removeItem("adminLogged");
    window.location.href = "index.html";
}

// ====================== USER LOGOUT ======================
function userLogout() {
    localStorage.removeItem("voterid");
    window.location.href = "index.html";
}

// ====================== LOAD ADMIN DASHBOARD ======================
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
        votes.push(results[i][4]);
        totalVotes += results[i][4];
    }

    // Show stats
    let html = "";
    for (let i = 0; i < names.length; i++) {
        let percent = totalVotes === 0 ? 0 : ((votes[i] / totalVotes) * 100).toFixed(2);
        html += `<p><b>${names[i]}</b> → Votes: ${votes[i]} (${percent}%)</p>`;
    }
    document.getElementById("statsBox").innerHTML = html;

    // Winner prediction
    let maxVotes = Math.max(...votes);
    let winnerIndex = votes.indexOf(maxVotes);
    document.getElementById("winnerBox").innerHTML =
        `Predicted Winner: <span style="color:#ffe066">${names[winnerIndex]}</span>`;

    // Bar Chart
    const ctx = document.getElementById('voteChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Votes',
                data: votes,
                backgroundColor: ['#ff6b6b', '#4dabf7', '#ffd43b'],
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

// ====================== LOAD ADS FROM GOOGLE SHEET ======================
async function loadAds() {
    let data = new URLSearchParams();
    data.append("action", "getAds");

    let res = await fetch(scriptURL, { method: "POST", body: data });
    let ads = await res.json();

    let type = ads[1][0];
    let url = ads[1][1];
    let desc = ads[1][2];

    let adBox = document.querySelector(".ad-box");

    if (type === "video") {
        adBox.innerHTML = `
            <h2>Advertisement</h2>
            <video width="100%" height="250" autoplay muted loop controls class="ad-video">
                <source src="${url}" type="video/mp4">
            </video>
            <p class="ad-text">${desc}</p>`;
    }

    if (type === "image") {
        adBox.innerHTML = `
            <h2>Advertisement</h2>
            <img src="${url}" width="100%" class="ad-image">
            <p class="ad-text">${desc}</p>`;
    }

    if (type === "text") {
        adBox.innerHTML = `
            <h2>Announcement</h2>
            <p class="ad-only-text">${desc}</p>`;
    }
}
