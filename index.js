// SELECTORS =======================================================
let allCards = document.querySelectorAll(".card");
let scoreDisplay = document.querySelector(".score");
let scoreText = document.querySelector(".score-text");
let cardParent = document.querySelector(".card-set");
let easyBtn = document.querySelector("#easy-btn");
let medBtn = document.querySelector("#med-btn");
let hardBtn = document.querySelector("#hard-btn");
let resetBtn = document.querySelector("#reset-btn");
let playAgainBtn = document.querySelector("#play-again-btn");
let winText = document.querySelector(".win-text");

// VARIABLES =======================================================
let cardBackMaterials = [
  "bananas", "cinnamon", "feather", "flower",
  "hammock", "mountain", "paper-cranes", "rice",
  "tea", "stones", "tree", "seafoam", "toy-giraffe",
  "water", "waterfall", "wind-chimes"
];
let cardBacks = [];
let userClicks = [];
let score = 0;
let cardLevel = 6;

// SOUNDS ==========================================================
let clickSound = new Audio("sounds/click.ogg");
let correctSound = new Audio("sounds/correct.ogg");
let winSound = new Audio("sounds/win.ogg");

// GAME INIT =======================================================
function init() {
  setUpRound();
  // cardListeners();
  btnListeners();
}

init();

// #### GAME SETUP HELPER FUNCTIONS ##################################
// SETUP ROUND FUNCTION ================================================
function setUpRound() {
  generateMaterials();
  score = 0;
  scoreDisplay.innerText = score;
  // reset user clicks
  userClicks = [];
  // Hide win text
  winText.classList.add("d-none");
}

// GENERATE CARD DECK MATERIALS ===================================
function generateMaterials() {
  // make sure cardBaks is empty before filling it
  cardBacks = [];

  // create a copy of cardBackMaterials to work with
  let backMaterialsCopy = cardBackMaterials.slice();

  // randomize to pick a material
  /// record into an array until length of cardLevel
  while (cardBacks.length < cardLevel) {

    let randomIdx = Math.floor(Math.random() * backMaterialsCopy.length);
    let randomPair = backMaterialsCopy[randomIdx];
    cardBacks.push(randomPair, randomPair);
    backMaterialsCopy.splice(randomIdx, 1);
  }

  // shuffle array with random numbers
  shuffleCards();
}

// SHUFFLE THE CARD DECK ===========================================
function shuffleCards() {
  let cardsCopy = cardBacks.slice();

  for (let i = 0; cardsCopy.length > 0; i++) {
    let randomIdx = Math.floor(Math.random() * cardsCopy.length);

    cardBacks[i] = cardsCopy[randomIdx];
    cardsCopy.splice(randomIdx, 1);
  }
  cardListeners();
}

// CARD LISTENERS============================================
function cardListeners(){
  allCards.forEach(function(card, i){
    card.addEventListener("click", function(){

      // Play sound
      clickSound.play();
      // If user clicked an already flipped card
      // let them "undo" their move
      if (i === userClicks[0]) {

        unflipCard(allCards[userClicks[0]]);
        userClicks = [];
      } else {

        // flip card over
        flipCard(card, i);

        // record clicked card text into userClicks
        userClicks.push(i);

        // Check if two clicked and matches
        if (userClicks.length === 2) {
          checkMatch();
        }
      }
    });
  });
}


// BUTTON LISTENERS ================================================
function btnListeners(){

  easyBtn.addEventListener("click", function(){
    cardLevel = 6;
    easyBtn.classList.add("active-level");
    medBtn.classList.remove("active-level");
    hardBtn.classList.remove("active-level");
    createCards();
  });

  medBtn.addEventListener("click", function(){
    cardLevel = 10;
    easyBtn.classList.remove("active-level");
    medBtn.classList.add("active-level");
    hardBtn.classList.remove("active-level");
    createCards();
  });

  hardBtn.addEventListener("click", function(){
    cardLevel = 16;
    easyBtn.classList.remove("active-level");
    medBtn.classList.remove("active-level");
    hardBtn.classList.add("active-level");
    createCards();
  });

  resetBtn.addEventListener("click", function(){
    createCards();
  });

  playAgainBtn.addEventListener("click", function(){
    resetBtn.click();
  });
}

// REMOVE ALL CARDS ==============================================
function removeCards() {
  allCards = document.querySelectorAll(".card");
  allCards.forEach(function(card){
    card.remove();
  });
}

// CREATE CARDS ==================================================
function createCards() {
  removeCards();
  for (let i = 0; i < cardLevel; i++) {
    let clone = allCards[0].cloneNode(true);
    clone.style.backgroundImage = "";
    clone.classList.remove("invisible");
    clone.classList.remove("card-back");
    clone.classList.add("card-front");
    cardParent.appendChild(clone);
  }

  // set up wht selector for all cards again to select all the new cards
  allCards = document.querySelectorAll(".card");
  setUpRound();
}

// #### DURING GAMEPLAY FUNCTIONS ##################################
// CHECK IF CLICKED CARDS MATCH ====================================
function checkMatch() {

  let card0 = allCards[userClicks[0]];
  let card1 = allCards[userClicks[1]];

  // reset user clicks
  userClicks = [];

  // if match
  if (card0.style.backgroundImage === card1.style.backgroundImage) {
    setTimeout(function () {
      // hide both cards
      vanishCard(card0);
      vanishCard(card1);
      // update score
      scoreUp();
    }, 900);
  } else {
    setTimeout(function () {
      // if no match, unflip cards
      unflipCard(card0);
      unflipCard(card1);
    }, 900);
  }

  setTimeout(function () {
    checkWin();
  }, 1500);
}

// VANISH CARD EFFECT =============================================
function vanishCard(card) {
  card.classList.add("invisible");
  card.style.backgroundImage = "";
}

// FLIP CARD =======================================================
function flipCard(card, i) {
  card.classList.add("card-back");
  card.classList.remove("card-front");

  // show image
  card.style.backgroundImage = "url(images/" + cardBacks[i] +".jpg)";
}

// UNFLIP CARD =====================================================
function unflipCard(card) {
  card.style.backgroundImage = "";
  card.classList.remove("card-back");
  card.classList.add("card-front");
}

// SCORE UP =========================================================
function scoreUp() {

  // add score
  score++;
  scoreDisplay.innerText = score;
  correctSound.play();
}

// CHECK IF USER HAS FOUND ALL MATCHES ==============================
function checkWin() {
  if (score * 2 === cardLevel) {
    winSound.play();
    winText.classList.remove("d-none");
  }
}
