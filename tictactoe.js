/**
 * GameBoard is a module that keeps track of the cells on the board
 * 
 * Cells are of the format:
 *      0   1   2
 *      3   4   5
 *      6   7   8
 */
GameBoard = (function() {
    let gameBoard = [];

    const resetGameBoard = () => {
        gameBoard = [];
        for (let i = 0; i < 9; i++) {
            gameBoard.push(Cell());
        }
    };

    /* Initialize the board */
    resetGameBoard();

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

    return { getBoard, placeToken, printBoard, resetGameBoard };
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

    const getPlayerInfo = () => players;

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
            winner = values[2];
            winningLine.push("diag2");
        }

        return [ gameOver, winner, winningLine ];
    };

    const resetGame = () => {
        updatePlayerName(1, "Player One");
        updatePlayerName(2, "Player Two");
        activePlayer = players[0];
        GameBoard.resetGameBoard();
    };

    // Initial round
    printNewRound();

    return { updatePlayerName, getPlayerInfo, getActivePlayer, switchPlayer, playRound, haveWinner, resetGame };
})();

const UIController = (function() {
    const xImageSrc = "images/X.png";
    const oImageSrc = "images/O.png";
    const blankImageSrc = "images/blank.png";
    const player1DisplayName = document.getElementById("score-player1-name")
    const player2DisplayName = document.getElementById("score-player2-name")
    const activePlayerName = document.querySelector("#active-player>span");
    const activePlayerImage = document.querySelector("#active-player>img");
    const newGameDialog = document.getElementById("new-game-dialog");
    const inputPlayer1Name = document.getElementById("input-player1-name");
    const inputPlayer2Name = document.getElementById("input-player2-name");
    const playGameButton = document.getElementById("play-game-button");
    const player1Score = document.getElementById("score-player1-score");
    const player2Score = document.getElementById("score-player2-score");
    const gameSpaces = []
    const endOfGameDialog = document.getElementById("end-of-game-dialog");
    const endOfGameMessage = document.getElementById("end-of-game-message");
    const endOfGameImage = document.getElementById("end-of-game-image");
    const newGameButton = document.getElementById("new-game-button");
    const dialogNewGameButton = document.getElementById("dialog-new-game-button");
    const dialogNewRoundButton = document.getElementById("dialog-new-round-button");
    let beginningPlayer = player1DisplayName.textContent;  // Player 1 (X) at beginning of game

    // New Game Dialog handling
    playGameButton.addEventListener("click", () => {
        GameController.updatePlayerName(1, inputPlayer1Name.value);
        player1DisplayName.textContent = inputPlayer1Name.value;
        GameController.updatePlayerName(2, inputPlayer2Name.value);
        player2DisplayName.textContent = inputPlayer2Name.value;
        setActivePlayerDisplay();
        console.log("Play Game Button clicked"); 
        newGameDialog.close();
    });

    newGameDialog.showModal();

    // This is the button on the main page
    newGameButton.addEventListener("click", () => {
        newGame();
    });

    // End of Game Dialog handling
    dialogNewGameButton.addEventListener("click", () => {
        newGame();

        // Open New Game dialog with existing player names
        endOfGameDialog.close();
    });

    dialogNewRoundButton.addEventListener("click", () => {
        // Reset UI board and internal board
        resetBoard();
        GameBoard.resetGameBoard();

        // Set active player, alternating who gets to go first each round
        if (GameController.getActivePlayer.name === beginningPlayer) {
            GameController.switchPlayer();
            beginningPlayer = GameController.getActivePlayer.name;
        }
        endOfGameDialog.close();
    });

    // Initialize spaces and run the game
    let gameOver, winner, winningLines;

    for (let i = 0; i < 9; i++) {
        gameSpaces.push(document.querySelector(`[data-board-square="${i}"]>img`));
        gameSpaces[i].addEventListener("click", () => {
            console.log(`Space ${i} clicked`);

            // When playing a round, the active player gets switched, so store
            // the value of the active player before calling playRound, BUT
            // don't change it until it is verified that the token was placed
            // successfully
            const tempImageSrc = activePlayerImage.src;
            if (GameController.playRound(i)) {
                setActivePlayerDisplay();
                gameSpaces[i].src = tempImageSrc;
            }
            [ gameOver, winner, winningLines ] = GameController.haveWinner();
            if (gameOver) {
                // Open dialog
                updateScore(winner);
                showWinningLines(winningLines);
                switch (winner) {
                    case 1:
                        endOfGameMessage.textContent = `${player1DisplayName.textContent} wins!!!`;
                        endOfGameImage.src = xImageSrc;
                        break;
                    case 2:
                        endOfGameMessage.textContent = `${player2DisplayName.textContent} wins!!!`;
                        endOfGameImage.src = oImageSrc;
                        break;
                    case null:
                        endOfGameMessage.textContent = "Tie game!";
                        endOfGameImage.src = blankImageSrc;
                        break;
                }
                endOfGameDialog.showModal();
            }
        });
    }

    function setActivePlayerDisplay() {
        const player = GameController.getActivePlayer();
        const name = player.name;
        const imageSrc = player.token == 1 ? xImageSrc : oImageSrc;
        activePlayerName.textContent = `${name}'s Turn: `;
        activePlayerImage.src = imageSrc;
    }

    function showWinningLines(lines) {
        console.log(lines);
    }

    function updateScore(winner) {
        const score = winner == 1 ? player1Score : player2Score;
        numScore = Number(score.textContent);
        numScore++;
        score.textContent = `${numScore}`;
    }

    function resetBoard() {
        for (let i = 0; i < 9; i++) {
            gameSpaces[i].src = blankImageSrc;
        }
    }

    function newGame() {
        // Reset UI board and internal game
        resetBoard();
        GameController.resetGame();

        // Reset scores and active player
        player1Score.textContent = "0";
        player2Score.textContent = "0";
        beginningPlayer = player1DisplayName.textContent;
        newGameDialog.showModal();
    }
})();

// For Jest testing
if (typeof module === 'object') {
    module.exports = { GameBoard, GameController, Cell };
}