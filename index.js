// SELECTORS =======================================================
let allCards = document.querySelectorAll(".card");
let scoreDisplay = document.querySelector(".score");
let cardParent = document.querySelector(".row");
let easyBtn = document.querySelector("#easy-btn");
let medBtn = document.querySelector("#med-btn");
let hardBtn = document.querySelector("#hard-btn");
let resetBtn = document.querySelector("#reset-btn");

// VARIABLES =======================================================
let cardBackMaterials = [
  "Apple", "Hat", "Rock", "Dog",
  "Cup", "Table", "Door", "Plate",
  "Sink", "Boat", "Tree", "Leaf"
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
          // timeout function so user can see back of card
          setTimeout(function () {
            checkMatch();
          }, 1000);
        }
      }
    });
  });
}

// BUTTON LISTENERS ================================================
function btnListeners(){

  easyBtn.addEventListener("click", function(){
    cardLevel = 6;
    // score = 0;
    // scoreDisplay.innerText = score;
    createCards();
  });

  medBtn.addEventListener("click", function(){
    cardLevel = 10;
    // score = 0;
    // scoreDisplay.innerText = score;
    createCards();
  });

  hardBtn.addEventListener("click", function(){
    cardLevel = 16;
    // score = 0;
    // scoreDisplay.innerText = score;
    createCards();
  });

  resetBtn.addEventListener("click", function(){
    // reset user clicks
    userClicks = [];

    createCards();
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
    clone.classList.remove("invisible");
    clone.classList.remove("card-back");
    clone.classList.add("card-front");
    clone.innerText = "Card Front";
    cardParent.appendChild(clone);
  }

  allCards = document.querySelectorAll(".card");
  setUpRound();
}

// #### DURING GAMEPLAY FUNCTIONS ##################################
// CHECK IF CLICKED CARDS MATCH ====================================
function checkMatch() {

  let card0 = allCards[userClicks[0]];
  let card1 = allCards[userClicks[1]];

  // if match
  if (card0.innerText === card1.innerText) {
    // hide both cards
    vanishCard(card0);
    vanishCard(card1);
    // update score
    scoreUp();
    correctSound.play();
  } else {
    // if no match, unflip cards
    unflipCard(card0);
    unflipCard(card1);
  }

  // reset user clicks
  userClicks = [];
  setTimeout(function () {
    checkWin();
  }, 750);
}

// VANISH CARD EFFECT =============================================
function vanishCard(card) {
  card.classList.add("invisible");
}

// FLIP CARD =======================================================
function flipCard(card, i) {
  card.classList.add("card-back");
  card.classList.remove("card-front");

  // add back-values to cards
  card.innerText = cardBacks[i];
}

// UNFLIP CARD =====================================================
function unflipCard(card) {
  card.classList.add("card-front");
  card.classList.remove("card-back");

  // add default text to cards
  card.innerText = "Card Front";
}

// SCORE UP =========================================================
function scoreUp() {
  // add score
  score++;
  scoreDisplay.innerText = score;
}

// CHECK IF USER HAS FOUND ALL MATCHES ==============================
function checkWin() {
  if (score * 2 === cardLevel) {
    winSound.play();
  }
}
