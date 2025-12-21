// 游戏配置
const GRID_SIZE = 20;
const CANVAS_SIZE = 600;
const GRID_COUNT = CANVAS_SIZE / GRID_SIZE;

// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏状态 - 两条蛇
let snakes = [
    [{ x: 10, y: 10 }],  // 蛇1
    [{ x: 20, y: 20 }]   // 蛇2
];
let directions = [
    { x: 1, y: 0 },  // 蛇1方向
    { x: -1, y: 0 }  // 蛇2方向
];
let food = { x: 15, y: 15 };
let scores = [0, 0];  // 两条蛇的分数
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gameLoop = null;

// DOM 元素
const scoreElement1 = document.getElementById('score1');
const scoreElement2 = document.getElementById('score2');
const highScoreElement = document.getElementById('highScore');
const gameOverScreen = document.getElementById('gameOver');
const startScreen = document.getElementById('startScreen');
const finalScoreElement = document.getElementById('finalScore');
const winnerElement = document.getElementById('winner');
const restartBtn = document.getElementById('restartBtn');
const startBtn = document.getElementById('startBtn');

// 方向按钮（控制蛇1）
let upBtn, downBtn, leftBtn, rightBtn;

// 初始化
if (highScoreElement) highScoreElement.textContent = highScore;

// 生成随机食物位置
function generateFood() {
    food = {
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT)
    };
    
    // 确保食物不在任何蛇身上
    for (let snake of snakes) {
        for (let segment of snake) {
            if (segment.x === food.x && segment.y === food.y) {
                generateFood();
                return;
            }
        }
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 绘制网格线
    ctx.strokeStyle = '#16213e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
        ctx.stroke();
    }
    
    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // 绘制两条蛇
    snakes.forEach((snake, snakeIndex) => {
        const direction = directions[snakeIndex];
        const colors = [
            { head: '#2ecc71', body: '#27ae60' },  // 蛇1：绿色
            { head: '#3498db', body: '#2980b9' }   // 蛇2：蓝色
        ];
        const color = colors[snakeIndex];
        
        snake.forEach((segment, index) => {
            if (index === 0) {
                // 蛇头
                ctx.fillStyle = color.head;
            } else {
                // 蛇身
                ctx.fillStyle = color.body;
            }
            
            ctx.fillRect(
                segment.x * GRID_SIZE + 2,
                segment.y * GRID_SIZE + 2,
                GRID_SIZE - 4,
                GRID_SIZE - 4
            );
            
            // 蛇头眼睛
            if (index === 0) {
                ctx.fillStyle = '#fff';
                const eyeSize = 3;
                const eyeOffset = 5;
                
                if (direction.x === 1) { // 向右
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset + 8, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset + 8, segment.y * GRID_SIZE + eyeOffset + 8, eyeSize, eyeSize);
                } else if (direction.x === -1) { // 向左
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + eyeOffset + 8, eyeSize, eyeSize);
                } else if (direction.y === -1) { // 向上
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset + 8, segment.y * GRID_SIZE + eyeOffset, eyeSize, eyeSize);
                } else if (direction.y === 1) { // 向下
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset, segment.y * GRID_SIZE + eyeOffset + 8, eyeSize, eyeSize);
                    ctx.fillRect(segment.x * GRID_SIZE + eyeOffset + 8, segment.y * GRID_SIZE + eyeOffset + 8, eyeSize, eyeSize);
                }
            }
        });
    });
}

// 更新游戏状态
function update() {
    if (!gameRunning) return;
    
    // 更新两条蛇
    for (let snakeIndex = 0; snakeIndex < snakes.length; snakeIndex++) {
        const snake = snakes[snakeIndex];
        const direction = directions[snakeIndex];
        
        // 移动蛇头
        const head = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y
        };
        
        // 检查碰撞
        // 墙壁碰撞
        if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT) {
            gameOver(snakeIndex === 0 ? 1 : 0);  // 另一条蛇获胜
            return;
        }
        
        // 自身碰撞
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver(snakeIndex === 0 ? 1 : 0);  // 另一条蛇获胜
                return;
            }
        }
        
        // 检查与另一条蛇的碰撞
        const otherSnake = snakes[1 - snakeIndex];
        for (let segment of otherSnake) {
            if (head.x === segment.x && head.y === segment.y) {
                gameOver(snakeIndex === 0 ? 1 : 0);  // 另一条蛇获胜
                return;
            }
        }
        
        snake.unshift(head);
        
        // 检查是否吃到食物
        if (head.x === food.x && head.y === food.y) {
            scores[snakeIndex] += 10;
            if (scoreElement1) scoreElement1.textContent = scores[0];
            if (scoreElement2) scoreElement2.textContent = scores[1];
            generateFood();
            
            // 更新最高分（取两条蛇中的最高分）
            const maxScore = Math.max(scores[0], scores[1]);
            if (maxScore > highScore) {
                highScore = maxScore;
                if (highScoreElement) {
                    highScoreElement.textContent = highScore;
                    localStorage.setItem('snakeHighScore', highScore);
                }
            }
        } else {
            snake.pop();
        }
    }
}

