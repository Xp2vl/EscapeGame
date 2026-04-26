// -----------------------------
// START & TIMER
// -----------------------------
let gameState = "start";
let startTime = null;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  startTime = Date.now();
}

// -----------------------------
// DIALOGSYSTEM
// -----------------------------
let nextAction = null;

function playDialog(lines) {
  document.getElementById("dialogText").innerText =
    lines.map(l => l.text).join("\n");

  let index = 0;

  function playNext() {
    if (index >= lines.length) return;
    const line = lines[index++];
    if (line.sound) {
      const audio = new Audio("assets/lyd/" + line.sound);
      audio.onended = playNext;
      audio.play();
    } else playNext();
  }

  playNext();
  document.getElementById("nextBtn").classList.add("active");
}

function nextDialog() {
  document.getElementById("nextBtn").classList.remove("active");
  if (nextAction) {
    const a = nextAction;
    nextAction = null;
    a();
  }
}

function flow(steps) {
  let i = 0;
  function run() {
    if (i < steps.length) {
      const step = steps[i++];
      step();
      nextAction = run;
    }
  }
  run();
}

// -----------------------------
// INPUT HJÆLPERE
// -----------------------------
function get3(prefix) {
  const d1 = document.getElementById(prefix + "1").value;
  const d2 = document.getElementById(prefix + "2").value;
  const d3 = document.getElementById(prefix + "3").value;
  if (!d1 || !d2 || !d3) return "";
  return d1 + d2 + d3;
}

function get4() {
  const c1 = document.getElementById("code1").value;
  const c2 = document.getElementById("code2").value;
  const c3 = document.getElementById("code3").value;
  const c4 = document.getElementById("code4").value;
  if (!c1 || !c2 || !c3 || !c4) return "";
  return c1 + c2 + c3 + c4;
}

// -----------------------------
// AUTOFOKUS, BACKSPACE & AUTO-CLEAR
// -----------------------------
document.addEventListener("keydown", e => {
  if (!e.target.classList.contains("digit")) return;

  const inputs = [...document.querySelectorAll(".digit")];
  const index = inputs.indexOf(e.target);

  // BACKSPACE → hop tilbage
  if (e.key === "Backspace" && e.target.value === "") {
    if (index > 0) inputs[index - 1].focus();
    return;
  }
});

document.addEventListener("input", e => {
  if (!e.target.classList.contains("digit")) return;

  const inputs = [...document.querySelectorAll(".digit")];
  const index = inputs.indexOf(e.target);

  // Markér felt som udfyldt
  if (e.target.value.length === 1) {
    e.target.classList.add("filled");

    // Hop videre
    if (index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  }
});

// AUTO-CLEAR når man klikker i feltet
document.addEventListener("mousedown", e => {
  if (e.target.classList.contains("digit")) {
    e.target.value = "";
    e.target.classList.remove("filled");

    // Sørger for at feltet får fokus EFTER clear
    setTimeout(() => e.target.focus(), 0);
  }
});


// -----------------------------
// INTERACTIONS
// -----------------------------
const interactions = {
  "854+259": {
    dialog: [
      { text: "Malthe: Feeedt!", sound: "Malthe_1.mp3" },
      { text: "Josephine: Pas lige på med den der!", sound: "Josephine_1.mp3" }
    ]
  },
  "418+951": {
    dialog: [
      { text: "Malthe: Tænk at det virkede!", sound: null },
      { text: "Josephine: Bare det kan dreje rundt!", sound: null }
    ]
  }
};

function interact() {
  const A = get3("A");
  const B = get3("B");

  let key1 = A && B ? `${A}+${B}` : A || B;
  let key2 = A && B ? `${B}+${A}` : "";

  const result = interactions[key1] || interactions[key2];

  if (!result) {
    flow([
      () => playDialog([
        { text: "Malthe: Hmm… det virkede vist ikke.", sound: null },
        { text: "Josephine: Prøv en anden kombination!", sound: null }
      ])
    ]);
    return;
  }

  flow([
    () => playDialog(result.dialog)
  ]);
}

// -----------------------------
// KODE (A)
// -----------------------------
const codes = {
  "5287": {
    dialog: [
      { text: "Josephine: Du løste koden!", sound: null },
      { text: "Malthe: Hvad har du fundet?", sound: null }
    ]
  }
};

function checkCode() {
  const code = get4();
  const result = codes[code];

  if (!result) {
    flow([
      () => playDialog([
        { text: "Josephine: Den kode passer vist ikke...", sound: null },
        { text: "Malthe: Prøv igen!", sound: null }
      ])
    ]);
    return;
  }

  flow([
    () => playDialog(result.dialog)
  ]);
}

// -----------------------------
// HINT
// -----------------------------
function showHint() {
  flow([
    () => playDialog([
      { text: "Malthe: Måske skal du prøve at taste nogle tal?", sound: null }
    ])
  ]);
}
