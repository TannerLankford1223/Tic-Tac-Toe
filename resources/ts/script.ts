const MARK = 'O';

const gameBoard = (() => {
    let tiles: string[] = ['', '', '', '', '', '', '', '', '',];

    const placeMark = (index: number, playerMark: string) => {
        if (isEmpty(index)) {
            tiles[index] = playerMark;
            return true;
        } else {
            return false;
        }
    }

    const isEmpty = (index: number) => {
        return tiles[index] === '';
    };

    return {
        tiles,
        placeMark,
        isEmpty
    }
})();

const displayController = (() => {
    let playerMark: string = MARK;
    const cells: NodeListOf<Element> = document.querySelectorAll('.board-cell');
    const restartButton : Element | null = document.querySelector('#restart');
    const cellFields: NodeListOf<Element> = document.querySelectorAll('.marker');

    // Adds the players marker to the cell field
    const populateCell = (e: Event) => {
        if (e !== null) {
            let index: number = Number((e.target as HTMLElement).dataset.cell);
            console.log("clicked on index: " + index);

            const cellField = (e.target as HTMLElement).querySelector('.marker');

            if (gameBoard.placeMark(index, playerMark)) {
                (cellField as HTMLElement).innerText = playerMark;
            }
        } else {
            console.log("Event was null");
        }
    }

    const restart = () => {
        let i = 0;

        cellFields.forEach((cellField : Element) => {
            (cellField as HTMLElement).innerText = '';
            gameBoard.tiles[i] = '';

            i++;
        });
    }

    // Adds event listeners before parent module is initialized
    const _init = (() => {
        cells.forEach((cell: Element) => {
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


