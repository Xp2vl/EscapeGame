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
  nextBtn.style.visibility = "visible";   // gør knappen synlig
  nextBtn.classList.add("active");
}

function hideNextButton() {
  nextBtn.style.visibility = "hidden";    // skjul knappen men behold pladsen
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

function runDialogPause(...dialogParts) {
  // dialogParts er et array af dialog arrays
  // fx [first, second, third, fourth, fifth]

  let index = 0;

  function playPart() {
    const part = dialogParts[index];

    playDialogControlled(part, () => {

      index++;

      // Hvis der er flere dele → vis NÆSTE
      if (index < dialogParts.length) {
        showNextButton();
        nextBtn.onclick = () => {
          hideNextButton();
          playPart();
        };
      } else {
        // Sidste del → afslut
        dialogActive = false;
        nextStep();
      }
    });
  }

  playPart();
}


// ---------------------------------------------------------
// 7) PANEL-STYRING
// ---------------------------------------------------------

function showExplorePanel() {
  resetDigitFields();
}

function hideExplorePanel() {
}

function showCodePanel() {
  resetDigitFields();
}

function hideCodePanel() {
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

  if (!dialogActive && inputs.length > 0) {
    inputs[0].blur();
    inputs[0].focus();
  }
}


// ---------------------------------------------------------
// 11) BONUS-INTERACTIONS (3-CIFRET)
// ---------------------------------------------------------

const interactions = {
  "854": {
    dialog2: {
      first: [
        { text: "Malthe: Sejt en NerfGun, men hvor finder vi skumpilene til den?", sound: "Malthe_1.mp3" },
        { text: "<br>Josephine: Måske i nogle af de andre skuffer", sound: "Josephine_1.mp3" }
      ],
      second: [
        { text: "<b>Tag kort 03</b>", sound: null }
      ]
    }
  },
  
  "259": {
    dialog2: {
      first: [
        { text: "Malthe: Der er godt nok mange skumpile i den skuffe", sound: "Malthe_1.mp3" }
      ],
      second: [
        { text: "<b>Tag kort 04</b>", sound: null }
      ]
    }
  },
  
  "384+464": {
    dialog2: {
      first: [
        { text: "Malthe: Feeedt!", sound: "Malthe_1.mp3" },
        { text: "<br>Josephine: Pas lige på med ikke at ødelægge noget med den der", sound: "Josephine_1.mp3" },
        { text: "<br>Malthe: Der ligger noget under kommoden", sound: "Malthe_1.mp3" }
      ],
      second: [
         { text: "<b>Tag kort 05</b>", sound: null },
         { text: "<br><b>Tag kort 06</b>", sound: null }
      ]
    }
  },

  "244+962": {
    dialog: [
      { text: "<b>Tag kort 07</b>", sound: null },
      { text: "<br><b>Tag kort 08</b>", sound: null }
    ]
  },
 
  "625+415": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 11</b>", sound: null }
      ],
      second: [
        { text: "Malthe: ååårh ja, du ramte den lige i smasken og i første forsøg.", sound: null },
        { text: "<br>Josephine: Det er bedre end dig Malthe!", sound: null },
        { text: "<br>Malthe: Jeg kunne også sagtens ramme Yetien, hvis jeg stod så tæt på.", sound: null },
        { text: "<br>Josephine: Som om...", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 12</b>", sound: null }
      ]
    }
  },

  "689+348": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 13</b>", sound: null },
        { text: "<br><b>Tag kort 14</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Det da også rigtigt, Yeti figuren skal stå på piedestalen.", sound: null },
        { text: "<br>Malthe: Godt set.", sound: null },
        { text: "<br>Josephine: Helt sikkert.", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 15</b>", sound: null },
        { text: "<br><b>Tag kort 16</b>", sound: null },
        { text: "<br><b>Tag kort 17</b>", sound: null }
      ]
    }
  },

  "522+158": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 19</b>", sound: null }
      ],
      second: [
        { text: "Malthe: Der er godt nok mange penge i den sparegris!", sound: null },
        { text: "<br>Josephine: Det er fra når jeg hjælper mormor med rengøring.", sound: null },
        { text: "<br>Malthe: Okay... Det skulle jeg have mere for...", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 20</b>", sound: null }
      ]
    }
  },

  "816+527": {
    dialog: [
      { text: "<b>Tag kort 21</b>", sound: null }
    ]
  },

  "252+952": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 22</b>", sound: null }
      ],
      second: [
        { text: "Malthe: Hvad skal vi med de kæmpe tyggegummier?", sound: null },
        { text: "<br>Josephine: De smager ikke godt særlig længe!", sound: null },
        { text: "<br>Malthe: Jeg tror den kødædende plante kan li' dem.", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 23</b>", sound: null }
      ]
    }
  },
 
  "598+324": {
    dialog2: {
      first: [
        { text: "Malthe: Er det bare mig eller ligner det at den vokser?", sound: null },
        { text: "<br>Josephine: Den vokser sygt meget hurtigt...", sound: null },
        { text: "<br>Malthe: Det da for vildt, af 1 tyggegummi.. Hva' er det for noget tyggegummi?", sound: null },
        { text: "<br>Josephine: Det ved jeg ikke, men jeg tror det er for gammelt.", sound: null },
        { text: "<br>Malthe: Og jeg var lige ved at spise et også.", sound: null }
      ],
      second: [
        { text: "<b>Tag kort 24</b>", sound: null }
      ]
    }
  },

  "249+724": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 25</b>", sound: null }
      ],
      second: [
        { text: "Josephine: De lianer kan vi da bruge som reb.", sound: null },
        { text: "<br>Malthe: Det kan vi da, godt tænkt Jose.", sound: null },
        { text: "<br>Josephine: Måske er der gemt noget i den lille kiste vi kan bruge til fælden.", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 26</b>", sound: null },
        { text: "<br><b>Tag kort 27</b>", sound: null }
      ],
      fourth: [
        { text: "Malthe: Jeg tror radioen mangler batterier.", sound: null },
        { text: "<br>Josephine: Der burde være batterier i væguret.", sound: null },
        { text: "<br>Malthe: Er det de samme batterier?", sound: null }
      ],
      fifth: [
        { text: "<b>Tag kort 28</b>", sound: null }
      ]
    }
  },

  "934+714": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 29</b>", sound: null }
      ],
      second: [
        { text: "Malthe: Sejt, det ligner da der er strøm på den. Prøv om den kan spille.", sound: null }
      ]
    }
  },

  "257": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 30</b>", sound: null },
        { text: "<br><b>Tag kort 31</b>", sound: null },
        { text: "<br><b>Tag kort 32</b>", sound: null },
        { text: "<br><b>Tag kort 33</b>", sound: null },
        { text: "<br><b>Tag kort 34</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Det var ikke længe de batterier holdte.", sound: null },
        { text: "<br>Malthe: Men det var da nok til at få kisten til at åbne.", sound: null },
        { text: "<br>Josephine: Vær forsigtig med skatten, jeg har selv fundet alt sammen fra græske øer.", sound: null },
        { text: "<br>Malthe: Konkylien ser ret tung ud, kan vi ikke bruge den som vægtlod?", sound: null },
        { text: "<br>Josephine: Det da en rigtig god idé!", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 35</b>", sound: null }
      ],
      fourth: [
        { text: "Malthe: Kunne det tænkes der var noget lokkemad i køleboksen?", sound: null },
        { text: "<br>Josephine: Det er der, jeg puttede i hvert fald min havregrød i den i morges.", sound: null },
        { text: "<br>Malthe: Aaaad, havregrød, det der da ingen der gider spise.", sound: null },
        { text: "<br>Josephine: Hvorfor tror du jeg ikke har spist den?", sound: null },
      ],
      fifth: [
        { text: "<b>Tag kort 36</b>", sound: null }
      ]
    }
  },

  "214+927": {
    dialog: [
      { text: "Josephine: Så skal du bare starte den.", sound: null }
    ]
  },

  "236": {
    dialog2: {
      first: [
        { text: "<b>Ding...</b>", sound: null }
      ],
      second: [
        { text: "<b>Tag kort 40</b>", sound: null }
      ],
      third: [
        { text: "Josephine: Der skal sukker på, er sikker på yetier foretrækker den sød.", sound: null },
        { text: "<br>Malthe: Der skal bare massere af sukker på.", sound: null },
        { text: "<br>Josephine: Malthe havde sikkert puttet hele skålen på.", sound: null },
        { text: "<br>Malthe: Sku'da ikke hele skålen... Bare det der er i skålen.", sound: null }
      ]
    }
  },

  "333+947": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 41</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Hvad mangler vi så til at bygge fælden?", sound: null },
        { text: "<br>Malthe: Vi mangler stadig noget smørelse til hejsehjulet udenfor!", sound: null },
        { text: "<br>Josephine: Skal vi ikke prøve om syltetøjet kan bruges til at smøre hjulet?", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 42</b>", sound: null }
      ]
    }
  },

  "418+951": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 43</b>", sound: null }
      ],
      second: [
        { text: "Malthe: Tænk at det virkede, hjulet er godt nok lidt snasket.", sound: null },
        { text: "<br>Josephine: Det er lige meget, bare det kan dreje rundt!", sound: null }
      ]
    }
  },

  "958+588": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 44</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Vi mangler da stadig et net til at fange yetien i.", sound: null },
        { text: "<br>Malthe: Jeg tror ikke vi har noget net her.", sound: null },
        { text: "<br>Josephine: Hmm, men vi har tæppet.", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 45</b>", sound: null }
      ]
    }
  },

  "616+794": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 46</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Vi har stadig ikke nogen spand.", sound: null },
        { text: "<br>Malthe: Men vi har en tom køleboks.", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 47</b>", sound: null }
      ]
    }
  },

  "189+894": {
    dialog: [
      { text: "<b>Tag kort 48</b>", sound: null }
    ]
  },

  "295+741": {
    dialog: [
      { text: "<b>Tag kort 49</b>", sound: null }
    ]
  },

  "´873+259": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 50</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Det er en vild fælde vi har lavet.", sound: null },
        { text: "<br>Malthe: Men tror du den er stærk nok til at fange en yeti?", sound: null },
        { text: "<br>Josephine: Det må vi vente og se.", sound: null },
        { text: "<br>Malthe: Skal vi ikke holde øje oppe fra udkigsposten?", sound: null },
        { text: "<br>Josephine: Sshhhh, jeg kan høre noget.", sound: null },
        { text: "<br>Malthe: Du har ret, vi må gemme os.", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 51</b>", sound: null }
      ],
      fourth: [
        { text: "Josephine: Nååårh, den ser da sød ud.", sound: null },
        { text: "<br>Malthe: Fælden var alt for lille.", sound: null },
        { text: "<br>Josephine: Haha, yetien var meget størrer end vi troede.", sound: null },
        { text: "<br>Malthe: Men se dens næse den bliver rød.", sound: null },
        { text: "<br>Josephine: Så fryser den nok ikke mere...", sound: null }
      ]
    }
  }

};


