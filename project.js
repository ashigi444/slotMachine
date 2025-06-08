// 1.user need to despot money 
// 2.how many lines he want to bet on
// 3.collect the bet amount 
// 4.roll the slot machine
// 5.check if the user won
// 6.give user their winnings
// 7.play again ?

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A : 2,
    B : 4,
    C : 6,
    D : 8
}

const SYMBOLS_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}





const getDeposit = () => {
    while(true) {
        const depositAmount = prompt("Tu veux mettre combien ? : ");
        const numberDepositAmount = parseFloat(depositAmount);

        if(isNaN(numberDepositAmount)) {
            console.log("Abuse pas, on a demandé une somme, pas des lettres :/ Allez sérieux ?")
        }
        else if(numberDepositAmount <= 0){
            console.log("Tu peux pas rien mettre frérot... Sois pas radin.")
        }
        else{
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
        while(true) {
        const Lines = prompt("Sur combien de lignes tu veux miser ? (1-3) : ");
        const numberOfLines = parseFloat(Lines);

        if(isNaN(numberOfLines)) {
            console.log("Tu fais exprès de mettre des lettres partout ?")
        }
        else if(numberOfLines < 1 || numberOfLines > 3){
            console.log("On a dit entre 1 et 3...")
        }
        else{
            return numberOfLines;
        }
    }
}

const getBet = (balance, lines) => {
    while(true) {
        const bet = prompt("Tu veux miser combien par lignes ? : ");
        const numberBet = parseFloat(bet);

        if(isNaN(numberBet)) {
            console.log("Tu forces avec ton alphabet sérieux...")
        }
        else if(numberBet <= 0){
            console.log("A quoi ça sert de rien miser ??? T'es pas joueur ?")
        }
        else if(numberBet > (balance/lines)){
            console.log("T'as pas assez malheureusement, ton solde est seulement de "+balance+"€...")
        }
        else{
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])
        }
    }

    return rows;
}

const printRows = (rows) => {
    for (const row of rows){
        let rowString = "";
        for(const[i, symbol] of row.entries()) {
            rowString += symbol
            if(i != row.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for(let row = 0;row< lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]]
        }
    }

    return winnings;
}

const game = () =>{
    let balance = getDeposit();

    while(true){
        console.log("T'as "+balance+"€ "+ "sur ton solde !");
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;
        console.log("T'as gagné "+winnings.toString()+"€.");

        if (balance <= 0) {
            console.log("T'as tout perdu mon salaud...");
            break
        }

        const playAgain = prompt("Tu veux encore jouer ? (y/n)? : ");
        if (playAgain != "y") break;
    }
}

game();