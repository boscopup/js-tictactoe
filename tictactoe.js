/**
 * GameBoard is a module that keeps track of the cells on the board
 * 
 * Cells are of the format:
 *      0   1   2
 *      3   4   5
 *      6   7   8
 */
GameBoard = (function() {
    gameBoard = [];

    /* Initialize the board */
    for (let i = 0; i < 9; i++) {
        gameBoard.push(Cell());
    }

    const getBoard = () => gameBoard;

    const placeToken = (location, player) => gameBoard[location].setToken(player);
 
    // This function is used for console play purposes only
    const printBoard = () => {
        let i = 0;
        let printOut = "";
        for (let j = 0; j < 3; j++) {
            printOut += `${gameBoard[i].getToken()} ${gameBoard[i+1].getToken()} ${gameBoard[i+2].getToken()}\n`;
            i += 3;
        }
        console.log(printOut);
    }

    return { getBoard, placeToken, printBoard };
})();

function Cell() {
    let token = 0;

    const getToken = () => token;

    const setToken = (value) => {
        if (token === 0) {
            token = value;
            return true;
        } else {
            return false;
        }
    };

    return { getToken, setToken };
}

/**
 * GameController is a module that handles the logic of game play
 */
GameController = (function() {
    const players = [
        { 
            name: "Player One",
            token: 1
        },
        {
            name: "Player Two",
            token: 2
        }
    ];

    // num will be 1 or 2
    const updatePlayerName = (num, name) => players[num-1].name = name;

    let activePlayer = players[0];

    const switchPlayer = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn:`);
        GameBoard.printBoard();
    };

    const printEndOfGame = (winningValue, winningLines) => {
        if (winningValue == null) {
            // Tie Game
            console.log("Game tied");
        } else {
            let winner = winningValue === players[0].token ? players[0] : players[1];
            GameBoard.printBoard();
            console.log(`${winner.name} is the winner!`);
        }
    }
    
    const playRound = (location) => {
        if (GameBoard.placeToken(location, activePlayer.token)) {
            switchPlayer();
            let gameOver, winner, winningLines;
            [gameOver, winner, winningLines] = haveWinner();
            if (gameOver) {
                printEndOfGame(winner, winningLines);
            } else {
                printNewRound();
            }
            return true;
        } else {
            // A token was already played in this location
            return false;
        }
    };

    /**
     * GameController.haveWinner()
     * @returns 
     *      bool gameOver - whether the game is completed (winning or tie)
     *      int winner - 0 for tie, 1 for player 1, 2 for player 2, null for game not over yet
     *      string[] winningLine - array of "row1", "row2", "row3", "col1", "col2", "col3", "diag1" (top left
     *          to bottom right), "diag2" (top right to bottom left), or empty if tie game or gave not
     *          over yet
     * 
     */
    const haveWinner = () => {
        // Check for a winner
        const board = GameBoard.getBoard();
        let values = []
        let gameOver = true;
        let winner = null;
        let winningLine = [];

        // Assign values and check to see if the board is filled up
        for (let i = 0; i < 9; i++) {
            values[i] = board[i].getToken();
            if (values[i] === 0) {
                gameOver = false;  // There are still empty spaces
            }
        }

        // Check for winning lines
        // Row 1
        if (values[0] != 0 && values[0] == values[1] && values[1] == values[2]) {
            gameOver = true;
            winner = values[0];
            winningLine.push("row1");
        }
        // Row 2
        if (values[3] != 0 && values[3] == values[4] && values[4] == values[5]) {
            gameOver = true;
            winner = values[3];
            winningLine.push("row2");
        }
        // Row 3
        if (values[6] != 0 && values[6] == values[7] && values[7] == values[8]) {
            gameOver = true;
            winner = values[6];
            winningLine.push("row3");
        }

        // Col 1
        if (values[0] != 0 && values[0] == values[3] && values[3] == values[6]) {
            gameOver = true;
            winner = values[0];
            winningLine.push("col1");
        }
        // Col 2
        if (values[1] != 0 && values[1] == values[4] && values[4] == values[7]) {
            gameOver = true;
            winner = values[1];
            winningLine.push("col2");
        }
        // Col 3
        if (values[2] != 0 && values[2] == values[5] && values[5] == values[8]) {
            gameOver = true;
            winner = values[2];
            winningLine.push("col3");
        }

        // Diag 1
        if (values[0] != 0 && values[0] == values[4] && values[4] == values[8]) {
            gameOver = true;
            winner = values[0];
            winningLine.push("diag1");
        }
        // Diag 2
        if (values[2] != 0 && values[2] == values[4] && values[4] == values[6]) {
            gameOver = true;
            winner = values[0];
            winningLine.push("diag1");
        }

        return [ gameOver, winner, winningLine ];
    };

    // Initial round
    printNewRound();

    return { updatePlayerName, getActivePlayer, playRound, haveWinner };
})();