// ---------------------------------------------------------
// 1) GLOBAL GAME STATE
// ---------------------------------------------------------

let flowSteps = [];      // Hele spillets lineære flow
let flowIndex = 0;       // Hvilket step spilleren er i
let dialogActive = false; // Bruges til at blokere hint midt i dialog


// ---------------------------------------------------------
// 2) START SPIL
// ---------------------------------------------------------

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  runStep(); // Start første step i flowet
}


// ---------------------------------------------------------
// 3) FLOW-MOTOR (LINEÆRT FLOW)
// ---------------------------------------------------------

function runStep() {
  const step = flowSteps[flowIndex];
  if (step) step(); // Kør det aktuelle step
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
// 5) PANEL-STYRING (VIS/SKJUL UDFORSK & KODE)
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
// 6) INPUT HJÆLPERE (3-CIFRET & 4-CIFRET)
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
// 7) DINE EKSISTERENDE INTERACTIONS (3-CIFRET)
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
// 8) DINE EKSISTERENDE KODER (4-CIFRET)
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
// 9) HYBRID-LOGIK FOR UDFORSK (KAN ALTID BRUGES)
// ---------------------------------------------------------

function interact() {
  const A = get3("A");
  const B = get3("B");

  let key1 = A && B ? `${A}+${B}` : A || B;
  let key2 = A && B ? `${B}+${A}` : "";

  const result = interactions[key1] || interactions[key2];

  // Hvis der er en rigtig interaction → vis dialog
  if (result) {
    playDialog(result.dialog);
    return;
  }

  // Hvis vi er i et Udforsk-step → progression
  if (flowSteps[flowIndex].type === "explore") {
    hideExplorePanel();
    nextStep();
    return;
  }

  // Ellers → sjov fejlreaktion
  playDialog([
    { text: "Malthe: Hmm… det virkede vist ikke.", sound: null },
    { text: "Josephine: Prøv en anden kombination!", sound: null }
  ]);
}


// ---------------------------------------------------------
// 10) HYBRID-LOGIK FOR KODE (KAN ALTID BRUGES)
// ---------------------------------------------------------

function checkCode() {
  const code = get4();
  const result = codes[code];

  // Hvis koden findes → vis dialog
  if (result) {
    playDialog(result.dialog);

    // Hvis vi er i et Kode-step → progression
    if (flowSteps[flowIndex].type === "code") {
      hideCodePanel();
      nextStep();
    }
    return;
  }

  // Forkert kode
  playDialog([
    { text: "Josephine: Den kode passer vist ikke...", sound: null },
    { text: "Malthe: Prøv igen!", sound: null }
  ]);
}


// ---------------------------------------------------------
// 11) HINT-SYSTEM (FØLGER FLOWINDEX)
// ---------------------------------------------------------

const hints = [
  [
    { text: "Malthe: Kig på tallene igen!", sound: null }
  ],
  [
    { text: "Josephine: Måske skal du prøve en anden kombination?", sound: null }
  ],
  [
    { text: "Malthe: Du er tæt på!", sound: null }
  ]
  // Tilføj flere hints i samme stil
];

function showHint() {
  if (dialogActive) return;
  playDialog(hints[flowIndex] || [
    { text: "Malthe: Jeg har ikke flere hints!", sound: null }
  ]);
}


// ---------------------------------------------------------
// 12) NERF-GUN (KAN ALTID BRUGES)
// ---------------------------------------------------------

function shoot() {
  const reactions = [
    [
      { text: "Malthe: AV! Pas nu på!", sound: "malthe_av.mp3" }
    ],
    [
      { text: "Josephine: Det hjælper altså ikke!", sound: "josephine_nohelp.mp3" }
    ],
    [
      { text: "Malthe: Du ramte væggen!", sound: "malthe_wall.mp3" }
    ]
  ];

  const r = reactions[Math.floor(Math.random() * reactions.length)];
  playDialog(r);
}


// ---------------------------------------------------------
// 13) DIT LINEÆRE FLOW (DU KAN SELV UDVIDE DET)
// ---------------------------------------------------------

flowSteps = [
  Object.assign(() => { showExplorePanel(); }, { type: "explore" }),
  Object.assign(() => { showExplorePanel(); }, { type: "explore" }),
  Object.assign(() => { showExplorePanel(); }, { type: "explore" }),

  Object.assign(() => { showCodePanel(); }, { type: "code" }),

  Object.assign(() => { showExplorePanel(); }, { type: "explore" }),
  Object.assign(() => { showExplorePanel(); }, { type: "explore" }),
  Object.assign(() => { showExplorePanel(); }, { type: "explore" }),
  Object.assign(() => { showExplorePanel(); }, { type: "explore" }),

  Object.assign(() => { showCodePanel(); }, { type: "code" }),

  () => playDialog([
    { text: "Malthe: Du fangede Yetien!", sound: "malthe_win.mp3" },
    { text: "Josephine: Godt gået!", sound: "josephine_win.mp3" }
  ])
];
