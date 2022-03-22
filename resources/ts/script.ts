const Player = (sign: string) => {
    let _sign = sign;

    const getSign = () => _sign;

    return {
        getSign
    }
};

const gameBoard = (() => {
    let _board: (string | undefined)[] = new Array(9);

    const setCell = (index: number, player: any) => {
        if (_isEmpty(index)) {
            const cell = document.querySelector(`.gameboard div:nth-child(${index + 1}) span`);
            cell!.textContent = player.getSign();
            _board[index] = player.getSign();
            return true;
        } else {
            return false;
        }
    }

    const getCell = (index: number) => {
        return _board[index];
    }

    const getBoard = () => {
        return _board;
    }


    const _isEmpty = (index: number) => {
        return _board[index] === undefined;
    };

    const clearBoard = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    }

    return {
        setCell,
        getCell,
        getBoard,
        clearBoard
    }
})();

const gameplayController = (() => {
    let player1 = Player('X');
    let player2 = Player('O');
    let gameOver = false;
    let _currPlayer = player1;

    const _sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const playRound = (index: number) => {
        gameBoard.setCell(index, _currPlayer);
        if (checkForWin()) {
            (async() => {
                await _sleep(500 + (Math.random() * 500));
                endGame(_currPlayer.getSign());
            })();
        } else if (checkForTie()) {
            (async () => {
                await _sleep(500 + (Math.random() * 500));
                endGame("Draw");
            })
        } else {
            changeCurrPlayer;
        }
    }

    const endGame = (sign: string) => {

    }

    const getCurrPlayer = () => {
        return _currPlayer;
    }

    const changeCurrPlayer = () => {
        _currPlayer = (_currPlayer === player1) ? player2 : player1;
    }

    // Checks if a player has filled a diagonal and returns a boolean.
    const _checkDiagonals = () => {
        const diagonal1: (string | undefined)[] = [gameBoard.getCell(0),
        gameBoard.getCell(4),
        gameBoard.getCell(8)];

        const diagonal2: (string | undefined)[] = [gameBoard.getCell(2),
        gameBoard.getCell(4),
        gameBoard.getCell(6)];

        if (diagonal1.every(cell => cell === 'X') ||
            diagonal1.every(cell => cell === 'O')) {
            console.log("Diagonal filled");
            return true;
        } else if (diagonal2.every(cell => cell === 'X') ||
            diagonal2.every(cell => cell === 'O')) {
            console.log('Diagonal filled');
            return true;
        } else {
            return false;
        }
    }

    // Checks if player has filled a column and returns a boolean
    const _checkColumns = () => {
        for (let i = 0; i < 3; i++) {
            let column: (string | undefined)[] = [];
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
    }

    // Checks if player has filled a row and returns a boolean
    const _checkRows = () => {
        for (let i = 0; i < 3; i++) {
            let row: (string | undefined)[] = [];
            for (let j = i * 3; j < i * 3 + 3; j++) {
                row.push(gameBoard.getCell(j));
            }

            if (row.every(cell => cell === 'X') ||
                row.every(cell => cell === 'O')) {
                console.log("Row filled");
                return true;
            } else {
                return false;
            }
        }
    }

    const checkForWin = () => {
        if (_checkRows() || _checkColumns() || _checkDiagonals()) {
            return true;
        } else {
            return false;
        }
    }

    const checkForTie = () => {
        return false;
    }

    // const _init = (() => {
    //     playGame();
    // })();

    return {
        getCurrPlayer,
        changeCurrPlayer,
        checkForWin,
        checkForTie,
        // playGame,
        playRound
    }
})();


const displayController = (() => {

    const cells: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>('.board-cell');
    const restartButton: HTMLElement | null = document.querySelector<HTMLElement>('#restart');
    const cellFields: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>('.marker');

    // Adds the players marker to the cell field
    const populateCell = (e: Event) => {
        const board: HTMLAnchorElement[] = Array.from(document.querySelectorAll<HTMLAnchorElement>('.board-cell'));
        let player = gameplayController.getCurrPlayer();
        let cell: HTMLElement = e.target as HTMLElement;
        let index: number = Number(cell.dataset.index);
        console.log("clicked on index: " + index);

        // Gets the text field of the board-cell
        const cellField: HTMLElement | null = cell.querySelector('.marker');

        if (gameBoard.setCell(index, player)) {
            if (cellField !== null) {
                cellField.innerText = player.getSign();

            } else {
                console.log("Could not retrieve cellField");
            }
        }
    }

    const _activate = () => {

    }

    const restart = () => {
        let i = 0;

        cellFields.forEach((cellField: HTMLElement) => {
            if (cellField !== null) {
                cellField.innerText = '';
                gameBoard.clearBoard();

                i++;
            } else {
                console.log("Could not retrieve cellField");
            }

        });
    }

    // Adds event listeners before parent module is initialized
    const _init = (() => {
        for (let i = 0; i < cells.length; i++) {
           let cell: HTMLElement = cells[i];
            cell.addEventListener('click', gameplayController.playRound.bind(cell, i));
        }

        restartButton!.addEventListener('click', restart);
    })();

})();