// 游戏主循环
function gameMain() {
    update();
    draw();
}

// 改变方向
function changeDirection(snakeIndex, newDirection) {
    const currentDirection = directions[snakeIndex];
    // 防止反向移动
    if (
        (newDirection.x === -currentDirection.x && newDirection.x !== 0) ||
        (newDirection.y === -currentDirection.y && newDirection.y !== 0)
    ) {
        return;
    }
    directions[snakeIndex] = newDirection;
}

// 键盘控制
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    // 蛇1：方向键控制
    switch(e.key) {
        case 'ArrowUp':
            e.preventDefault();
            changeDirection(0, { x: 0, y: -1 });
            break;
        case 'ArrowDown':
            e.preventDefault();
            changeDirection(0, { x: 0, y: 1 });
            break;
        case 'ArrowLeft':
            e.preventDefault();
            changeDirection(0, { x: -1, y: 0 });
            break;
        case 'ArrowRight':
            e.preventDefault();
            changeDirection(0, { x: 1, y: 0 });
            break;
        // 蛇2：WASD控制
        case 'w':
        case 'W':
            e.preventDefault();
            changeDirection(1, { x: 0, y: -1 });
            break;
        case 's':
        case 'S':
            e.preventDefault();
            changeDirection(1, { x: 0, y: 1 });
            break;
        case 'a':
        case 'A':
            e.preventDefault();
            changeDirection(1, { x: -1, y: 0 });
            break;
        case 'd':
        case 'D':
            e.preventDefault();
            changeDirection(1, { x: 1, y: 0 });
            break;
    }
});


// 开始游戏
function startGame() {
    snakes = [
        [{ x: 10, y: 10 }],  // 蛇1
        [{ x: 20, y: 20 }]   // 蛇2
    ];
    directions = [
        { x: 1, y: 0 },   // 蛇1方向
        { x: -1, y: 0 }   // 蛇2方向
    ];
    scores = [0, 0];
    if (scoreElement1) scoreElement1.textContent = scores[0];
    if (scoreElement2) scoreElement2.textContent = scores[1];
    gameRunning = true;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    generateFood();
    
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    gameLoop = setInterval(gameMain, 150);
}

// 游戏结束
function gameOver(winnerIndex = null) {
    gameRunning = false;
    clearInterval(gameLoop);
    
    if (winnerIndex !== null) {
        const winnerName = winnerIndex === 0 ? '蛇1（绿色）' : '蛇2（蓝色）';
        if (winnerElement) {
            winnerElement.textContent = `${winnerName} 获胜！`;
        }
        if (finalScoreElement) {
            finalScoreElement.textContent = `蛇1: ${scores[0]}分 | 蛇2: ${scores[1]}分`;
        }
    } else {
        if (winnerElement) {
            winnerElement.textContent = '平局！';
        }
        if (finalScoreElement) {
            finalScoreElement.textContent = `蛇1: ${scores[0]}分 | 蛇2: ${scores[1]}分`;
        }
    }
    
    gameOverScreen.classList.remove('hidden');
}

// 重新开始
function resetGame() {
    snakes = [
        [{ x: 10, y: 10 }],  // 蛇1
        [{ x: 20, y: 20 }]   // 蛇2
    ];
    directions = [
        { x: 1, y: 0 },   // 蛇1方向
        { x: -1, y: 0 }   // 蛇2方向
    ];
    scores = [0, 0];
    if (scoreElement1) scoreElement1.textContent = scores[0];
    if (scoreElement2) scoreElement2.textContent = scores[1];
    gameRunning = false;
    startScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    
    generateFood();
    draw();
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取按钮元素
    upBtn = document.getElementById('upBtn');
    downBtn = document.getElementById('downBtn');
    leftBtn = document.getElementById('leftBtn');
    rightBtn = document.getElementById('rightBtn');
    
    // 事件监听
    if (startBtn) startBtn.addEventListener('click', startGame);
    if (restartBtn) restartBtn.addEventListener('click', resetGame);
    
    // 按钮控制（控制蛇1）
    if (upBtn) {
        upBtn.addEventListener('click', () => {
            if (gameRunning) changeDirection(0, { x: 0, y: -1 });
        });
    }
    
    if (downBtn) {
        downBtn.addEventListener('click', () => {
            if (gameRunning) changeDirection(0, { x: 0, y: 1 });
        });
    }
    
    if (leftBtn) {
        leftBtn.addEventListener('click', () => {
            if (gameRunning) changeDirection(0, { x: -1, y: 0 });
        });
    }
    
    if (rightBtn) {
        rightBtn.addEventListener('click', () => {
            if (gameRunning) changeDirection(0, { x: 1, y: 0 });
        });
    }
    
    // 初始绘制
    generateFood();
    draw();
});


