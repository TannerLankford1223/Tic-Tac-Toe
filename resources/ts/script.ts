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
        isEmpty
    }
})();

const displayController = (() => {
    let playerMark: string = MARK;
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

        if (gameBoard.setCell(index, playerMark)) {
            if (cellField !== null) {
                cellField.innerText = playerMark;

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
        playerMark,
        cells,
        populateCell,
        restart
    }
})();


