// ---------------------------------------------------------
// 1) GLOBAL GAME STATE
// ---------------------------------------------------------

let flowSteps = [];
let flowIndex = 0;
let dialogActive = false;


// ---------------------------------------------------------
// 2) NÆSTE-KNAP STYRING (NYT)
// ---------------------------------------------------------

function showNextButton() {
  nextBtn.style.display = "block";
  nextBtn.classList.add("active");
}

function hideNextButton() {
  nextBtn.style.display = "none";
  nextBtn.classList.remove("active");
  nextBtn.onclick = null;
}

// Skjul knappen fra start
hideNextButton();


// ---------------------------------------------------------
// 3) START SPIL
// ---------------------------------------------------------

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameArea").style.display = "block";
  runStep();
}


// ---------------------------------------------------------
// 4) FLOW-MOTOR (LINEÆRT FLOW)
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
// 5) NYT DIALOGSYSTEM (VIS ALT + DU STYRER NÆSTE)
// ---------------------------------------------------------

function playDialogControlled(lines, onFinishSounds) {
  dialogActive = true;

  const dialogArea = document.getElementById("dialogArea");
  dialogArea.style.display = "block";

  dialogText.innerHTML = lines.map(l => l.text).join("");

  let i = 0;

  function playNext() {
    if (i >= lines.length) {
      if (onFinishSounds) onFinishSounds();
      return;
    }

    const line = lines[i];
    i++;

    if (line.sound) {
      const audio = new Audio("assets/lyd/" + line.sound);
      audio.onended = playNext;
      audio.play();
    } else {
      playNext();
    }
  }

  playNext();
}


// ---------------------------------------------------------
// 6) DIALOG MED PAUSE (dialog2)
// ---------------------------------------------------------

function runDialogPause(dialog1, dialog2) {

  playDialogControlled(dialog1, () => {

    showNextButton();

    nextBtn.onclick = () => {
      hideNextButton();

      playDialogControlled(dialog2, () => {
        nextStep();
      });
    };
  });
}


// ---------------------------------------------------------
// 7) PANEL-STYRING
// ---------------------------------------------------------

function showExplorePanel() {
  resetDigitFields();
  document.querySelector(".panel-udforsk").style.display = "block";
}

function hideExplorePanel() {
  document.querySelector(".panel-udforsk").style.display = "none";
}

function showCodePanel() {
  resetDigitFields();
  document.querySelector(".panel:nth-of-type(2)").style.display = "block";
}

function hideCodePanel() {
  document.querySelector(".panel:nth-of-type(2)").style.display = "none";
}


// ---------------------------------------------------------
// 8) INPUT HJÆLPERE
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
// 9) AUTOFOKUS, BACKSPACE, OVERSKRIVNING & AUTO-CLEAR
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

  if (e.target.value.length > 1) {
    e.target.value = e.target.value.slice(-1);
  }

  e.target.classList.add("filled");

  if (index < inputs.length - 1) {
    inputs[index + 1].focus();
  }
});

document.addEventListener("keydown", e => {
  if (!e.target.classList.contains("digit")) return;

  const inputs = [...document.querySelectorAll(".digit")];
  const index = inputs.indexOf(e.target);

  if (e.key === "Backspace") {

    if (e.target.value !== "") {
      e.target.value = "";
      e.target.classList.remove("filled");
      e.preventDefault();
      return;
    }

    if (index > 0) {
      inputs[index - 1].focus();
      inputs[index - 1].value = "";
      inputs[index - 1].classList.remove("filled");
      e.preventDefault();
    }
  }
});


// ---------------------------------------------------------
// 10) RESET + AUTO-FOKUS (kun hvis dialog ikke er aktiv)
// ---------------------------------------------------------

function resetDigitFields() {
  const inputs = document.querySelectorAll(".digit");

  inputs.forEach(input => {
    input.value = "";
    input.classList.remove("filled");
  });

  const dialogArea = document.getElementById("dialogArea");
  if (dialogArea.style.display === "block") return;

  if (inputs.length > 0) inputs[0].focus();
}


// ---------------------------------------------------------
// 11) BONUS-INTERACTIONS (3-CIFRET)
// ---------------------------------------------------------

const interactions = {
  "854+259": {
    dialog: [
      { text: "Malthe: Feeedt!", sound: "Malthe_1.mp3" },
      { text: "<br>Josephine: Pas lige på med den der!", sound: "Josephine_1.mp3" }
    ]
  },
  "854": {
    dialog2: {
      first: [
        { text: "Malthe: Sejt en NerfGun, men hvor finder vi skumpilene til den?", sound: "Malthe_1.mp3" },
        { text: "Josephine: Måske i nogle af de andre skuffer...?", sound: "Josephine_1.mp3" }
      ],
      second: [
        { text: "Tag kort 04", sound: null }
      ]
    }
  },
  "259": {
    dialog2: {
      first: [
        { text: "Malthe: Der er godt nok mange skumpile i den skuffe der.", sound: "Malthe_1.mp3" }
      ],
      second: [
        { text: "Tag kort 05", sound: null }
      ]
    }
  },
  "418+951": {
    dialog: [
      { text: "Malthe: Tænk at det virkede!", sound: null },
      { text: "<br>Josephine: Bare det kan dreje rundt!", sound: null }
    ]
  }
};


