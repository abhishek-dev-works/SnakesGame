/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import "./App.css";
import logo from "./assets/images/logo.svg";
import LoginModal from "./LoginModal";

const CELL_SIZE = 10; // Size of each grid cell
const GRID_WIDTH = 40; // Number of grid cells in the width
const GRID_HEIGHT = 40; // Number of grid cells in the height
const INITIAL_SNAKE_SIZE = [
  { x: 5, y: 5 },
  { x: 4, y: 5 },
  { x: 3, y: 5 },
  { x: 2, y: 5 },
];

const generateFoodPosition = () => {
  const x = Math.floor(Math.random() * GRID_WIDTH);
  const y = Math.floor(Math.random() * GRID_HEIGHT);
  return { x, y };
};

const GameLayout = () => {
  const [highScores, setHighScores] = React.useState<Array<any>>([]);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(true);
  const [userName, setUserName] = React.useState("");
  const [snake, setSnake] = React.useState(INITIAL_SNAKE_SIZE);
  const [food, setFood] = React.useState(generateFoodPosition());
  const [direction, setDirection] = React.useState("RIGHT");
  const [gameOver, setGameOver] = React.useState(false);
  const [currentScore, setCurrentScore] = React.useState(0);
  const [startGame, setStartGame] = React.useState(false);
  const [isChangingDirection, setIsChangingDirection] = React.useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalSubmit = (inputValue: any) => {
    setUserName(inputValue);
    console.log(inputValue);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE_SIZE);
    setFood(generateFoodPosition());
    setDirection("RIGHT");
    setGameOver(false);
    setCurrentScore(0);
  };

  React.useEffect(() => {
    if (gameOver) {
      const scores = localStorage.getItem("scores");
      const newScore = { userName, score: currentScore };
      
      if (scores) {
        const highScores = JSON.parse(scores);
        highScores.push(newScore); 
        highScores.sort((a: any, b: any) => b.score - a.score);
        const top3HighScores = highScores.slice(0, 3); 
        setHighScores(top3HighScores);
        localStorage.setItem("scores", JSON.stringify(top3HighScores));
      } else {
        const scores = [newScore];
        setHighScores(scores);
        localStorage.setItem("scores", JSON.stringify(scores));
      }
    }
  }, [gameOver]);
  

  const updateGame = React.useCallback(() => {
    if (gameOver) return;

    // Calculate the new head position
    const head = { ...snake[0] };
    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
      default:
        break;
    }
    checkCollision(head);
    if (head.x === food.x && head.y === food.y) {
      setCurrentScore(currentScore + 10);
      setFood(generateFoodPosition());
      setSnake([head, ...snake]);
    } else {
      const newSnake = [...snake];
      newSnake.pop();
      newSnake.unshift(head);
      setSnake(newSnake);
    }
  }, [direction, food, gameOver, snake, currentScore]);

  React.useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (isChangingDirection) return; // Exit if direction is already changing

      switch (event.key) {
        case "ArrowUp":
          if (direction !== "DOWN") {
            setIsChangingDirection(true); // Set the flag
            setDirection("UP");
            setTimeout(() => setIsChangingDirection(false), 50); // Clear the flag after a delay
          }
          break;
        case "ArrowDown":
          if (direction !== "UP") {
            setIsChangingDirection(true);
            setDirection("DOWN");
            setTimeout(() => setIsChangingDirection(false), 50);
          }
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") {
            setIsChangingDirection(true);
            setDirection("LEFT");
            setTimeout(() => setIsChangingDirection(false), 50);
          }
          break;
        case "ArrowRight":
          if (direction !== "LEFT") {
            setIsChangingDirection(true);
            setDirection("RIGHT");
            setTimeout(() => setIsChangingDirection(false), 50);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, isChangingDirection]);

  React.useEffect(() => {
    if (startGame) {
      const intervalDuration = 150 - Math.floor(currentScore / 50) * 50;
      const gameInterval = setInterval(updateGame, intervalDuration);
      return () => clearInterval(gameInterval);
    }
  }, [updateGame, startGame, currentScore]);

  const checkCollision = (newHead: any) => {
    if (
      newHead.x < 0 ||
      newHead.x >= GRID_WIDTH ||
      newHead.y < 0 ||
      newHead.y >= GRID_HEIGHT ||
      snake.some(
        (segment) => segment.x === newHead.x && segment.y === newHead.y
      )
    ) {
      setGameOver(true);
    }
  };
  React.useEffect(() => {
    const scores = localStorage.getItem("scores");
    if (scores) {
      setHighScores(JSON.parse(scores));
    }
  }, []);
  const Game = (props: { snake: any; gameOver: any }) => {
    const { snake, gameOver } = props;
    // Update game logic

    return (
      <div>
        {gameOver && <p>Game Over</p>}
        <div
          style={{
            width: CELL_SIZE * GRID_WIDTH,
            height: CELL_SIZE * GRID_HEIGHT,
            border: "1px solid #000",
            position: "relative",
          }}
        >
          {/* Render the grid */}
          {Array.from({ length: GRID_HEIGHT }).map((_, rowIndex) =>
            Array.from({ length: GRID_WIDTH }).map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: snake.some(
                    (segment: { x: number; y: number }) =>
                      segment.x === colIndex && segment.y === rowIndex
                  )
                    ? "black"
                    : food.x === colIndex && food.y === rowIndex
                    ? "red"
                    : "transparent",
                  position: "absolute",
                  top: rowIndex * CELL_SIZE,
                  left: colIndex * CELL_SIZE,
                }}
              ></div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="Container">
      <div>
        <div className="Currentscore">{currentScore}</div>
        <div className="GameWrapper">
          <Game snake={snake} gameOver={gameOver} />
        </div>
      </div>
      <div>
        <div className="Scoreboard">
          SCORE BOARD
          {highScores.map((item) => {
            return <p>{`-  ${item?.userName || ""}   ${item.score || ""}`}</p>;
          })}
        </div>
        <div>
          <p className="Headings">Use the arrow buttons to control</p>
          <div>
            <div className="FlexConntainer">
              <div className="Buttons">up</div>
            </div>
            <div className="FlexConntainer">
              <div className="Buttons">left</div>
              <div className="Buttons">down</div>
              <div className="Buttons">right</div>
            </div>
            <div className="Startbutton" onClick={() => setStartGame(true)}>
              Start Game ! <img src={logo} height={32} alt="logo" />
            </div>
            <div
              className="Startbutton"
              style={{ backgroundColor: "red" }}
              onClick={resetGame}
            >
              Re-start
            </div>
          </div>
        </div>
      </div>
      <LoginModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default GameLayout;
