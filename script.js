// -----------------------------
// SPIL-STATE (styrer hvor vi er i historien)
// -----------------------------
let gameState = "start"; // start-state


// -----------------------------
// DIALOGDATA
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

const codes = {
  "5287": {
    dialog: [
      { text: "Josephine: Du løste koden!", sound: null },
      { text: "Malthe: Hvad har du fundet?", sound: null }
    ]
  }
};


// -----------------------------
// FLOW-MOTOR
// -----------------------------

let dialogQueue = [];
let nextAction = null;

function playDialog(lines) {
  dialogQueue = lines;

  const fullText = lines.map(l => l.text).join("\n");
  document.getElementById("dialogText").innerText = fullText;

  if (lines[0].sound) {
    const audio = new Audio("assets/lyd/" + lines[0].sound);
    audio.play();
  }

  document.getElementById("nextBtn").classList.add("active");
}

function nextDialog() {
  document.getElementById("nextBtn").classList.remove("active");

  if (nextAction) {
    const action = nextAction;
    nextAction = null;
    action();
  }
}


// -----------------------------
// FLOW-FUNKTION
// -----------------------------

function flow(steps) {
  let index = 0;

  function runNext() {
    if (index < steps.length) {
      const step = steps[index];
      index++;

      step();
      nextAction = runNext;
    } else {
      nextAction = null;
      console.log("Flow færdigt");
    }
  }

  runNext();
}


// -----------------------------
// HJÆLPEFUNKTION: "Tag kort X"
// -----------------------------

function showCardInstruction(cardNumber) {
  playDialog([
    { text: `Tag kort ${cardNumber}`, sound: null }
  ]);
}


// -----------------------------
// UDFORSK
// -----------------------------

function interact() {
  const a = document.getElementById("interactA").value.trim();
  const b = document.getElementById("interactB").value.trim();

  let key1 = "";
  let key2 = "";

  if (a && b) {
    key1 = `${a}+${b}`;
    key2 = `${b}+${a}`;
  } else if (a) {
    key1 = a;
  } else if (b) {
    key1 = b;
  }

  const result = interactions[key1] || interactions[key2];

  if (!result) {
    gameState = "wrong_interaction";

    flow([
      () => playDialog([
        { text: "Malthe: Hmm… det virkede vist ikke.", sound: null },
        { text: "Josephine: Prøv en anden kombination!", sound: null }
      ])
    ]);
    return;
  }

  // Eksempel: 854+259 har et særligt flow
  if (key1 === "854+259" || key2 === "854+259") {
    gameState = "after_854_259";

    flow([
      () => playDialog(result.dialog),
      () => showCardInstruction(12),
      () => playDialog([
        { text: "Malthe: Det kort var vigtigt!", sound: null }
      ])
    ]);
  }

  // Eksempel: 418+951 har et andet flow
  else if (key1 === "418+951" || key2 === "418+951") {
    gameState = "after_418_951";

    flow([
      () => playDialog(result.dialog)
    ]);
  }
}


// -----------------------------
// KODE
// -----------------------------

function checkCode() {
  const input = document.getElementById("codeInput").value.replace(/\s+/g, "");
  const result = codes[input];

  if (!result) {
    gameState = "wrong_code";

    flow([
      () => playDialog([
        { text: "Josephine: Den kode passer vist ikke...", sound: null },
        { text: "Malthe: Prøv igen!", sound: null }
      ])
    ]);
    return;
  }

  if (input === "5287") {
    gameState = "after_code_5287";

    flow([
      () => playDialog(result.dialog),
      () => showCardInstruction(5),
      () => playDialog([
        { text: "Josephine: Det her bliver spændende!", sound: null }
      ])
    ]);
  }
}


// -----------------------------
// HINT (dynamisk baseret på state)
// -----------------------------

function showHint() {
  if (gameState === "start") {
    flow([
      () => playDialog([
        { text: "Malthe: Måske skal du prøve at taste nogle tal?", sound: null }
      ])
    ]);
  }

  else if (gameState === "after_854_259") {
    flow([
      () => playDialog([
        { text: "Josephine: Kort 12 viser noget vigtigt!", sound: null }
      ])
    ]);
  }

  else if (gameState === "after_418_951") {
    flow([
      () => playDialog([
        { text: "Malthe: Noget drejer rundt… måske skal du kigge efter noget rundt?", sound: null }
      ])
    ]);
  }

  else if (gameState === "after_code_5287") {
    flow([
      () => playDialog([
        { text: "Josephine: Koden afslørede noget… måske skal du bruge det nu?", sound: null }
      ])
    ]);
  }

  else if (gameState === "wrong_interaction") {
    flow([
      () => playDialog([
        { text: "Malthe: Det var vist ikke rigtigt… prøv en anden kombination!", sound: null }
      ])
    ]);
  }

  else if (gameState === "wrong_code") {
    flow([
      () => playDialog([
        { text: "Josephine: Koden var forkert… måske står den et sted?", sound: null }
      ])
    ]);
  }

  else {
    flow([
      () => playDialog([
        { text: "Josephine: Jeg er ikke helt sikker… prøv noget andet!", sound: null }
      ])
    ]);
  }
}
