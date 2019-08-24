// SELECTORS =======================================================
const allCards = document.querySelectorAll(".card");
const scoreDisplay = document.querySelector(".score");
const easyBtn = document.querySelector("#easy-btn");
const medBtn = document.querySelector("#med-btn");
const hardBtn = document.querySelector("#hard-btn");

// VARIABLES =======================================================
let cardBackMaterials = [
  "Apple", "Hat", "Rock", "Dog",
  "Cup", "Table", "Door", "Plate",
  "Sink", "Boat", "Tree", "Leaf"
];
let cardBacks = [];
let userClicks = [];
let score = 0;


// GAME INIT =======================================================
function init() {
  setUpRound();
  cardListeners();
  btnListeners();
}

init();

// #### GAME SETUP HELPER FUNCTIONS ##################################
// SETUP ROUND FUNCTION ================================================
function setUpRound() {
  generateMaterials();
  scoreDisplay.innerText = score;
}

// GENERATE CARD DECK MATERIALS ===================================
function generateMaterials() {

  // randomize to pick a material
  /// record into an array until length of 16
  while (cardBacks.length < 16) {

    let randomIdx = Math.floor(Math.random() * cardBackMaterials.length);
    let randomPair = cardBackMaterials[randomIdx];
    cardBacks.push(randomPair, randomPair);
    cardBackMaterials.splice(randomIdx, 1);
  }

  // shuffle array with random number
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
}

// CARD LISTENERS============================================
function cardListeners(){
  allCards.forEach(function(card, i){
    card.addEventListener("click", function(){

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
    alert("clicked");
  });
  medBtn.addEventListener("click", function(){
    alert("clicked");
  });
  hardBtn.addEventListener("click", function(){
    alert("clicked");
  });
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
  } else {
    // if no match, unflip cards
    unflipCard(card0);
    unflipCard(card1);
  }

  // reset user clicks
  userClicks = [];
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
  scoreDisplay.innerText = score++;
}