// ---------------------------------------------------------
// 12) BONUS-KODER (4-CIFRET)
// ---------------------------------------------------------

const codes = {
  "5287": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 09</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Du løste koden til den låste skuffe, var det så der jeg havde gemt den?", sound: null },
        { text: "<br>Malthe: Hvad har du fundet?", sound: null },
        { text: "<br>Josephine: Det er da drejehåndtaget til tyggegummiautomaten!", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 10</b>", sound: null }
      ]
    }
  },

  "1482": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 18</b>", sound: null }
      ],
      second: [
        { text: "Josephine: Du fik værktøjskassen op, FEDT.", sound: null },
        { text: "<br>Malthe: Er der noget brugbart i den?", sound: null }
      ]
    }
  },
  
  "6595": {
    dialog2: {
      first: [
        { text: "<b>Tag kort 37</b>", sound: null }
      ],
      second: [
        { text: "Malthe: Mmmm, kold havregrød...", sound: null }
      ],
      third: [
        { text: "<b>Tag kort 38</b>", sound: null }
      ],
      fourth: [
        { text: "Josephine: Du kan varme den i microovnen.", sound: null },
        { text: "<br>Malthe: Hvor lang tid skal den ha'?", sound: null },
        { text: "<br>Josephine: Til den er varm, 3 minutter måske.", sound: null }
      ],
      fifth: [
        { text: "<b>Tag kort 39</b>", sound: null }
      ]
    }
  }  
  
};

