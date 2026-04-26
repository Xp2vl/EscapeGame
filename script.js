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
// FLOW-MOTOR (du styrer alt)
// -----------------------------

let dialogQueue = [];
let nextAction = null; // ← DU bestemmer hvad der sker når spilleren trykker Næste

function playDialog(lines) {
  dialogQueue = lines;

  // Saml al tekst i én boks
  const fullText = lines.map(l => l.text).join("\n");
  document.getElementById("dialogText").innerText = fullText;

  // Afspil lyd på første linje
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

  // Hvis du har sat en handling → udfør den
  if (nextAction) {
    const action = nextAction;
    nextAction = null;
    action();
  }
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

  if (result) {
    // Vis dialogen
    playDialog(result.dialog);

    // Her bestemmer DU hvad der skal ske bagefter
    nextAction = () => {
      console.log("Udforsk-flow færdigt — klar til næste input");
    };

  } else {
    playDialog([
      { text: "Malthe: Hmm… det virkede vist ikke.", sound: null },
      { text: "Josephine: Prøv en anden kombination!", sound: null }
    ]);

    nextAction = () => {
      console.log("Forkert kombination — klar igen");
    };
  }
}


// -----------------------------
// KODE
// -----------------------------

function checkCode() {
  const input = document.getElementById("codeInput").value.replace(/\s+/g, "");
  const result = codes[input];

  if (result) {
    playDialog(result.dialog);

    nextAction = () => {
      console.log("Kode-flow færdigt — klar til næste input");
    };

  } else {
    playDialog([
      { text: "Josephine: Den kode passer vist ikke...", sound: null },
      { text: "Malthe: Prøv igen!", sound: null }
    ]);

    nextAction = () => {
      console.log("Forkert kode — klar igen");
    };
  }
}


// -----------------------------
// HINT
// -----------------------------

function showHint() {
  playDialog([
    { text: "Malthe: Måske skal du kigge under kommoden?", sound: null },
    { text: "Josephine: Eller husk symbolerne!", sound: null }
  ]);

  nextAction = () => {
    console.log("Hint læst — klar igen");
  };
}
