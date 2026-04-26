const interactions = {
  "854+259": { dialog: ["Malthe: Feeedt!", "Josephine: Pas lige på med den der!"] },
  "418+951": { dialog: ["Malthe: Tænk at det virkede!", "Josephine: Bare det kan dreje rundt!"] }
};

const codes = {
  "5287": { dialog: ["Josephine: Du løste koden!", "Malthe: Hvad har du fundet?"] }
};

let dialogQueue = [];

function interact() {
  const a = document.getElementById("interactA").value.trim();
  const b = document.getElementById("interactB").value.trim();

  let key = "";
  let altKey = "";

  if (a && b) {
    key = `${a}+${b}`;
    altKey = `${b}+${a}`;
  } else if (a) {
    key = a;
  } else if (b) {
    key = b;
  }

  const result = interactions[key] || interactions[altKey];

  if (result) {
    playDialog(result.dialog);
  } else {
    playDialog([
      "Malthe: Hmm… det virkede vist ikke.",
      "Josephine: Prøv en anden kombination!"
    ]);
  }
}

  const result = interactions[key];

  if (result) {
    playDialog(result.dialog);
  } else {
    playDialog([
      "Malthe: Hmm… det virkede vist ikke.",
      "Josephine: Prøv en anden kombination!"
    ]);
  }
}


function checkCode() {
  const input = document.getElementById("codeInput").value.replace(/\s+/g, "");
  const result = codes[input];
  if (result) playDialog(result.dialog);
  else playDialog(["Josephine: Den kode passer vist ikke...", "Malthe: Prøv igen!"]);
}

function showHint() {
  playDialog(["Malthe: Måske skal du kigge under kommoden?", "Josephine: Eller husk symbolerne!"]);
}

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
