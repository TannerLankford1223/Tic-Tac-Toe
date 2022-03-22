const MARK = 'O';

const gameBoard = (() => {
    let boardPositions: string[] = ['', '', '', '', '', '', '', '', ''];

    const placeMark = (index: number, playerMark: string) => {
        if (isEmpty(index)) {
            boardPositions[index] = playerMark;
            return true;
        } else {
            return false;
        }
    }

    const isEmpty = (index: number) => {
        return boardPositions[index] === '';
    };

    return {
        boardPositions,
        placeMark,
        isEmpty
    }
})();

const displayController = (() => {
    let playerMark: string = MARK;
    const cells: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>('.board-cell');
    const restartButton: HTMLElement | null = document.querySelector<HTMLElement>('#restart');
    const cellFields: NodeListOf<HTMLAnchorElement> = document.querySelectorAll<HTMLAnchorElement>('.marker');

    // Adds the players marker to the cell field
    const populateCell = (e : Event) => {
        let cell: HTMLElement = e.target as HTMLElement;
        let index: number = Number(cell.dataset.index);
        console.log("clicked on index: " + index);

        // Gets the text field of the board-cell
        const cellField : HTMLElement | null = cell.querySelector('.marker');

        if (gameBoard.placeMark(index, playerMark)) {
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
                gameBoard.boardPositions[i] = '';

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