// ---------------------------------------------------------
// 13) FLOW-SPECIFIKKE KODER
// ---------------------------------------------------------

const flowExploreCodes = {
  1: ["854"], //Step 2
  2: ["259"], //Step 3
  3: ["384+464", "464+384"], //Step 4
  4: ["244+962", "962+244"], //Step 5
  6: ["625+415", "415+625"], //Step 7
  7: ["689+348", "348+689"], //Step 8
  9: ["522+158", "158+522"], //Step 10
  10: ["816+527", "527+816"], //Step 11
  11: ["252+952", "952+252"], //Step 12 
  12: ["598+324", "324+598"], //Step 13
  13: ["249+724", "724+249"], //Step 14
  14: ["934+714", "714+934"], //Step 15
  15: ["257"], //Step 16
  16: ["214+927", "927+214"], //Step 18
  17: ["236"], //Step 19
  18: ["333+947", "947+333"], //Step 20
  19: ["418+951", "951+418"], //Step 21
  20: ["958+588", "588+958"], //Step 22
  21: ["616+794", "794+616"], //Step 23
  22: ["189+894", "894+189"], //Step 24
  23: ["295+741", "741+295"], //Step 25
  24: ["873+259", "259+873"] //Step 26
};

const flowCodeCodes = {
  5: "5287", //Step 6
  8: "1482", //Step 9
  16: "6595" //Step 17
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

  // dialogArea.style.display = "block";  ← FJERN DENNE LINJE

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
  if (dialogActive) return;

  const A = get3("A");
  const B = get3("B");

  let key1 = A && B ? `${A}+${B}` : A || B;
  let key2 = A && B ? `${B}+${A}` : "";

  hideNextButton();

// NERF (men IKKE hvis det er 625+415 eller 415+625)
if (
  (A === nerfCode || B === nerfCode) &&
  !((A === "625" && B === "415") || (A === "415" && B === "625"))
) {

    const reaction = getNextNerfReaction()[0];

    dialogText.innerHTML = reaction.text;

    if (reaction.sound) {
        const audio = new Audio("assets/lyd/" + reaction.sound);
        audio.play();
    }

    resetDigitFields();
    return;
}

  // FLOW
  const correct = flowExploreCodes[flowIndex];

  if (
    flowSteps[flowIndex].type === "explore" &&
    correct &&
    (correct.includes(key1) || correct.includes(key2))
  ) {
    nextStep();
    return;
  }

  // BONUS
const result = interactions[key1] || interactions[key2];

if (result) {
  if (result.dialog2) {
    runDialogPause(
      ...Object.values(result.dialog2)
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

  if (result.dialog) {
    playDialogControlled(result.dialog, () => {
      dialogActive = false;
      hideNextButton();
      resetDigitFields();
    });
    return;
  }


// FEJL
playErrorDialog(getNextErrorReaction());
}


// ---------------------------------------------------------
// 18) HYBRID-LOGIK FOR KODE
// ---------------------------------------------------------

function checkCode() {
  if (dialogActive) return;

  const code = get4();

  hideNextButton();

const result = codes[code];

if (result) {
  if (result.dialog2) {
    runDialogPause(
      ...Object.values(result.dialog2)
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

const correct = flowCodeCodes[flowIndex];

  if (
    flowSteps[flowIndex].type === "code" &&
    correct &&
    code === correct
  ) {
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
    // INGEN display = "none" her
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
        { text: "Malthe: Yes, lad os så fange en Yeti", sound: "Malthe_1.mp3" },
        { text: "<br>Josephine: Kunne det være en ide at vi holder vagt?", sound: "Josephine_1.mp3" },
        { text: "<br>Malthe: God ide Jose, oppe fra udkigsposten?", sound: null },
        { text: "<br>Josephine: Ja, vi kan sagtens hjælpe deroppefra", sound: null },
        { text: "<br>Josephine: Der er sikkert noget du kan bruge i kommoden", sound: null }
      ],
      [
        { text: "<b>Tag kort 2</b>", sound: null }
      ]
    )
  },

  { type: "explore", run: () => showExplorePanel() }, // Step 2
  { type: "explore", run: () => showExplorePanel() }, // Step 3
  { type: "explore", run: () => showExplorePanel() }, // Step 4
  { type: "explore", run: () => showExplorePanel() }, // Step 5
 
  { type: "code", run: () => showCodePanel() }, // Step 6

  { type: "explore", run: () => showExplorePanel() }, // Step 7
  { type: "explore", run: () => showExplorePanel() }, // Step 8

  { type: "code", run: () => showCodePanel() }, // Step 9

  { type: "explore", run: () => showExplorePanel() }, // Step 10
  { type: "explore", run: () => showExplorePanel() }, // Step 11
  { type: "explore", run: () => showExplorePanel() }, // Step 12
  { type: "explore", run: () => showExplorePanel() }, // Step 13
  { type: "explore", run: () => showExplorePanel() }, // Step 14
  { type: "explore", run: () => showExplorePanel() }, // Step 15
  { type: "explore", run: () => showExplorePanel() }, // Step 16

  { type: "code", run: () => showCodePanel() }, // Step 17

  { type: "explore", run: () => showExplorePanel() }, // Step 18
  { type: "explore", run: () => showExplorePanel() }, // Step 19
  { type: "explore", run: () => showExplorePanel() }, // Step 20
  { type: "explore", run: () => showExplorePanel() }, // Step 21
  { type: "explore", run: () => showExplorePanel() }, // Step 22
  { type: "explore", run: () => showExplorePanel() }, // Step 23
  { type: "explore", run: () => showExplorePanel() }, // Step 24
  { type: "explore", run: () => showExplorePanel() }, // Step 25
  { type: "explore", run: () => showExplorePanel() } // Step 26

//  {
//    type: "dialog2",
//    run: () => runDialogPause(
//      [
//        { text: "Malthe: Du fangede Yetien!", sound: "malthe_win.mp3" },
//        { text: "<br>Josephine: Godt gået!", sound: "josephine_win.mp3" }
//      ],
//      [
//        { text: "<br><br>Tak for spillet!", sound: null }
//      ]
//    )
//  }
];
