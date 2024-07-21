const { GameBoard, GameController, Cell } = require("./tictactoe");

// Test function to create an array of tokens
// from the game board for easy comparisons
const convertToTokens = (board) => {
    let tokens = [];
    for (let i = 0; i < 9; i++) {
        tokens.push(board[i].getToken());
    }
    return tokens;
};

describe('Test Cell', () => {
    beforeEach(() => { GameController.resetGame(); });
    test('getToken', () => {
        let cell = new Cell();
        expect(cell.getToken()).toEqual(0);
        cell.setToken(1);
        expect(cell.getToken()).toEqual(1);
    });

    test('getToken on a GameBoard cell', () => {
        let cell = new Cell();
        expect(cell.getToken()).toEqual(0);
        let board = GameBoard.getBoard();
        cell = board[0];
        cell.setToken(2);
        expect(cell.getToken()).toEqual(2);
    });

    test('getToken on a GameBoard cell that has been updated', () => {
        let cell = new Cell();
        expect(cell.getToken()).toEqual(0);
        GameController.playRound(0);
        let board = GameBoard.getBoard();
        cell = board[0];
        expect(cell.getToken()).toEqual(1);
    });

    test('getToken on the GameBoard array cells', () => {
        GameController.playRound(0);
        GameController.playRound(5);

        const testTokens = [ 1, 0, 0, 0, 0, 2, 0, 0, 0 ];
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens);
    });
});

describe('GameController Basics', () => {
    beforeEach(() => { GameController.resetGame(); });


    test('Updates players names', () => {
        GameController.updatePlayerName(1, "Bob");
        GameController.updatePlayerName(2, "Fred");
        const testPlayers = [ 
            { 
                name: "Bob", 
                token: 1 
            }, 
            { 
                name: "Fred", 
                token: 2 
            }];
        expect(GameController.getPlayerInfo()).toEqual(testPlayers);
    });

    test('Resets game', () => {
        GameController.updatePlayerName(1, "Bob");
        GameController.updatePlayerName(2, "Fred");
        GameController.playRound(3);
        GameController.playRound(8);
        GameController.playRound(0);
        GameController.resetGame();    


        const testPlayers = [ 
            { 
                name: "Player One", 
                token: 1 
            }, 
            { 
                name: "Player Two", 
                token: 2 
            }];
        const testBoard = GameBoard.getBoard();
        const testTokens = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        const testPlayer1 = {
            name: "Player One",
            token: 1
        };
        expect(GameController.getPlayerInfo()).toEqual(testPlayers);
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens);
        expect(GameController.getActivePlayer()).toEqual(testPlayer1)
    });

    test('Changes active player each round', () => {
        const player1 = GameController.getActivePlayer();
        GameController.playRound(0);
        const player2 = GameController.getActivePlayer();
        GameController.playRound(1);
        const player3 = GameController.getActivePlayer();
        testPlayer1 = {
            name: "Player One",
            token: 1
        };
        testPlayer2 = {
            name: "Player Two",
            token: 2
        };


        expect(player1).toEqual(testPlayer1);
        expect(player2).toEqual(testPlayer2);
        expect(player3).toEqual(testPlayer1);
    });
});

describe('GameBoard Basics', () => {
    beforeEach(() => { GameController.resetGame(); });

    test('Place token', () => {
        // Should place the token in the appropriate square
        const tokens1 = convertToTokens(GameBoard.getBoard());
        const testTokens1 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens1);
        const testPlayer1 = GameController.getPlayerInfo()[0].token;
        const testPlayer2 = GameController.getPlayerInfo()[1].token;
        GameBoard.placeToken(4, testPlayer1);
        GameBoard.placeToken(0, testPlayer2);
        GameBoard.placeToken(2, testPlayer1);
        GameBoard.placeToken(8, testPlayer2);
        const testTokens2 = [ 2, 0, 1, 0, 1, 0, 0, 0, 2 ];
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens2);
    });

    test('Place token in a spot that is already occupied', () => {
        // Should not place a token or change the active player
        const testPlayer1 = GameController.getPlayerInfo()[0].token;
        const testPlayer2 = GameController.getPlayerInfo()[1].token;
        expect(GameBoard.placeToken(4, testPlayer1)).toEqual(true);
        expect(GameBoard.placeToken(0, testPlayer2)).toEqual(true);
        expect(GameBoard.placeToken(2, testPlayer1)).toEqual(true);
        expect(GameBoard.placeToken(4, testPlayer2)).toEqual(false);
        const testTokens2 = [ 2, 0, 1, 0, 1, 0, 0, 0, 0 ];
        console.log(testTokens2.length);
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens2);
    });

    test('Reset game board', () => {
        // After playing multiple rounds, game board should be cleared
        const testPlayer1 = GameController.getPlayerInfo()[0].token;
        const testPlayer2 = GameController.getPlayerInfo()[1].token;
        GameBoard.placeToken(0, testPlayer1);
        GameBoard.placeToken(1, testPlayer2);
        GameBoard.placeToken(2, testPlayer1);
        GameBoard.placeToken(3, testPlayer2);
        GameBoard.placeToken(4, testPlayer1);
        GameBoard.placeToken(5, testPlayer2);
        GameBoard.placeToken(6, testPlayer1);
        GameBoard.placeToken(7, testPlayer2);
        GameBoard.placeToken(8, testPlayer1);
        const testTokens1 = [ 1, 2, 1, 2, 1, 2, 1, 2, 1 ];
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens1);
        const testTokens2 = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
        GameBoard.resetGameBoard();
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens2);

    });
});

