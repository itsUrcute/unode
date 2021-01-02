const cards = require("./cards.json");//json full of card objects for every unique card
const rl = require("readline-sync");//readline used for reading console input

let fulldeck = [];
let reverse = false;
let drawn = false;
for(let x in cards){
    for(let i=0;i<cards[x].count;i++){
        fulldeck.push(x);//full deck of cards(shows repeating cards seperately)
    }
}

start()

function start(){
    global.totalPlayers = rl.question("UNO!!!\n\nEnter the number of players ")
    global.players = {};
    for(let i=1;i<=totalPlayers;i++){
        let tempdeck = [];
        for(let i=0;i<7;i++){
            rannum = Math.floor(Math.random()*fulldeck.length);
            tempdeck.push(fulldeck[rannum]);
            fulldeck.splice(rannum,1);
        }
        players[`deck${i}`] = tempdeck;
    }
    global.topCard = ["r","g","b","y"][Math.floor(Math.random()*4)] + Math.floor(Math.random()*10);
    global.currentPlayer = 1;
    global.nextPlayer = 2;
    placePrompt(topCard,currentPlayer,players,totalPlayers);

}

function placePrompt(){
    console.log(`Player ${currentPlayer}`)
    console.log(`Current Card is ${topCard}\nYour deck is ${players[`deck${currentPlayer}`]}\n`);
    let cardName = rl.question("Which card do you wanna place? ")
        if(cardName.toLowerCase() == "draw" && !drawn){
            draw();
        }
        else if(cardName.toLowerCase() == "draw" && drawn){
            console.log("Can only draw 1 time")
            unoskip()
        }
        else if(cardName.toLowerCase() == "skip" && drawn){
            drawskip()
        }
        else if(!(players[`deck${currentPlayer}`].includes(cardName))){
            console.log("Invalid card\n");
            placePrompt();
        }
        else if(!(cards[cardName].wild) && ((cards[topCard].color != cards[cardName].color) && (cards[topCard].number != cards[cardName].number) && !(cards[topCard].reverse == true && cards[cardName].reverse == true) && !(cards[topCard].pull == 2 && cards[cardName].pull == 2) && !(cards[topCard].skip == true && cards[cardName].skip == true))){
            console.log(`This card can\'t be placed on ${topCard}\n`);
            placePrompt();
        }
        else{
            placed(cardName);
        }
    }

async function placed(cardName){
    console.log(`${cardName} has been placed\n`);
    players[`deck${currentPlayer}`].splice(players[`deck${currentPlayer}`].indexOf(cardName),1)
    drawn = false;
    if(players[`deck${currentPlayer}`].length == 1){
        console.log("UNO!")
    }
    else if(players[`deck${currentPlayer}`].length == 0){
        console.log(`Victory!!!\nPlayer${currentPlayer} has won the game!`)
        process.exit(0)
    }
    if(!['wc','wd'].includes(topCard) || !['red','green','yellow','blue'].includes(topCard) ){
        topCard = cardName;
    }
    else{
        topCard = tempcol;
    }
    if(cards[cardName].wild){
        unowild()
    }
    if(cards[cardName].reverse){
        unoreverse()
    }
    if(cards[cardName].pull){
        unopull(cardName)
    }

    if(cards[cardName].skip){
        unoskip()
    }

    else{  
        currentPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
        nextPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
        placePrompt(topCard,currentPlayer,players,totalPlayers);
}
}

function unoreverse(){
    reverse = !reverse;
    console.log(`Uno Reverse!`)
    currentPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    nextPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    placePrompt(topCard,currentPlayer,players,totalPlayers);
}

function unoskip(){
    console.log(`Skipped Player${nextPlayer}`)
    currentPlayer = !reverse && currentPlayer+2<=totalPlayers?currentPlayer+2:!reverse && currentPlayer+2>=totalPlayers?currentPlayer+2-totalPlayers:reverse && currentPlayer-2<1?totalPlayers-(currentPlayer-2):reverse && currentPlayer-2>0?currentPlayer-2:null;
    nextPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    placePrompt(topCard,currentPlayer,players,totalPlayers);
}

function unopull(cardName){
    console.log(`Player${nextPlayer} had to draw ${cards[cardName].pull} cards`)
    for(let i=0;i<cards[cardName].pull;i++){
        rannum = Math.floor(Math.random()*fulldeck.length);
        players[`deck${nextPlayer}`].push(fulldeck[rannum]);
        fulldeck.splice(rannum,1);
    }
}

function unowild(){
    let nextcolor = rl.question("What color should the next card be? ")
        if(['red','green','yellow','blue'].includes(nextcolor.toLowerCase())){
            global.tempcol = nextcolor.toLowerCase()
            topCard = tempcol;
            placePrompt();
        }
        else{
            unowild();
        }
}

function draw(){
    rannum = Math.floor(Math.random()*fulldeck.length);
    players[`deck${currentPlayer}`].push(fulldeck[rannum]);
    fulldeck.splice(rannum,1);
    drawn = true;
    placePrompt();

}

function drawskip(){
    console.log(`Skipped Player${currentPlayer}\n`);
    currentPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    nextPlayer = !reverse && currentPlayer+1<=totalPlayers?currentPlayer+1:!reverse && currentPlayer+1>=totalPlayers?1:reverse && currentPlayer-1<1?totalPlayers:reverse && currentPlayer-1>0?currentPlayer-1:null;
    drawn = false;
    placePrompt(topCard,currentPlayer,players,totalPlayers);
}