// ---------------------------------------------------------
// 12) BONUS-KODER (4-CIFRET)
// ---------------------------------------------------------

const codes = {
  "5287": {
    dialog: [
      { text: "Josephine: Du løste koden!", sound: null },
      { text: "<br>Malthe: Hvad har du fundet?", sound: null }
    ]
  }
};


// ---------------------------------------------------------
// 13) FLOW-SPECIFIKKE KODER
// ---------------------------------------------------------

const flowExploreCodes = {
  1: ["854"],
  2: ["259"],
  3: ["854+259", "259+854"],
  4: ["418+951", "951+418"]
};

const flowCodeCodes = {
  5: "5287"
};


// ---------------------------------------------------------
// 14) NERF-GUN (uden NÆSTE)
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


// ---------------------------------------------------------
// 15) FEJL-REAKTIONER
// ---------------------------------------------------------

const errorReactions = [
  [{ text: "Malthe: Det var ikke helt rigtigt...", sound: null }],
  [{ text: "Josephine: Nope, prøv igen!", sound: null }],
  [{ text: "Malthe: Hmm… det der virkede ikke.", sound: null }],
  [{ text: "Josephine: Det må være en anden kombination.", sound: null }],
  [{ text: "Malthe: Du skal nok finde den!", sound: null }]
];

let errorIndex = 0;

function getNextErrorReaction() {
  const r = errorReactions[errorIndex];
  errorIndex = (errorIndex + 1) % errorReactions.length;
  return r;
}


// ---------------------------------------------------------
// 16) FEJL-DIALOG (uden NÆSTE)
// ---------------------------------------------------------

function playErrorDialog(lines) {
  dialogActive = true;
  let i = 0;

  const dialogArea = document.getElementById("dialogArea");
  dialogArea.style.display = "block";

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

    hideNextButton();
    resetDigitFields();
  }

  showLine();
}


// ---------------------------------------------------------
// 17) HYBRID-LOGIK FOR UDFORSK
// ---------------------------------------------------------

function interact() {
  const A = get3("A");
  const B = get3("B");

  let key1 = A && B ? `${A}+${B}` : A || B;
  let key2 = A && B ? `${B}+${A}` : "";

  hideNextButton();

  if (A === nerfCode || B === nerfCode) {
    playDialogControlled(getNextNerfReaction(), () => {
      dialogActive = false;
      hideNextButton();
      resetDigitFields();
    });
    return;
  }

  const result = interactions[key1] || interactions[key2];

  if (result) {

    if (result.dialog2) {
      runDialogPause(
        result.dialog2.first,
        result.dialog2.second
      );
      resetDigitFields();
      return;
    }

    if (result.dialog) {
      playDialogControlled(result.dialog, () => {
        dialogActive = false;
        hideNextButton();
        resetDigitFields();
      });
      return;
    }
  }

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

  playErrorDialog(getNextErrorReaction());
}


// ---------------------------------------------------------
// 18) HYBRID-LOGIK FOR KODE
// ---------------------------------------------------------

function checkCode() {
  const code = get4();

  hideNextButton();

  const result = codes[code];
  if (result) {
    playDialogControlled(result.dialog, () => {
      dialogActive = false;
      hideNextButton();
      resetDigitFields();
    });
  }

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

  playErrorDialog(getNextErrorReaction());
}


// ---------------------------------------------------------
// 19) HINT-SYSTEM
// ---------------------------------------------------------

const hints = [
  [{ text: "Malthe: Kig på tallene igen!", sound: null }],
  [{ text: "Josephine: Måske skal du prøve en anden kombination?", sound: null }],
  [{ text: "Malthe: Du er tæt på!", sound: null }]
];

function showHint() {
  if (dialogActive) return;

  hideNextButton();

  playDialogControlled(hints[flowIndex] || [
    { text: "Malthe: Jeg har ikke flere hints!", sound: null }
  ], () => {
    dialogActive = false;
    hideNextButton();
    resetDigitFields();
  });
}


// ---------------------------------------------------------
// 20) DIT LINEÆRE FLOW
// ---------------------------------------------------------

flowSteps = [

  {
    type: "dialog2",
    run: () => runDialogPause(
      [
        { text: "Malthe: Yes, lad os så fange en Yeti.", sound: "Malthe_1.mp3" },
        { text: "<br>Josephine: Kunne det være en ide at vi holder vagt?", sound: "Josephine_1.mp3" },
        { text: "<br>Malthe: God ide Jose, oppe fra udkigsposten?", sound: null },
        { text: "<br>Josephine: Ja, vi kan sagtens hjælpe deroppefra.", sound: null }
      ],
      [
        { text: "<br><br>Tag kort 2", sound: null }
      ]
    )
  },

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
    type: "dialog2",
    run: () => runDialogPause(
      [
        { text: "Malthe: Du fangede Yetien!", sound: "malthe_win.mp3" },
        { text: "<br>Josephine: Godt gået!", sound: "josephine_win.mp3" }
      ],
      [
        { text: "<br><br>Tak for spillet!", sound: null }
      ]
    )
  }
];