describe('Game play results', () => {
    beforeEach(() => { GameController.resetGame(); });
    // Play full games to get various winning and tying combinations

    test('Active player changes each round', () => {
        const testPlayer1 = GameController.getPlayerInfo()[0];
        const testPlayer2 = GameController.getPlayerInfo()[1];
        expect(GameController.getActivePlayer()).toEqual(testPlayer1);
        GameController.playRound(2);
        expect(GameController.getActivePlayer()).toEqual(testPlayer2);
        GameController.playRound(7);
        expect(GameController.getActivePlayer()).toEqual(testPlayer1);
    });

    test('Active player does not change when placing token on occupied space', () => {
        const testPlayer1 = GameController.getPlayerInfo()[0];
        const testPlayer2 = GameController.getPlayerInfo()[1];
        expect(GameController.getActivePlayer()).toEqual(testPlayer1);
        GameController.playRound(2);
        expect(GameController.getActivePlayer()).toEqual(testPlayer2);
        GameController.playRound(7);
        expect(GameController.getActivePlayer()).toEqual(testPlayer1);
        GameController.playRound(3);
        expect(GameController.getActivePlayer()).toEqual(testPlayer2);
        GameController.playRound(2); // Already occupied, player 2 goes again
        expect(GameController.getActivePlayer()).toEqual(testPlayer2);
        GameController.playRound(0);
        expect(GameController.getActivePlayer()).toEqual(testPlayer1);
        GameController.playRound(3); // Already played that spot, go again
        expect(GameController.getActivePlayer()).toEqual(testPlayer1);
        GameController.playRound(1);
        expect(GameController.getActivePlayer()).toEqual(testPlayer2);
        const testTokens = [ 2, 1, 1, 1, 0, 0, 0, 2, 0 ];
        expect(convertToTokens(GameBoard.getBoard())).toEqual(testTokens);
    });

    test('Row 1 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(4);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(0);
        GameController.playRound(6);
        GameController.playRound(2);
        GameController.playRound(8);
        GameController.playRound(1);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(2);
        expect(winningLines).toEqual(["row1"]);
    });

    test('Row 2 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(4);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(1);
        GameController.playRound(3);
        GameController.playRound(6);
        GameController.playRound(5);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(1);
        expect(winningLines).toEqual(["row2"]);
    });

    test('Row 3 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(2);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(7);
        GameController.playRound(1);
        GameController.playRound(6);
        GameController.playRound(5);
        GameController.playRound(8);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(2);
        expect(winningLines).toEqual(["row3"]);
    });

    test('Col 1 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(0);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(4);
        GameController.playRound(6);
        GameController.playRound(2);
        GameController.playRound(3);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(1);
        expect(winningLines).toEqual(["col1"]);
    });

    test('Col 2 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(2);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(4);
        GameController.playRound(0);
        GameController.playRound(1);
        GameController.playRound(6);
        GameController.playRound(7);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(2);
        expect(winningLines).toEqual(["col2"]);
    });

    test('Col 3 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(2);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(4);
        GameController.playRound(5);
        GameController.playRound(0);
        GameController.playRound(8);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(1);
        expect(winningLines).toEqual(["col3"]);
    });

    test('Diag 1 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(1);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(4);
        GameController.playRound(2);
        GameController.playRound(0);
        GameController.playRound(5);
        GameController.playRound(8);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(2);
        expect(winningLines).toEqual(["diag1"]);
    });

    test('Diag 2 wins', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(2);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(1);
        GameController.playRound(4);
        GameController.playRound(0);
        GameController.playRound(6);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(1);
        expect(winningLines).toEqual(["diag2"]);
    });

    test('Tie game', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(4);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(0);
        GameController.playRound(1);
        GameController.playRound(7);
        GameController.playRound(2);
        GameController.playRound(6);
        GameController.playRound(8);
        GameController.playRound(5);
        GameController.playRound(3);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
    });

    test('Row 1 and Diag 1 win', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(1);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(3);
        GameController.playRound(8);
        GameController.playRound(5);
        GameController.playRound(4);
        GameController.playRound(7);
        GameController.playRound(2);
        GameController.playRound(6);
        GameController.playRound(0);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(1);
        expect(winningLines).toEqual([ "row1", "diag1" ]);
    });

    test('Col 3 and Diag 2 win', () => {
        let gameOver, winner, winningLines;
        GameController.playRound(4);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(false);
        expect(winner).toEqual(null);
        expect(winningLines).toEqual([]);
        GameController.playRound(1);
        GameController.playRound(5);
        GameController.playRound(3);
        GameController.playRound(8);
        GameController.playRound(7);
        GameController.playRound(6);
        GameController.playRound(0);
        GameController.playRound(2);
        [gameOver, winner, winningLines] = GameController.haveWinner();
        expect(gameOver).toEqual(true);
        expect(winner).toEqual(1);
        expect(winningLines).toEqual([ "col3", "diag2" ]);
    });
});
