"use strict";
const MARK = 'O';
const gameBoard = (() => {
    let tiles = ['', '', '', '', '', '', '', '', '',];
    const placeMark = (index, playerMark) => {
        if (isEmpty(index)) {
            tiles[index] = playerMark;
            return true;
        }
        else {
            return false;
        }
    };
    const isEmpty = (index) => {
        return tiles[index] === '';
    };
    return {
        tiles,
        placeMark,
        isEmpty
    };
})();
const displayController = (() => {
    let playerMark = MARK;
    const cells = document.querySelectorAll('.board-cell');
    const restartButton = document.querySelector('.restart');
    const cellFields = document.querySelectorAll('.marker');
    // Adds the players marker to the cell field
    const populateCell = (e) => {
        if (e !== null) {
            let index = Number(e.target.dataset.cell);
            console.log("clicked on index: " + index);
            const cellField = e.target.querySelector('.marker');
            if (gameBoard.placeMark(index, playerMark)) {
                cellField.innerText = playerMark;
            }
        }
        else {
            console.log("Event was null");
        }
    };
    const restart = (e) => {
        cellFields.forEach((cellField) => {
            cellField.innerText = '';
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
