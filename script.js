const interactions = {
  "854+259": 
  { dialog: [
  { text: "Malthe: Feeedt!", sound: "Malthe_1.mp3" },
  { text: "Josephine: Pas lige på med den der!", sound: "Josephine_1.mp3" }
] },
  "418+951": 
  { dialog: [
    { text: "Malthe: Tænk at det virkede!", sound: null },
    { text: "Josephine: Bare det kan dreje rundt!", sound: null }
  ] }
};

const codes = {
  "5287": { dialog: [
    { text: "Josephine: Du løste koden!", sound: null },
    { text: "Malthe: Hvad har du fundet?", sound: null }
  ] }
};

let dialogQueue = [];

// UDFORSK
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

  console.log("key1:", key1, "key2:", key2);

  const result = interactions[key1] || interactions[key2];

  if (result) {
    playDialog(result.dialog);
  } else {
    playDialog([
  { text: "Malthe: Hmm… det virkede vist ikke.", sound: null },
  { text: "Josephine: Prøv en anden kombination!", sound: null }
  ]);
  }
}

// KODE
function checkCode() {
  const input = document.getElementById("codeInput").value.replace(/\s+/g, "");
  const result = codes[input];
  if (result) playDialog(result.dialog);
  else playDialog([
  { text: "Josephine: Den kode passer vist ikke...", sound: null },
  { text: "Malthe: Prøv igen!", sound: null }
]);

}

// HINT
function showHint() {
 playDialog([
  { text: "Malthe: Måske skal du kigge under kommoden?", sound: null },
  { text: "Josephine: Eller husk symbolerne!", sound: null }
]);
}

// DIALOGSYSTEM
function playDialog(lines) {
  dialogQueue = lines;
  nextDialog();
}

function nextDialog() {
  if (dialogQueue.length === 0) {
    document.getElementById("dialogText").innerText = "";
    return;
  }

  const line = dialogQueue.shift(); // ← nu får vi et objekt

  // Vis tekst
  document.getElementById("dialogText").innerText = line.text;

  // Afspil lyd
  if (line.sound) {
    const audio = new Audio("assets/lyd/" + line.sound);
    audio.play();
  }
}
