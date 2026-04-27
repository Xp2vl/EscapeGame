// ---------------------------------------------------------
// 1) GLOBAL GAME STATE
// ---------------------------------------------------------

let flowSteps = [];
let flowIndex = 0;
let dialogActive = false;


// ---------------------------------------------------------
// 2) START SPIL
// ---------------------------------------------------------

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  runStep();
}


// ---------------------------------------------------------
// 3) FLOW-MOTOR (LINEÆRT FLOW)
// ---------------------------------------------------------

function runStep() {
  const step = flowSteps[flowIndex];
  if (!step) return;
  step.run();
}

function nextStep() {
  flowIndex++;
  runStep();
}


// ---------------------------------------------------------
// 4) DIALOGSYSTEM (UNDERSTØTTER FLERE LYDFILER)
// ---------------------------------------------------------

function playDialog(lines) {
  dialogActive = true;
  let i = 0;

  function showLine() {
    const line = lines[i];
    dialogText.textContent = line.text;

    if (line.sound) {
      const audio = new Audio("assets/lyd/" + line.sound);
      audio.onended = () => {
        i++;
        if (i < lines.length) showLine();
        else endDialog();
      };
      audio.play();
    } else {
      i++;
      if (i < lines.length) showLine();
      else endDialog();
    }
  }

  function endDialog() {
    dialogActive = false;
    nextBtn.classList.add("active");
    nextBtn.onclick = () => {
      nextBtn.classList.remove("active");
      nextStep();
    };
  }

  showLine();
}


// ---------------------------------------------------------
// 5) PANEL-STYRING
// ---------------------------------------------------------

function showExplorePanel() {
  document.querySelector(".panel-udforsk").style.display = "block";
}

function hideExplorePanel() {
  document.querySelector(".panel-udforsk").style.display = "none";
}

function showCodePanel() {
  document.querySelector(".panel:nth-of-type(2)").style.display = "block";
}

function hideCodePanel() {
  document.querySelector(".panel:nth-of-type(2)").style.display = "none";
}


// ---------------------------------------------------------
// 6) INPUT HJÆLPERE
// ---------------------------------------------------------

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


// ---------------------------------------------------------
// AUTOFOKUS, BACKSPACE & AUTO-CLEAR
// ---------------------------------------------------------

document.addEventListener("mousedown", e => {
  if (!e.target.classList.contains("digit")) return;

  if (e.target.value !== "") {
    e.target.value = "";
    e.target.classList.remove("filled");
  }
});

document.addEventListener("input", e => {
  if (!e.target.classList.contains("digit")) return;
  const inputs = [...document.querySelectorAll(".digit")];
  const index = inputs.indexOf(e.target);
  if (e.target.value.length === 1) {
    e.target.classList.add("filled");
    if (index < inputs.length - 1) inputs[index + 1].focus();
  }
});

document.addEventListener("keydown", e => {
  if (!e.target.classList.contains("digit")) return;
  const inputs = [...document.querySelectorAll(".digit")];
  const index = inputs.indexOf(e.target);
  if (e.key === "Backspace" && e.target.value === "" && index > 0) {
    inputs[index - 1].focus();
  }
});


// ---------------------------------------------------------
// 7) BONUS-INTERACTIONS (3-CIFRET)
// ---------------------------------------------------------

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


// ---------------------------------------------------------
// 8) BONUS-KODER (4-CIFRET)
// ---------------------------------------------------------

const codes = {
  "5287": {
    dialog: [
      { text: "Josephine: Du løste koden!", sound: null },
      { text: "Malthe: Hvad har du fundet?", sound: null }
    ]
  }
};


// ---------------------------------------------------------
// 9) FLOW-SPECIFIKKE KODER
// ---------------------------------------------------------

const flowExploreCodes = {
  0: ["854+259", "259+854"],
  1: ["418+951", "951+418"]
};

const flowCodeCodes = {
  3: "5287"
};


// ---------------------------------------------------------
// 10) NERF-GUN (GLOBAL KODE 625, LOOP MED 5 REAKTIONER)
// ---------------------------------------------------------

const nerfCode = "625";

const nerfReactions = [
  [{ text: "Malthe: AV! Ikke i hovedet!", sound: "nerf1.mp3" }],
  [{ text: "Josephine: Seriøst? Nu igen?", sound: "nerf2.mp3" }],
  [{ text: "Malthe: Du ramte væggen… flot.", sound: "nerf3.mp3" }],
  [{ text: "Josephine: Den der gjorde faktisk lidt ondt!", sound: "nerf4.mp3" }],
  [{ text: "Malthe: Stop! Jeg overgiver mig!", sound: "nerf5.mp3" }]
];

