"use strict";
const MARK = 'O';
const Player = (sign) => {
    let _sign = sign;
    const getSign = () => _sign;
    return {
        getSign
    };
};
const gameBoard = (() => {
    let _board = ['', '', '', '', '', '', '', '', ''];
    const setCell = (index, player) => {
        if (isEmpty(index)) {
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
    const isEmpty = (index) => {
        return _board[index] === '';
    };
    return {
        _board,
        setCell,
        isEmpty
    };
})();
const displayController = (() => {
    let playerMark = MARK;
    const cells = document.querySelectorAll('.board-cell');
    const restartButton = document.querySelector('#restart');
    const cellFields = document.querySelectorAll('.marker');
    // Adds the players marker to the cell field
    const populateCell = (e) => {
        let cell = e.target;
        let index = Number(cell.dataset.index);
        console.log("clicked on index: " + index);
        // Gets the text field of the board-cell
        const cellField = cell.querySelector('.marker');
        if (gameBoard.setCell(index, playerMark)) {
            if (cellField !== null) {
                cellField.innerText = playerMark;
                return true;
            }
            else {
                console.log("Could not retrieve cellField");
            }
        }
        return false;
    };
    const restart = () => {
        let i = 0;
        cellFields.forEach((cellField) => {
            if (cellField !== null) {
                cellField.innerText = '';
                gameBoard._board[i] = '';
                i++;
            }
            else {
                console.log("Could not retrieve cellField");
            }
        });
    };
    // Adds event listeners before parent module is initialized
    const _init = (() => {
        cells.forEach((cell) => {
            cell.addEventListener('click', populateCell);
        });
        restartButton.addEventListener('click', restart);
    })();
    return {
        playerMark,
        cells,
        populateCell,
        restart
    };
})();
const gameplayController = (() => {
    let player1 = Player('X');
    let player2 = Player('O');
})();
