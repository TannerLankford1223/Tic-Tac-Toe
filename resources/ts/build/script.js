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
    const _sign = sign;
    let _isBot = false;
    const getSign = () => _sign;
    // Changes player to a computer player
    const toggleAI = () => _isBot = !_isBot;
    const botStatus = () => _isBot;
    return {
        getSign,
        toggleAI,
        botStatus
    };
};
const gameBoard = (() => {
    let _board = new Array(9);
    const setCell = (index, player) => {
        if (!isNaN(index)) {
            const cell = document.querySelector(`[data-index="${index}"]`);
            const cellField = cell.querySelector('.marker');
            cellField.textContent = player.getSign();
            _board[index] = player.getSign();
            return true;
        }
        else {
            console.log("Cell was not empty");
            gameplayController.incrementTurns();
            gameplayController.changeCurrPlayer();
            gameplayController.playGame();
            return false;
        }
    };
    const getCell = (index) => {
        return _board[index];
    };
    const getBoard = () => {
        return _board;
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
            gameplayController.resetTurns();
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
        gameplayController.setPlayers();
    };
    const _makeMove = (e) => {
        let cell = e.target;
        console.log("cell index: " + cell.dataset.index);
        let cellIndex = Number(cell.dataset.index);
        gameplayController.playerMove(cellIndex);
    };
    const activate = () => {
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            cell.addEventListener('click', _makeMove);
        }
    };
    const deactivate = () => {
        for (let i = 0; i < cells.length; i++) {
            let cell = cells[i];
            cell.removeEventListener('click', _makeMove);
        }
    };
    // Adds event listeners before parent module is initialized
    const _init = (() => {
        activate();
        restartButton.addEventListener('click', restart);
        // When the winning page is clicked restart the game
        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            overlayText.innerText = '';
            winnerText.innerText = '';
            restart();
            gameplayController.playGame();
        });
        player1Button.addEventListener('click', togglePlayer);
        player2Button.addEventListener('click', togglePlayer);
    })();
    return {
        endScreen,
        activate,
        deactivate
    };
})();
const aiLogic = () => {
};
const gameplayController = (() => {
    let player1 = Player('X');
    let player2 = Player('O');
    let turns = 0;
    let currPlayer = player1;
    const _sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    const setPlayers = () => {
        let player1ButtonText = document.getElementById('player-1');
        let player2ButtonText = document.getElementById('player-2');
        if (player1ButtonText.innerText === 'computer X' && !player1.botStatus()) {
            console.log("Turning on player1 bot status");
            player1.toggleAI();
        }
        else if (player1ButtonText.innerText === 'player X' && player1.botStatus()) {
            console.log("Turning off player1 bot status");
            player1.toggleAI();
        }
        if (player2ButtonText.innerText === 'computer O' && !player2.botStatus()) {
            console.log("Turning on player2 bot status");
            player2.toggleAI();
        }
        else if (player2ButtonText.innerText === 'player O' && player2.botStatus()) {
            console.log("Turning off player2 bot status");
            player2.toggleAI();
        }
        playGame();
    };
    const playerMove = (index) => {
        gameBoard.setCell(index, currPlayer);
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
        else {
            incrementTurns();
            changeCurrPlayer();
            playGame();
        }
    };
    const playGame = () => {
        if (currPlayer.botStatus()) {
            displayController.deactivate();
            let index = _aiChosenMove();
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield _sleep(1000);
                playerMove(index);
            }))();
        }
        else {
            displayController.activate();
        }
    };
    const _endGame = (sign) => {
        displayController.endScreen(sign);
        resetTurns();
    };
    // Finds the best move using the minimax algorithm
    const _aiChosenMove = () => {
        // const moves: number[] = _getAIMoves();
        // let bestMoveIndex = moves[Math.floor(Math.random() * moves.length)];
        // return bestMoveIndex;
        let bestScore = -10000;
        let bestMove = -1;
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getBoard()[i] === undefined) {
                gameBoard.getBoard()[i] = currPlayer.getSign();
                const moveVal = _minimax(0, false);
                gameBoard.getBoard()[i] = undefined;
                if (moveVal > bestScore) {
                    bestScore = moveVal;
                    bestMove = i;
                }
            }
        }
        console.log("The value of the best move is: " + bestScore);
        return bestMove;
    };
    // Evaluates positions on the board and returns true if the current player
    // is the winner
    const _evaluate = () => {
        let board = gameBoard;
        let otherPlayer = (currPlayer === player1) ? player2 : player1;
        // check rows for X or O victory
        for (let row = 0; row < 3; row++) {
            if (board.getCell(0 + (3 * row)) === board.getCell(1 + (3 * row)) &&
                board.getCell(1 + (3 * row)) === board.getCell(3 + (3 * row))) {
                if (board.getCell(0 + (3 * row)) === currPlayer.getSign()) {
                    return 10;
                }
                else if (board.getCell(0 + (3 * row)) === otherPlayer.getSign()) {
                    return -10;
                }
            }
        }
        // Check columns for X or O victory
        for (let col = 0; col < 3; col++) {
            if (board.getCell(col) === board.getCell(col + 3) &&
                board.getCell(col + 3) === board.getCell(col + 6)) {
                if (board.getCell(col) === currPlayer.getSign()) {
                    return 10;
                }
                else if (board.getCell(col) === otherPlayer.getSign()) {
                    return -10;
                }
            }
        }
        // Check diagonals for X or O victory
        if (board.getCell(0) === board.getCell(4) === board.getCell(8)) {
            if (board.getCell(0) === currPlayer.getSign()) {
                return 10;
            }
            else if (board.getCell(0) === otherPlayer.getSign()) {
                return -10;
            }
        }
        if (board.getCell(2) === board.getCell(4) === board.getCell(6)) {
            if (board.getCell(2) === currPlayer.getSign()) {
                return 10;
            }
            else if (board.getCell(2) === otherPlayer.getSign()) {
                return -10;
            }
        }
        // If none of the above are winning conditions, then return 0
        return 0;
    };
    // Use a minimax algorithm to consider all possible moves on the board
    // and return the value of the board
    const _minimax = (depth, isMax) => {
        let score = _evaluate();
        if (score == 10 || score == -10) {
            return score;
        }
        if (!_anyMovesLeft()) {
            return 0;
        }
        if (isMax) {
            return _maximize(depth);
        }
        else {
            return _minimize(depth);
        }
    };
    const _maximize = (depth) => {
        let bestScore = -10000;
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) === undefined) {
                gameBoard.getBoard()[i] = currPlayer;
                bestScore = Math.max(bestScore, _minimax(depth + 1, false));
                gameBoard.getBoard()[i] = undefined;
            }
        }
        return bestScore;
    };
    const _minimize = (depth) => {
        const otherPlayer = (currPlayer === player1) ? player2 : player1;
        let bestScore = 10000;
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) === undefined) {
                gameBoard.getBoard()[i] = otherPlayer.getSign();
                bestScore = Math.min(bestScore, _minimax(depth + 1, true));
                gameBoard.getBoard()[i] = undefined;
            }
        }
        return bestScore;
    };
    // Minimax Algorithm helper function that returns if any moves are left
    // on the board
    const _anyMovesLeft = () => {
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) === undefined) {
                return true;
            }
        }
        return false;
    };
    const resetTurns = () => {
        turns = 0;
        changeCurrPlayer();
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
    const changeCurrPlayer = () => {
        currPlayer = (turns % 2 == 0) ? player1 : player2;
    };
    const incrementTurns = () => {
        turns += 1;
    };
    const _init = (() => {
        setPlayers();
        playGame();
    })();
    return {
        checkForWin,
        checkForTie,
        playerMove,
        playGame,
        resetTurns,
        setPlayers,
        changeCurrPlayer,
        incrementTurns,
        _endGame
    };
})();
