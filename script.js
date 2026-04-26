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
let nextAction = null; // hvad der sker, når spilleren trykker "Næste"

function playDialog(lines) {
  dialogQueue = lines;

  // Saml al tekst i én boks
  const fullText = lines.map(l => l.text).join("\n");
  document.getElementById("dialogText").innerText = fullText;

  // Afspil lyd på første linje (hvis der er en)
  if (lines[0].sound) {
    const audio = new Audio("assets/lyd/" + lines[0].sound);
    audio.play();
  }

  // Aktivér Næste-knappen
  document.getElementById("nextBtn").classList.add("active");
}

function nextDialog() {
  // Deaktivér knappen
  document.getElementById("nextBtn").classList.remove("active");

  // Hvis der er sat en handling, udfør den
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

      step();              // kør dette step
      nextAction = runNext; // næste tryk på "Næste" → næste step
    } else {
      // Flow slut
      nextAction = null;
      console.log("Flow færdigt");
    }
  }

  // Start flowet
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
    // Forkert kombination – enkelt flow
    flow([
      () => playDialog([
        { text: "Malthe: Hmm… det virkede vist ikke.", sound: null },
        { text: "Josephine: Prøv en anden kombination!", sound: null }
      ])
    ]);
    return;
  }

  // Eksempel på forskelligt flow afhængigt af kombination
  if (key1 === "854+259" || key2 === "854+259") {
    // Her har du et flow med kort
    flow([
      () => playDialog(result.dialog),
      () => showCardInstruction(12),
      () => playDialog([
        { text: "Malthe: Det kort var vigtigt!", sound: null }
      ])
    ]);
  } else {
    // Standard: kun dialog, ingen kort
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
    flow([
      () => playDialog([
        { text: "Josephine: Den kode passer vist ikke...", sound: null },
        { text: "Malthe: Prøv igen!", sound: null }
      ])
    ]);
    return;
  }

  // Eksempel: korrekt kode giver dialog + kort + mere dialog
  if (input === "5287") {
    flow([
      () => playDialog(result.dialog),
      () => showCardInstruction(5),
      () => playDialog([
        { text: "Josephine: Det her bliver spændende!", sound: null }
      ])
    ]);
  } else {
    // fallback hvis du senere tilføjer flere koder
    flow([
      () => playDialog(result.dialog)
    ]);
  }
}


// -----------------------------
// HINT
// -----------------------------

function showHint() {
  flow([
    () => playDialog([
      { text: "Malthe: Måske skal du kigge under kommoden?", sound: null },
      { text: "Josephine: Eller husk symbolerne!", sound: null }
    ])
  ]);
}
