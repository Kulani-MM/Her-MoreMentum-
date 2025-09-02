// Toast helper
const toast = (msg) => {
  const el = document.getElementById("toast");
  if (!el) {
    console.log("[toast]", msg);
    return;
  }
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
};

// ---- Mentorship ----
const mentorshipForm = document.getElementById("mentorshipForm");
if (mentorshipForm) {
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

  mentorshipForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const sport = document.getElementById("sport").value;
    const goal = document.getElementById("goals").value;
    const results = mentors.filter(
      (m) => (!sport || m.sport === sport) && (!goal || m.focus.includes(goal))
    );
    const container = document.getElementById("mentorResults");
    container.innerHTML = results.length
      ? ""
      : '<p class="muted">No mentors found. Try broadening your filters.</p>';

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
}

// ---- AI Coach ----
function aiReply(text) {
  const t = text.toLowerCase();
  if (t.includes("sponsor"))
    return "Start with a crisp 120-word bio, 3 proof points, and 1-minute reel.";
  if (t.includes("bio"))
    return "Sponsor bio template: [Name], [sport/role], [achievements]. Purpose: [cause].";
  if (t.includes("30") && t.includes("plan"))
    return "30-day plan: Week 1 audit; Week 2 shadow; Week 3 demo sessions; Week 4 outreach.";
  if (t.includes("kpi"))
    return "Track: reach, subs, inquiries, conversion, LTV, attendance, wellness score.";
  if (t.includes("stress") || t.includes("anxiety"))
    return "Try box breathing (4-4-4-4). Want a 10-min grounding routine?";
  return "Got it. Want a 3-step action plan, template, or checklist?";
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
  if (!form) return; // page doesn’t have chat
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

const openChat = document.getElementById("openChat");
if (openChat) {
  const chatModal = document.getElementById("chatModal");
  openChat.addEventListener("click", () => chatModal?.showModal());
  document
    .getElementById("closeChat")
    ?.addEventListener("click", () => chatModal?.close());
}

// ---- Therapy ----
const calLabel = document.getElementById("calLabel");
if (calLabel) {
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
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    calLabel.textContent = current.toLocaleString(undefined, {
      month: "long",
      year: "numeric",
    });
    grid.innerHTML = "";
    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((d) => {
      const head = document.createElement("div");
      head.textContent = d;
      head.className = "muted small";
      grid.appendChild(head);
    });

    const pad = (firstDay + 7) % 7;
    for (let i = 0; i < pad; i++) {
      const cell = document.createElement("div");
      cell.className = "day inactive";
      grid.appendChild(cell);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement("div");
      cell.className = "day";
      cell.textContent = d;
      cell.addEventListener("click", () =>
        selectDate(new Date(year, month, d), cell)
      );
      grid.appendChild(cell);
    }
  }

  function selectDate(dt, cell) {
    grid
      .querySelectorAll(".day")
      .forEach((c) => c.classList.remove("selected"));
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
    if (!selectedDate) return toast("Pick a date first.");
    if (!bkName.value || !bkEmail.value)
      return toast("Please add your name & email.");
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
}

// ---- Events & Opportunities ----
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
  if (!el) return;
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

// assets/app.js

// ---------- NAV ACTIVE STATE ----------
document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".top-nav a");
  const currentPage = window.location.pathname.split("/").pop();

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

// ---------- TOAST NOTIFICATIONS ----------
function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ---------- QUICK PROMPTS ----------
document.querySelectorAll(".chip.ask").forEach(chip => {
  chip.addEventListener("click", () => {
    const text = chip.dataset.q;
    sendMessage(text);
  });
});

// ---------- AI CHAT ----------
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatLog = document.getElementById("chatLog");

if (chatForm) {
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
      sendMessage(text);
      chatInput.value = "";
    }
  });
}

function sendMessage(message) {
  appendMessage("user", message);

  // Fake AI response for demo (replace with backend/LLM API later)
  setTimeout(() => {
    const response = generateAIResponse(message);
    appendMessage("ai", response);
  }, 800);
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.className = `msg ${sender}`;
  msg.textContent = text;
  chatLog.appendChild(msg);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// Simple mock responses
function generateAIResponse(userMsg) {
  const lower = userMsg.toLowerCase();

  if (lower.includes("plan")) return "Here’s a starter 30-day transition plan: Week 1 focus on mindset, Week 2 networking, Week 3 building skills, Week 4 launching your next step.";
  if (lower.includes("bio")) return "Draft Bio: 'I am a driven athlete transitioning into leadership, passionate about empowering others while pursuing sustainable success.'";
  if (lower.includes("strategy")) return "Instagram Reels Strategy: Post 3x a week, mix behind-the-scenes, training highlights, and personal storytelling.";
  if (lower.includes("kpi")) return "Key KPIs: Engagement rate, audience growth, sponsor mentions, and content consistency.";

  return "That’s a great question! Let’s explore it together — can you tell me a bit more?";
}

// ---------- HANDOFF TO HUMAN ----------
const handoffBtn = document.getElementById("handoff");
if (handoffBtn) {
  handoffBtn.addEventListener("click", (e) => {
    e.preventDefault();
    showToast("A human mentor will be in touch soon.");
  });
}
