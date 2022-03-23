"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Player = (sign) => {
    let _sign = sign;
    const getSign = () => _sign;
    return {
        getSign
    };
};
const aiPlayer = (sign) => {
    const prototype = Player(sign);
};
const gameBoard = (() => {
    let _board = new Array(9);
    const setCell = (index, player) => {
        if (_isEmpty(index)) {
            const cell = document.querySelector(`.gameboard div:nth-child(${index + 1}) span`);
            cell.textContent = player.getSign();
            _board[index] = player.getSign();
            return true;
        }
        else {
            return false;
        }
    };
    const getCell = (index) => {
        return _board[index];
    };
    const getBoard = () => {
        return _board;
    };
    const _isEmpty = (index) => {
        return _board[index] === undefined;
    };
    const clearBoard = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    };
    return {
        setCell,
        getCell,
        getBoard,
        clearBoard
    };
})();
const gameplayController = (() => {
    let player1;
    let player2;
    let turns = 0;
    const _sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    const setPlayers = () => {
        if (document.getElementById('player-1').innerText === 'player X') {
            player1 = Player('X');
        }
        if (document.getElementById('player-2').innerText === 'player O') {
            player2 = Player('O');
        }
    };
    const playRound = (index) => {
        let currPlayer;
        if (turns % 2 == 0) {
            currPlayer = player1;
        }
        else {
            currPlayer = player2;
        }
        gameBoard.setCell(index, currPlayer);
        console.log("_currPlayer: " + currPlayer.getSign());
        if (checkForWin()) {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield _sleep(500 + (Math.random() * 500));
                _endGame(currPlayer.getSign());
            }))();
        }
        else if (checkForTie()) {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield _sleep(500 + (Math.random() * 500));
                _endGame("Draw");
            }))();
        }
        turns++;
    };
    const _endGame = (sign) => {
        displayController.endScreen(sign);
        turns = 0;
    };
    // Checks if a player has filled a diagonal and returns a boolean.
    const _checkDiagonals = () => {
        const diagonal1 = [gameBoard.getCell(0),
            gameBoard.getCell(4),
            gameBoard.getCell(8)];
        const diagonal2 = [gameBoard.getCell(2),
            gameBoard.getCell(4),
            gameBoard.getCell(6)];
        if (diagonal1.every(cell => cell === 'X') ||
            diagonal1.every(cell => cell === 'O')) {
            console.log("Diagonal filled");
            return true;
        }
        else if (diagonal2.every(cell => cell === 'X') ||
            diagonal2.every(cell => cell === 'O')) {
            console.log('Diagonal filled');
            return true;
        }
        else {
            return false;
        }
    };
    // Checks if player has filled a column and returns a boolean
    const _checkColumns = () => {
        for (let i = 0; i < 3; i++) {
            let column = [];
            for (let j = 0; j < 3; j++) {
                column.push(gameBoard.getCell(i + 3 * j));
            }
            if (column.every(cell => cell === 'X') ||
                column.every(cell => cell === 'O')) {
                console.log('Column Filled');
                return true;
            }
        }
        return false;
    };
    // Checks if player has filled a row and returns a boolean
    const _checkRows = () => {
        for (let i = 0; i < 3; i++) {
            let row = [];
            for (let j = i * 3; j < i * 3 + 3; j++) {
                row.push(gameBoard.getCell(j));
            }
            if (row.every(cell => cell === 'X') ||
                row.every(cell => cell === 'O')) {
                console.log("Row filled");
                return true;
            }
        }
        return false;
    };
    const checkForWin = () => {
        if (_checkRows() || _checkColumns() || _checkDiagonals()) {
            return true;
        }
        else {
            return false;
        }
    };
    const checkForTie = () => {
        if (checkForWin()) {
            return false;
        }
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) == undefined) {
                return false;
            }
        }
        return true;
    };
    const _init = (() => {
        setPlayers();
    })();
    return {
        checkForWin,
        checkForTie,
        playRound,
        _endGame
    };
})();
const displayController = (() => {
    const cells = document.querySelectorAll('.board-cell');
    const restartButton = document.querySelector('#restart');
    const cellFields = document.querySelectorAll('.marker');
    const overlay = document.querySelector('#overlay');
    const overlayText = document.querySelector('.overlay-text');
    const winnerText = document.querySelector('#winner');
    const player1Button = document.querySelector('#player-1');
    const player2Button = document.querySelector('#player-2');
    // End screen is displayed once the game is won or there is a tie
    const endScreen = (sign) => {
        let text;
        if (sign === 'Draw') {
            text = "It's a draw!";
        }
        else {
            text = `The winner is`;
            winnerText.innerText = sign;
        }
        overlayText.innerText = text;
        overlay.style.display = 'block';
    };
    const restart = () => {
        let i = 0;
        cellFields.forEach((cellField) => {
            if (cellField !== null) {
                cellField.innerText = '';
                gameBoard.clearBoard();
                i++;
            }
            else {
                console.log("Could not retrieve cellField");
            }
        });
    };
    const togglePlayer = (e) => {
        let button = e.target;
        if (button.innerText == 'player X') {
            button.innerText = 'computer X';
        }
        else if (button.innerText == 'player O') {
            button.innerText = 'computer O';
        }
        else if (button.innerText === 'computer X') {
            button.innerText = 'player X';
        }
        else {
            button.innerText = 'player O';
        }
        restart();
    };
    // Adds event listeners before parent module is initialized
    const _init = (() => {
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            cell.addEventListener('click', gameplayController.playRound.bind(cell, i));
        }
        restartButton.addEventListener('click', restart);
        // When the winning page is clicked restart the game
        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            overlayText.innerText = '';
            winnerText.innerText = '';
            restart();
        });
        player1Button.addEventListener('click', togglePlayer);
        player2Button.addEventListener('click', togglePlayer);
    })();
    return {
        endScreen
    };
})();