let nerfIndex = 0;

function getNextNerfReaction() {
  const reaction = nerfReactions[nerfIndex];
  nerfIndex = (nerfIndex + 1) % nerfReactions.length;
  return reaction;
}

function playErrorDialog(lines) {
  dialogActive = true;
  let i = 0;

  const dialogArea = document.getElementById("dialogArea");

  dialogArea.style.display = "block"; // vis dialogen

  function showLine() {
    const line = lines[i];
    dialogText.textContent = line.text;

    if (line.sound) {
      const audio = new Audio("assets/lyd/" + line.sound);
      audio.onended = () => {
        i++;
        if (i < lines.length) showLine();
        else endErrorDialog();
      };
      audio.play();
    } else {
      i++;
      if (i < lines.length) showLine();
      else endErrorDialog();
    }
  }

  function endErrorDialog() {
    dialogActive = false;
    nextBtn.classList.add("active");
    nextBtn.onclick = () => {
      nextBtn.classList.remove("active");
      dialogArea.style.display = "none"; // LUK dialogen uden nextStep()
    };
  }

  showLine();
}


// ---------------------------------------------------------
// 11) HYBRID-LOGIK FOR UDFORSK
// ---------------------------------------------------------

function interact() {
  const A = get3("A");
  const B = get3("B");

  let key1 = A && B ? `${A}+${B}` : A || B;
  let key2 = A && B ? `${B}+${A}` : "";

  // ⭐ 1) NERF-GUN (global kode 625)
  if (A === nerfCode || B === nerfCode) {
    playDialog(getNextNerfReaction());
    return;
  }

  // ⭐ 2) BONUS-INTERACTIONS
  const result = interactions[key1] || interactions[key2];
  if (result) {
    playDialog(result.dialog);
    return;
  }

  // ⭐ 3) FLOW-SPECIFIK UDFORSK-KODE
const correct = flowExploreCodes[flowIndex];

if (
  flowSteps[flowIndex].type === "explore" &&
  correct &&
  (correct.includes(key1) || correct.includes(key2))
) {
  hideExplorePanel();
  nextStep();
  return;
}

  // ⭐ 4) FEJL-REAKTION
playErrorDialog([
  { text: "Malthe: Hmm… det virkede vist ikke.", sound: null },
  { text: "Josephine: Prøv en anden kombination!", sound: null }
]);
}

// ---------------------------------------------------------
// 12) HYBRID-LOGIK FOR KODE
// ---------------------------------------------------------

function checkCode() {
  const code = get4();

  const result = codes[code];
  if (result) playDialog(result.dialog);

  const correct = flowCodeCodes[flowIndex];

  if (
    flowSteps[flowIndex].type === "code" &&
    correct &&
    code === correct
  ) {
    hideCodePanel();
    nextStep();
    return;
  }

playErrorDialog([
  { text: "Josephine: Den kode passer vist ikke...", sound: null },
  { text: "Malthe: Prøv igen!", sound: null }
]);
}

// ---------------------------------------------------------
// 13) HINT-SYSTEM
// ---------------------------------------------------------

const hints = [
  [{ text: "Malthe: Kig på tallene igen!", sound: null }],
  [{ text: "Josephine: Måske skal du prøve en anden kombination?", sound: null }],
  [{ text: "Malthe: Du er tæt på!", sound: null }]
];

function showHint() {
  if (dialogActive) return;
  playDialog(hints[flowIndex] || [
    { text: "Malthe: Jeg har ikke flere hints!", sound: null }
  ]);
}


// ---------------------------------------------------------
// 14) DIT LINEÆRE FLOW
// ---------------------------------------------------------

flowSteps = [
  { type: "explore", run: () => showExplorePanel() },
  { type: "explore", run: () => showExplorePanel() },
  { type: "explore", run: () => showExplorePanel() },

  { type: "code", run: () => showCodePanel() },

  { type: "explore", run: () => showExplorePanel() },
  { type: "explore", run: () => showExplorePanel() },
  { type: "explore", run: () => showExplorePanel() },
  { type: "explore", run: () => showExplorePanel() },

  { type: "code", run: () => showCodePanel() },

  {
    type: "dialog",
    run: () => playDialog([
      { text: "Malthe: Du fangede Yetien!", sound: "malthe_win.mp3" },
      { text: "Josephine: Godt gået!", sound: "josephine_win.mp3" }
    ])
  }
];
