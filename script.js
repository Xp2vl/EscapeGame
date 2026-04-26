const interactions = {
  "854+259": { dialog: ["Malthe: Feeedt!", "Josephine: Pas lige på med den der!"] },
  "418+951": { dialog: ["Malthe: Tænk at det virkede!", "Josephine: Bare det kan dreje rundt!"] }
};

const codes = {
  "5287": { dialog: ["Josephine: Du løste koden!", "Malthe: Hvad har du fundet?"] }
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
      "Malthe: Hmm… det virkede vist ikke.",
      "Josephine: Prøv en anden kombination!"
    ]);
  }
}

// KODE
function checkCode() {
  const input = document.getElementById("codeInput").value.replace(/\s+/g, "");
  const result = codes[input];
  if (result) playDialog(result.dialog);
  else playDialog(["Josephine: Den kode passer vist ikke...", "Malthe: Prøv igen!"]);
}

// HINT
function showHint() {
  playDialog(["Malthe: Måske skal du kigge under kommoden?", "Josephine: Eller husk symbolerne!"]);
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
  document.getElementById("dialogText").innerText = dialogQueue.shift();
}
