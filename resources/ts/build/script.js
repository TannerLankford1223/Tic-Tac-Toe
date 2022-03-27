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
    let _aiPrecision = 0;
    const getSign = () => _sign;
    // Changes player to a computer player
    const toggleAI = () => _isBot = !_isBot;
    const botStatus = () => _isBot;
    const setAIPrecision = (level) => {
        console.log("setting precision to : " + level);
        _aiPrecision = (_isBot) ? level : 0;
    };
    const getAIPrecision = () => {
        return _aiPrecision;
    };
    return {
        getSign,
        toggleAI,
        setAIPrecision,
        getAIPrecision,
        botStatus
    };
};
const gameBoard = (() => {
    let _board = new Array(9).fill(null);
    const setCell = (index, player) => {
        if (!isNaN(index)) {
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
    const clearCell = (index) => {
        _board[index] = null;
    };
    const getBoard = () => {
        return _board;
    };
    const clearBoard = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = null;
        }
    };
    return {
        setCell,
        getCell,
        getBoard,
        clearCell,
        clearBoard
    };
})();
const displayController = (() => {
    const cells = document.querySelectorAll('.board-cell');
    const cellFields = document.querySelectorAll('.marker');
    const restartButton = document.querySelector('#restart');
    const overlay = document.querySelector('#overlay');
    const overlayText = document.querySelector('.overlay-text');
    const winnerText = document.querySelector('#winner');
    const player1Button = document.querySelector('#player-1');
    const player2Button = document.querySelector('#player-2');
    const playerDifficultyBtn = document.getElementsByName('player-difficulty');
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
            document.getElementById('player1-diff').removeAttribute('disabled');
        }
        else if (button.innerText == 'player O') {
            document.getElementById('player2-diff').removeAttribute('disabled');
            button.innerText = 'computer O';
        }
        else if (button.innerText === 'computer X') {
            button.innerText = 'player X';
            document.getElementById('player1-diff').setAttribute('disabled', 'true');
        }
        else {
            button.innerText = 'player O';
            document.getElementById('player2-diff').setAttribute('disabled', 'true');
        }
        restart();
        gameplayController.setPlayers();
    };
    const _makeMove = (e) => {
        let cell = e.target;
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
    const updateDisplay = () => {
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) !== null) {
                const cell = document.querySelector(`[data-index="${i}"] span`);
                cell.textContent = gameBoard.getCell(i);
            }
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
        // player1DifficultyBtn!.addEventListener('change', () => {
        //     const difficulty: string =
        //         (<HTMLInputElement>document.getElementById('player1-diff'))!.value;
        //     gameplayController.setAIPrecision(difficulty, 'X');
        // });
        // player2DifficultyBtn!.addEventListener('change', () => {
        //     const difficulty: string =
        //         (<HTMLInputElement>document.getElementById('player2-diff'))!.value;
        //     gameplayController.setAIPrecision(difficulty, 'O');
        // });
        playerDifficultyBtn.forEach(btn => btn.addEventListener('change', (e) => {
            const diffButton = btn;
            const difficulty = diffButton.value;
            const playerMark = diffButton.dataset.player;
            gameplayController.setAIPrecision(difficulty, playerMark);
        }));
    })();
    return {
        endScreen,
        activate,
        updateDisplay,
        deactivate
    };
})();
const gameplayController = (() => {
    let player1 = Player('X');
    let player2 = Player('O');
    let turns = 0;
    let currPlayer = player1;
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
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
    const setAIPrecision = (level, playerMark) => {
        const player = (playerMark === 'X') ? player1 : player2;
        let aiPrecision;
        if (level === 'medium') {
            aiPrecision = 50;
        }
        else if (level === 'hard') {
            aiPrecision = 75;
        }
        else if (level === 'unbeatable') {
            aiPrecision = 100;
        }
        else {
            aiPrecision = 25;
        }
        player.setAIPrecision(aiPrecision);
    };
    const playerMove = (index) => {
        gameBoard.setCell(index, currPlayer);
        displayController.updateDisplay();
        if (checkForWin()) {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield _sleep(500 + (Math.random() * 500));
                endGame(currPlayer.getSign());
            }))();
        }
        else if (checkForTie()) {
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield _sleep(500 + (Math.random() * 500));
                endGame("Draw");
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
            console.log("precision: " + currPlayer.getAIPrecision());
            displayController.deactivate();
            let index = _aiChosenMove(currPlayer.getAIPrecision());
            (() => __awaiter(void 0, void 0, void 0, function* () {
                yield _sleep(1000);
                playerMove(index);
            }))();
        }
        else {
            displayController.activate();
        }
    };
    const endGame = (sign) => {
        displayController.endScreen(sign);
        resetTurns();
    };
    // Finds the best move using the minimax algorithm
    const _aiChosenMove = (aiPrecision) => {
        const randomNum = Math.floor(Math.random() * 101);
        let choice = null;
        if (randomNum <= aiPrecision) {
            let { moves } = _minimax(true);
            choice = moves[Math.floor(Math.random() * moves.length)];
        }
        else {
            let moves = _possibleMoves();
            choice = moves[Math.floor(Math.random() * moves.length)];
        }
        return choice;
    };
    // Use a minimax algorithm to consider all possible moves on the board
    // and return the value of the board
    const _minimax = (isMax) => {
        let player;
        if (isMax) {
            player = (currPlayer === player1) ? player1 : player2;
        }
        else {
            player = (currPlayer === player1) ? player2 : player1;
        }
        if (checkForWin()) {
            return { value: -10 };
        }
        if (checkForTie()) {
            return { value: 0 };
        }
        let validMoves = _possibleMoves();
        let best = {
            value: -Infinity
        };
        for (let move of validMoves) {
            gameBoard.setCell(move, player);
            let { value } = _minimax(!isMax);
            gameBoard.clearCell(move);
            // Reduce the magnitude of the value to prioritize shorter routes
            // to winning
            value = value ? (Math.abs(value) - 1) * Math.sign(-value) : 0;
            if (value >= best.value) {
                if (value > best.value) {
                    best = { value, moves: [] };
                }
                best.moves.push(move);
            }
        }
        return best;
    };
    // Minimax Algorithm helper function that returns any possible moves left
    // on the board
    const _possibleMoves = () => {
        let moves = [];
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) === null) {
                moves.push(i);
            }
        }
        return moves;
    };
    const resetTurns = () => {
        turns = 0;
        changeCurrPlayer();
    };
    const checkForWin = () => {
        for (let winCondition of winConditions) {
            if (winCondition.every(i => gameBoard.getCell(i) === player1.getSign())) {
                return true;
            }
            else if (winCondition.every(i => gameBoard.getCell(i) === player2.getSign())) {
                return true;
            }
        }
        return false;
    };
    const checkForTie = () => {
        if (checkForWin()) {
            return false;
        }
        for (let i = 0; i < 9; i++) {
            if (gameBoard.getCell(i) == null) {
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
        setAIPrecision,
        changeCurrPlayer,
        incrementTurns,
        endGame
    };
})();
