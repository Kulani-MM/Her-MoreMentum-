// Simple SPA navigation
const views = document.querySelectorAll(".view");
const navButtons = document.querySelectorAll(".nav-btn");
navButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    views.forEach((v) => v.classList.remove("active"));
    document.getElementById(btn.dataset.target).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// Toast helper
const toast = (msg) => {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
};

// Mentorship mock data
const mentors = [
  {
    name: "Thandi M.",
    sport: "Football",
    focus: ["Leadership", "Coaching"],
    bio: "U17 national coach. Building pathways for girls in township clubs.",
    tags: ["Leadership", "Coaching", "Youth"],
  },
  {
    name: "Aisha K.",
    sport: "Athletics",
    focus: ["Entrepreneurship", "Brand Partnerships"],
    bio: "Olympian turned wellness studio owner.",
    tags: ["Business", "Branding", "Wellness"],
  },
  {
    name: "Naledi S.",
    sport: "Netball",
    focus: ["Media & Commentary"],
    bio: "SuperSport analyst, ex-national GK.",
    tags: ["Media", "Storytelling"],
  },
  {
    name: "Zinzi R.",
    sport: "Rugby",
    focus: ["Leadership", "Entrepreneurship"],
    bio: "Club administrator; launched a sport-tech startup.",
    tags: ["Admin", "Tech", "Funding"],
  },
  {
    name: "Imara P.",
    sport: "Cricket",
    focus: ["Coaching", "Leadership"],
    bio: "High-performance coach with data-analytics bent.",
    tags: ["Data", "HP Coach"],
  },
];

document.getElementById("mentorshipForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const sport = document.getElementById("sport").value;
  const goal = document.getElementById("goals").value;
  const interests = document.getElementById("interests").value.toLowerCase();
  const results = mentors.filter(
    (m) => (!sport || m.sport === sport) && (!goal || m.focus.includes(goal))
  );
  const container = document.getElementById("mentorResults");
  container.innerHTML = "";
  if (results.length === 0) {
    container.innerHTML =
      '<p class="muted">No mentors found. Try broadening your filters.</p>';
    return;
  }
  results.forEach((m) => {
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `<h3>${m.name}</h3>
      <p class="muted small">${m.sport} • ${m.focus.join(", ")}</p>
      <p>${m.bio}</p>
      <div class="pill-list">${m.tags
        .map((t) => `<span class="pill">${t}</span>`)
        .join("")}</div>
      <button class="primary connect">Connect</button>`;
    card
      .querySelector(".connect")
      .addEventListener("click", () =>
        toast("Connection request sent to " + m.name)
      );
    container.appendChild(card);
  });
});

// AI Chat (toy logic)
function aiReply(text) {
  const t = text.toLowerCase();
  if (t.includes("sponsor"))
    return "Start with a crisp 120-word bio, 3 proof points, and 1-minute reel. I can draft it — just say “draft my sponsor bio”.";
  if (t.includes("bio"))
    return "Here’s a quick sponsor bio template: [Name], [sport/role], [top 3 achievements]. Purpose: [cause/impact]. Call-to-action: partner with me to [outcome].";
  if (t.includes("30") && t.includes("plan"))
    return "30-day plan: Week 1 audit strengths; Week 2 shadow a coach + revise CV; Week 3 create 3 demo sessions; Week 4 outreach to 10 clubs & publish a Reel.";
  if (t.includes("kpi"))
    return "Track: content reach, newsletter subs, inquiry count, conversion rate, sponsor LTV, session attendance, wellness score.";
  if (t.includes("stress") || t.includes("anxiety"))
    return "Try box breathing (4-4-4-4) pre-competition. Want a 10-min grounding routine?";
  return "Got it. Want a 3-step action plan, a template, or a checklist?";
}
function addMsg(logEl, who, text) {
  const row = document.createElement("div");
  row.className = "message " + (who === "You" ? "user" : "bot");
  row.innerHTML = `<div class="who">${who}</div><div class="bubble">${text}</div>`;
  logEl.appendChild(row);
  logEl.scrollTop = logEl.scrollHeight;
}
function wireChat(formId, inputId, logId, handoffId) {
  const form = document.getElementById(formId);
  const input = document.getElementById(inputId);
  const log = document.getElementById(logId);
  const handoff = document.getElementById(handoffId);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMsg(log, "You", text);
    setTimeout(() => addMsg(log, "Coach", aiReply(text)), 350);
    input.value = "";
  });
  handoff.addEventListener("click", (e) => {
    e.preventDefault();
    toast("Handoff requested — a human mentor will reach out.");
  });
}
wireChat("chatForm", "chatInput", "chatLog", "handoff");
wireChat("chatFormModal", "chatInputModal", "chatLogModal", "handoffModal");

// Modal chat
const chatModal = document.getElementById("chatModal");
document
  .getElementById("openChat")
  .addEventListener("click", () => chatModal.showModal());
document
  .getElementById("closeChat")
  .addEventListener("click", () => chatModal.close());
