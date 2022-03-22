"use strict";
const MARK = 'O';
const gameBoard = (() => {
    let boardPositions = ['', '', '', '', '', '', '', '', ''];
    const placeMark = (index, playerMark) => {
        if (isEmpty(index)) {
            boardPositions[index] = playerMark;
            return true;
        }
        else {
            return false;
        }
    };
    const isEmpty = (index) => {
        return boardPositions[index] === '';
    };
    return {
        boardPositions,
        placeMark,
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
        if (gameBoard.placeMark(index, playerMark)) {
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
                gameBoard.boardPositions[i] = '';
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
