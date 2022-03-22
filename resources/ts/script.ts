const MARK = 'O';

const Player = (sign: string) => {
    let _sign = sign;

    const getSign = () => _sign;

    return {
        getSign
    }
};

const gameBoard = (() => {
    let _board: string[] = ['', '', '', '', '', '', '', '', ''];

    const setCell = (index: number, player: any) => {
        if (isEmpty(index)) {
            _board[index] = player.getSign();
            return true;
        } else {
            return false;
        }
    }

    const getCell = (index: number) => {
        return _board[index];
    }


    const isEmpty = (index: number) => {
        return _board[index] === '';
    };

    return {
        _board,
        setCell,
        getCell,
        isEmpty
    }
})();

const displayController = (() => {
    // Demo value for testing
    let player = Player('X');

    const cells: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>('.board-cell');
    const restartButton: HTMLElement | null = document.querySelector<HTMLElement>('#restart');
    const cellFields: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>('.marker');

    // Adds the players marker to the cell field
    const populateCell = (e: Event) => {
        let cell: HTMLElement = e.target as HTMLElement;
        let index: number = Number(cell.dataset.index);
        console.log("clicked on index: " + index);

        // Gets the text field of the board-cell
        const cellField: HTMLElement | null = cell.querySelector('.marker');

        if (gameBoard.setCell(index, player)) {
            if (cellField !== null) {
                cellField.innerText = player.getSign();

                return true;
            } else {
                console.log("Could not retrieve cellField");
            }
        }

        return false;
    }

    const restart = () => {
        let i = 0;

        cellFields.forEach((cellField: HTMLElement) => {
            if (cellField !== null) {
                cellField.innerText = '';
                gameBoard._board[i] = '';

                i++;
            } else {
                console.log("Could not retrieve cellField");
            }

        });
    }

    // Adds event listeners before parent module is initialized
    const _init = (() => {
        cells.forEach((cell: HTMLElement) => {
            cell.addEventListener('click', populateCell);
        });

        restartButton!.addEventListener('click', restart);
    })();

    return {
        player,
        cells,
        populateCell,
        restart
    }
})();

const gameplayController = (() => {
    let player1 = Player('X');
    let player2 = Player('O');

    // Checks if a player has filled a diagonal and returns a boolean.
    const _checkDiagonals = () => {
        const diagonal1: string[] = [gameBoard.getCell(0),
        gameBoard.getCell(4),
        gameBoard.getCell(8)];

        const diagonal2: string[] = [gameBoard.getCell(2),
        gameBoard.getCell(4),
        gameBoard.getCell(6)];

        if (diagonal1.every(cell => cell === 'X') ||
            diagonal1.every(cell => cell === 'O')) {
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
            let column: string[] = [];
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
            let row: string[] = [];
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

    return {
        player1,
        player2,
        checkForWin
    }
})();
