import {cards} from "./cards.js";
let mainDeck,holder,board,totalPlayers,currentPlayer,nextPlayer,players,topCard,cardName,tempcol;
let fulldeck = [];
let reverse = false;
let drawn = false;
for(let x in cards){
    for(let i=0;i<cards[x].count;i++){
        fulldeck.push(x);//full deck of cards(shows repeating cards seperately)
    }
}
shuffle(fulldeck);

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

//Initial calculation. can be done before html is ready//
    totalPlayers = 3;
    if(isNaN(parseInt(totalPlayers))){
        console.log("\ninvalid number");
        start();
    }
    let check = totalPlayers>1?totalPlayers<16?true:false:false;
    if(!check){
        console.log("\nenter a number between 1 and 16");6
        start()
    }
    players = {};
    for(let i=1;i<=totalPlayers;i++){
        let tempdeck = [];
        for(let i=0;i<7;i++){
            tempdeck.push(fulldeck.pop());
        }
        players[`deck${i}`] = tempdeck;
    }
    topCard = ["r","g","b","y"][Math.floor(Math.random()*4)] + Math.floor(Math.random()*10);
    currentPlayer = 1;
    nextPlayer = 2;
    //placePrompt(topCard,currentPlayer,players,totalPlayers);

//end of initital calculation//

if(document.readyState == "loading"){
    document.addEventListener('DOMContentLoaded',ready);
}
else{
    ready();
}

function ready(){
    document.getElementsByClassName('pull-card')[0].addEventListener('click',draw)
    document.getElementsByClassName('skip-button')[0].addEventListener('click',drawskip)
    let initBoard = document.getElementsByClassName("board")[0];
    initBoard.innerHTML = `<img class = "top-card card" src = "card_images/${topCard}.png">`
    mainDeck = document.getElementsByClassName("main-deck-card");
    holder = document.getElementsByClassName("deckholder")[0];
    deckCreate()
}

function deckCreate(){
    holder.innerHTML = ""
    players[`deck${currentPlayer}`].forEach(element => {
        holder.innerHTML += `<img class = "main-deck-card card" src = "card_images/${element}.png">`
    });
    deckListeners()
}

function deckListeners(){
    for(let i=0;i<mainDeck.length;i++){
        mainDeck[i].addEventListener('click',place);
    }
}

function place(e){
    cardName = e.currentTarget.src.replace(/.+\/(..).+/g,"$1");
    if(!(cards[cardName].wild) && ((cards[topCard].color != cards[cardName].color) && (cards[topCard].number != cards[cardName].number) && !(cards[topCard].reverse == true && cards[cardName].reverse == true) && !(cards[topCard].pull == 2 && cards[cardName].pull == 2) && !(cards[topCard].skip == true && cards[cardName].skip == true))){
        alert("This card cannot be placed")
    }
    else{
        updateTop(cardName,e)
    }
   
}

function updateTop(card,e){
    if(!['red','green','yellow','blue'].includes(card)){
    fulldeck.push(card);
    players[`deck${currentPlayer}`].splice(players[`deck${currentPlayer}`].indexOf(card),1);
}
    drawn = false;
    topCard = card;
    board = document.getElementsByClassName("board")[0];
    e.currentTarget.remove();
    board.innerHTML = `<img class = "top-card card" src = "card_images/${card}.png">`

    if(players[`deck${currentPlayer}`].length == 1){
        console.log("UNO!");
    }
    else if(players[`deck${currentPlayer}`].length == 0){
        console.log(`Victory!!!\nPlayer${currentPlayer} has won the game!`);
    }
    if(!(!['wc','wd'].includes(topCard) || !['red','green','yellow','blue'].includes(topCard))){
        card = tempcol;
    }
    if(cards[card].wild){
        unowild();
    }
    if(cards[card].pull){
        unopull(card);
    }
    else if(cards[card].reverse){
        unoreverse();
    }

    else if(cards[card].skip){
        unoskip();
    }

    else{  
        afterplace();
    }

}

async function afterplace(){
    await changePlayer();
    deckCreate();
}

function changePlayer(){
    currentPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    nextPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;

}

function unoreverse(){
    reverse = !reverse;
    afterplace();
}

function unopull(cardName){
    if(fulldeck.length<cards[cardName].pull){
        unoskip();
    }
    console.log(`Player${nextPlayer} had to draw ${cards[cardName].pull} cards`);
    for(let i=0;i<cards[cardName].pull;i++){
        players[`deck${nextPlayer}`].push(fulldeck.pop());
    }
    unoskip();
}

function unoskip(){
    currentPlayer = !reverse && currentPlayer+2<=totalPlayers?currentPlayer+2:!reverse && currentPlayer+2>=totalPlayers?currentPlayer+2-totalPlayers:reverse && currentPlayer-2<1?totalPlayers-(currentPlayer-2):reverse && currentPlayer-2>0?currentPlayer-2:null;
    nextPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    deckCreate()
}

async function unowild(){
        let nextcolor = await window.prompt("what color?","_");
        if(['red','green','yellow','blue'].includes(nextcolor.toLowerCase())){
            tempcol = nextcolor.toLowerCase();
            topCard = tempcol;
            board.innerHTML = `<img class = "top-card card" src = "card_images/${topCard}.png">`
        }
        else{
            unowild();
        }
}

function draw(){
    if(drawn){
    drawskip()
    }
    else if(fulldeck.length==0){
        console.log("the deck doesn\'t have enough cards left");
        afterplace();
    }
    else{
        shuffle(fulldeck);
        players[`deck${currentPlayer}`].push(fulldeck.pop());
        drawn = true;
        deckCreate();
    }

}

function drawskip(){
    if(drawn){
    console.log(`Skipped Player${currentPlayer}\n`);
    currentPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    nextPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    drawn = false;
    deckCreate();
}
}