document.querySelectorAll(".open-ai").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.getElementById("ai-coach").classList.add("active");
    views.forEach((v) => {
      if (v.id !== "ai-coach") v.classList.remove("active");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  })
);

// Therapy scheduler (simple calendar + slots)
const calLabel = document.getElementById("calLabel");
const grid = document.getElementById("calendarGrid");
const slotList = document.getElementById("slotList");
const bookingForm = document.getElementById("bookingForm");
const bkName = document.getElementById("bkName");
const bkEmail = document.getElementById("bkEmail");
const bkNotes = document.getElementById("bkNotes");
const confirmBooking = document.getElementById("confirmBooking");

let current = new Date();
current.setDate(1);
let selectedDate = null;
const slotsByDay = ["09:00", "10:00", "14:00", "15:30", "18:00"];

function renderCalendar() {
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 0 Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calLabel.textContent = current.toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });
  grid.innerHTML = "";
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekdays.forEach((d) => {
    const head = document.createElement("div");
    head.textContent = d;
    head.className = "muted small";
    grid.appendChild(head);
  });

  // pad start
  const pad = (firstDay + 7) % 7;
  for (let i = 0; i < pad; i++) {
    const cell = document.createElement("div");
    cell.className = "day inactive";
    grid.appendChild(cell);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "day";
    cell.setAttribute("role", "gridcell");
    cell.textContent = d;
    cell.addEventListener("click", () =>
      selectDate(new Date(year, month, d), cell)
    );
    grid.appendChild(cell);
  }
}

function selectDate(dt, cell) {
  grid.querySelectorAll(".day").forEach((c) => c.classList.remove("selected"));
  cell.classList.add("selected");
  selectedDate = dt;
  slotList.innerHTML = "";
  bookingForm.classList.add("hidden");
  slotsByDay.forEach((s) => {
    const b = document.createElement("button");
    b.className = "slot";
    b.textContent = s;
    b.addEventListener("click", () => {
      bookingForm.classList.remove("hidden");
      bookingForm.dataset.slot = s;
    });
    slotList.appendChild(b);
  });
}

document.getElementById("prevMonth").addEventListener("click", () => {
  current.setMonth(current.getMonth() - 1);
  renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  current.setMonth(current.getMonth() + 1);
  renderCalendar();
});

confirmBooking.addEventListener("click", () => {
  if (!selectedDate) {
    toast("Pick a date first.");
    return;
  }
  if (!bkName.value || !bkEmail.value) {
    toast("Please add your name & email.");
    return;
  }
  const booking = {
    name: bkName.value,
    email: bkEmail.value,
    notes: bkNotes.value,
    date: selectedDate.toISOString().slice(0, 10),
    time: bookingForm.dataset.slot,
  };
  const all = JSON.parse(localStorage.getItem("hmn_bookings") || "[]");
  all.push(booking);
  localStorage.setItem("hmn_bookings", JSON.stringify(all));
  toast("Session booked for " + booking.date + " @ " + booking.time);
  bkName.value = bkEmail.value = bkNotes.value = "";
  bookingForm.classList.add("hidden");
});

renderCalendar();

// Events & Opportunities (mock)
const events = [
  {
    title: "Masterclass: From Player to Coach",
    when: "2025-09-10 18:00 SAST",
    host: "Naledi S.",
    where: "Virtual (Zoom)",
  },
  {
    title: "Wellness Lab: Managing Competition Anxiety",
    when: "2025-09-14 17:00 SAST",
    host: "Sports Psych Team",
    where: "Virtual (Teams)",
  },
  {
    title: "Sponsor-Ready Storytelling",
    when: "2025-09-21 12:00 SAST",
    host: "Brand Studio",
    where: "Hybrid (Joburg)",
  },
];
const opps = [
  {
    title: "Community Coach — Gauteng",
    org: "Girls FC Network",
    pay: "Stipend",
    link: "#",
  },
  {
    title: "Analyst Internship — Women’s Rugby",
    org: "DataSport SA",
    pay: "Paid",
    link: "#",
  },
  {
    title: "Content Creator — Women in Sport",
    org: "Momentum Studio",
    pay: "Freelance",
    link: "#",
  },
];

function renderCards(list, targetId) {
  const el = document.getElementById(targetId);
  el.innerHTML = "";
  list.forEach((i) => {
    const card = document.createElement("article");
    card.className = "card";
    const extra = i.when
      ? `<p class="muted small">${i.when} • ${i.where}</p>`
      : `<p class="muted small">${i.org} • ${i.pay}</p>`;
    card.innerHTML = `<h3>${i.title}</h3>${extra}<button class="secondary">${
      i.link ? "View" : "Register"
    }</button>`;
    el.appendChild(card);
  });
}
renderCards(events, "eventsList");
renderCards(opps, "oppsList");

// Modal open via header button
document.getElementById("openChat").addEventListener("click", () => {
  const log = document.getElementById("chatLogModal");
  if (!log.dataset.seeded) {
    addMsg(
      log,
      "Coach",
      "Welcome! Want a 30‑day plan, a sponsor bio, or a mental reset routine?"
    );
    log.dataset.seeded = "1";
  }
});
