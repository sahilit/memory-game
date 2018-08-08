
function startGame() {
	if (document.querySelector('.getName').value !== "") {
		document.querySelector('.name_box').style.display = 'none';
		newGame();
	} else {
		alert("Enter your Name");
	}
}

/*
 * Create a list that holds all of your cards
 */
let cards = ["diamond","paper-plane-o","anchor","bolt","cube","anchor","leaf","bicycle","diamond","bomb","leaf","bomb","bolt","bicycle","paper-plane-o","cube"];

const modal = document.querySelector(".modal");
const modalText = document.querySelector(".modalText");
const playAgain = document.querySelector(".playAgain");

const stars = document.querySelector(".stars");
const moves = document.querySelector(".moves");
let timer = document.querySelector(".timer");
const restart = document.querySelector(".restart");
const deck = document.querySelector(".deck");

let interval;
let second = 0;
let minute = 0;
let timeStart = false;

let cards_select = [];
let matches = 0;
let movesCount = moves.textContent;
let starsCount = 5;


function newGame() {

	resetTimer();
	deck.innerHTML = '';
	timer.style.display = "none";
	timeStart = false;
	timer.textContent = minute + ' Minutes ' + second + ' Seconds';
	shuffle(cards);
	cards_select = [];
	matches = 0;
	moves.textContent = 0;
	movesCount = moves.textContent;

	for(let i = 0; i < cards.length; i++) {
		deck.insertAdjacentHTML('afterbegin', '<li class="card"><i class="fa fa-' + cards[i] +' "></i></li>');
	}
}


function flipCard(card) {
	card.classList.add("open", "show");
}


function cardMatch() {
	cards_select[0].classList.remove("open", "show");
	cards_select[0].classList.add("match");
	cards_select[1].classList.remove("open", "show");
	cards_select[1].classList.add("match");
	cards_select = [];
	matches++;
}


function cardMisMatch() {
	setTimeout(function() {
		cards_select[0].classList.remove("open", "show");
		cards_select[1].classList.remove("open", "show");
		cards_select = [];
	}, 900);
}

 
function addMove(card) {
	if(!card.classList.contains("match")) {
		movesCount++;
		moves.innerText = movesCount;
		
	    if (movesCount > 26) {
	      	stars.innerHTML = '<li><i class="fa fa-star"></i></li>';
	      	starsCount = 1;
	    } else if (movesCount > 22) {
	      	stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
	      	starsCount = 2;
	    } else if (movesCount > 18) {
	      	stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
	      	starsCount = 3;
	    } else if (movesCount > 14) {
	      	stars.innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
	      	starsCount = 4;
	    }	
	}
}


function endGame() {
	if(movesCount <= 14) {
		starsCount = 5;
	} else if (movesCount <= 18) {
		starsCount = 4;
	} else if (movesCount <= 22) {
		starsCount = 3;
	} else if (movesCount <= 26) {
		starsCount = 2;
	} else {
		starsCount = 1;
	}

	if(matches === 8) {

		sendData();
		modal.style.display = "block";

		modalText.innerHTML = "<h2>Congratulations! You made it</h2> <br> Time taken: "  + minute + "mintes " + second + "seconds <br> Moves Taken: " + movesCount +
     	" <br> Stars: "  + starsCount + " <br> You can do better!";
	}
}


playAgain.addEventListener("click", function() {
	location.reload();
});


restart.addEventListener("click", function() {
	newGame();
});


deck.addEventListener("click", function(e) {
	let card = e.target;

	if(e.target !== e.currentTarget) {
		if(!timeStart) {
			startTimer();
			timeStart = true;
			timer.style.display = "inline-block";
		}
		if(!card.classList.contains("open")) {
			if(cards_select.length < 2) {
				flipCard(card);
				cards_select.push(card);
			}
			if(cards_select.length === 2) {
				addMove(card);
				if(cards_select[0].innerHTML === cards_select[1].innerHTML) {
					cardMatch();
				} else {
					cardMisMatch();
				}
			}
			endGame();
		}
	}
});


function resetTimer() {
	clearInterval(interval);
	second = 0;
	minute = 0;
}


function startTimer() {
	interval = setInterval(function() {
		timer.textContent = minute + " minutes " + second + " seconds ";
		second++;
		if (second === 60) {
			minute++;
			second = 0;
		}
	}, 1000)
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*--------- Firebase Database connection --------*/

var rootRef = firebase.database().ref().child("MemoryGame");
var count = 1;

rootRef.on("child_added", snap => {
	count++;
	var cname = snap.child("Name").val();
	var cmoves = snap.child("Moves").val();
	var cmin = snap.child("Minutes").val();
	var csec = snap.child("Seconds").val();

	$("#table_body").append("<tr><td>" + cname + "</td><td>" + cmoves + "</td><td>" + cmin + "</td><td>" + csec + "</td></tr>");
});

function sendData() {
	
	var tableName = "user_" + count;

	var nameText = document.querySelector(".getName").value;
	var cmoves = movesCount;
	var cmin = minute;
	var csec = second;

	var firebaseRef = firebase.database().ref().child("MemoryGame");
	firebaseRef.child(tableName).child("Name").set(nameText);
	firebaseRef.child(tableName).child("Moves").set(cmoves);
	firebaseRef.child(tableName).child("Minutes").set(cmin);
	firebaseRef.child(tableName).child("Seconds").set(csec);
}

