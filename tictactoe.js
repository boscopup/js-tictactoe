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

    const playRound = (location) => {
        if (GameBoard.placeToken(location, activePlayer.token)) {
            switchPlayer();
            printNewRound();
            return true;
        } else {
            // A token was already played in this location
            return false;
        }
    };

    const haveWinner = () => {
        // Check for a winner
        return;  // { winner, winningLine };
    };

    // Initial round
    printNewRound();

    return { updatePlayerName, getActivePlayer, playRound, haveWinner };
})();