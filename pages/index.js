import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  // 游戏状态
  const [gameSize, setGameSize] = useState(15); // 默认15x15格子
  const [speed, setSpeed] = useState(150); // 默认速度，值越小越快
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]); // 蛇的初始位置
  const [food, setFood] = useState({ x: 3, y: 3 }); // 食物的初始位置
  const [direction, setDirection] = useState('RIGHT'); // 初始方向
  const [gameOver, setGameOver] = useState(false); // 游戏结束状态
  const [score, setScore] = useState(0); // 分数
  const [isPaused, setIsPaused] = useState(false); // 暂停状态
  const [showSettings, setShowSettings] = useState(false); // 设置面板显示状态
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 }); // 触摸开始位置
  
  const gameAreaRef = useRef(null);
  const gameLoopRef = useRef(null);

  // 响应式调整游戏区域大小
  useEffect(() => {
    const handleResize = () => {
      if (gameAreaRef.current) {
        const isMobile = window.innerWidth <= 768;
        const size = isMobile 
          ? Math.min(window.innerWidth - 40, window.innerHeight - 200) 
          : Math.min(window.innerWidth * 0.6, window.innerHeight - 150);
        
        gameAreaRef.current.style.width = `${size}px`;
        gameAreaRef.current.style.height = `${size}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 生成随机食物位置
  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * gameSize),
      y: Math.floor(Math.random() * gameSize)
    };

    // 确保食物不会出现在蛇身上
    if (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
      return generateFood();
    }

    return newFood;
  };

  // 游戏初始化
  useEffect(() => {
    resetGame();
  }, [gameSize]);

  // 重置游戏
  const resetGame = () => {
    setSnake([{ x: Math.floor(gameSize / 2), y: Math.floor(gameSize / 2) }]);
    setFood(generateFood());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    gameLoopRef.current = setInterval(moveSnake, speed);
  };

  // 游戏主循环
  const moveSnake = () => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      // 获取蛇头位置
      const head = { ...prevSnake[0] };
      
      // 根据方向移动蛇头
      switch (direction) {
        case 'UP':
          head.y -= 1;
          break;
        case 'DOWN':
          head.y += 1;
          break;
        case 'LEFT':
          head.x -= 1;
          break;
        case 'RIGHT':
          head.x += 1;
          break;
        default:
          break;
      }

      // 检查是否撞墙
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= gameSize ||
        head.y >= gameSize
      ) {
        setGameOver(true);
        clearInterval(gameLoopRef.current);
        return prevSnake;
      }

      // 检查是否撞到自己
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        clearInterval(gameLoopRef.current);
        return prevSnake;
      }

      // 创建新的蛇身
      const newSnake = [head, ...prevSnake];
      
      // 检查是否吃到食物
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        setFood(generateFood());
      } else {
        // 如果没吃到食物，移除尾部
        newSnake.pop();
      }

      return newSnake;
    });
  };

  // 更新游戏速度
  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    
    if (!gameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [speed, gameOver]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault();
      
      if (gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // 触摸控制（移动设备）
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY
    });
    e.preventDefault(); // 防止页面滚动
  };

  const handleTouchMove = (e) => {
    e.preventDefault(); // 防止页面滚动
  };

  const handleTouchEnd = (e) => {
    if (gameOver) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // 确定主要的移动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平移动
      if (deltaX > 30) {
        if (direction !== 'LEFT') setDirection('RIGHT');
      } else if (deltaX < -30) {
        if (direction !== 'RIGHT') setDirection('LEFT');
      }
    } else {
      // 垂直移动
      if (deltaY > 30) {
        if (direction !== 'UP') setDirection('DOWN');
      } else if (deltaY < -30) {
        if (direction !== 'DOWN') setDirection('UP');
      }
    }
    
    e.preventDefault(); // 防止页面滚动
  };

  // 方向按钮控制
  const handleDirectionClick = (newDirection) => {
    if (gameOver) return;
    
    switch (newDirection) {
      case 'UP':
        if (direction !== 'DOWN') setDirection('UP');
        break;
      case 'DOWN':
        if (direction !== 'UP') setDirection('DOWN');
        break;
      case 'LEFT':
        if (direction !== 'RIGHT') setDirection('LEFT');
        break;
      case 'RIGHT':
        if (direction !== 'LEFT') setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  // 更改游戏设置
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    setGameSize(newSize);
  };

  const handleSpeedChange = (e) => {
    const newSpeed = parseInt(e.target.value, 10);
    setSpeed(newSpeed);
  };

  // 渲染游戏网格
  const renderGrid = () => {
    const grid = [];
    const cellSize = `calc(100% / ${gameSize})`;

    for (let y = 0; y < gameSize; y++) {
      for (let x = 0; x < gameSize; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isHead = snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;
        
        let cellClass = styles.cell;
        if (isHead) {
          cellClass = `${styles.cell} ${styles.snakeHead}`;
        } else if (isSnake) {
          cellClass = `${styles.cell} ${styles.snake}`;
        } else if (isFood) {
          cellClass = `${styles.cell} ${styles.food}`;
        }

        grid.push(
          <div
            key={`${x}-${y}`}
            className={cellClass}
            style={{
              width: cellSize,
              height: cellSize,
              left: `calc(${x} * ${cellSize})`,
              top: `calc(${y} * ${cellSize})`,
            }}
          />
        );
      }
    }

    return grid;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>贪吃蛇游戏</title>
        <meta name="description" content="响应式贪吃蛇游戏" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>贪吃蛇游戏</h1>
        
        <div className={styles.gameInfo}>
          <div className={styles.score}>分数: {score}</div>
          <button 
            className={styles.settingsButton} 
            onClick={() => setShowSettings(!showSettings)}
            aria-label="设置"
          >
            ⚙️
          </button>
        </div>

        {showSettings && (
          <div className={styles.settingsPanel}>
            <div className={styles.settingItem}>
              <label htmlFor="gameSize">游戏大小: {gameSize}x{gameSize}</label>
              <input
                id="gameSize"
                type="range"
                min="10"
                max="25"
                value={gameSize}
                onChange={handleSizeChange}
              />
            </div>
            <div className={styles.settingItem}>
              <label htmlFor="gameSpeed">游戏速度: {Math.round(1000 / speed)}级</label>
              <input
                id="gameSpeed"
                type="range"
                min="50"
                max="300"
                step="10"
                value={speed}
                onChange={handleSpeedChange}
                // 速度反向，值越小越快
                style={{ direction: 'rtl' }}
              />
            </div>
          </div>
        )}

        <div 
          className={styles.gameArea} 
          ref={gameAreaRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {renderGrid()}
          
          {gameOver && (
            <div className={styles.gameOverlay}>
              <div className={styles.gameOverMessage}>
                游戏结束!
                <div>最终分数: {score}</div>
                <button onClick={resetGame}>重新开始</button>
              </div>
            </div>
          )}
          
          {isPaused && !gameOver && (
            <div className={styles.gameOverlay}>
              <div className={styles.pauseMessage}>
                游戏暂停
                <button onClick={() => setIsPaused(false)}>继续</button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <div className={styles.controlRow}>
            <button 
              className={styles.controlButton} 
              onClick={() => handleDirectionClick('UP')}
              aria-label="向上"
            >
              ↑
            </button>
          </div>
          <div className={styles.controlRow}>
            <button 
              className={styles.controlButton} 
              onClick={() => handleDirectionClick('LEFT')}
              aria-label="向左"
            >
              ←
            </button>
            <button 
              className={styles.controlButton} 
              onClick={() => handleDirectionClick('DOWN')}
              aria-label="向下"
            >
              ↓
            </button>
            <button 
              className={styles.controlButton} 
              onClick={() => handleDirectionClick('RIGHT')}
              aria-label="向右"
            >
              →
            </button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <p>贪吃蛇游戏 - 响应式设计</p>
      </footer>
    </div>
  );
}