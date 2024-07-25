const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;

let scarySound = new Audio('./piste_1.mp3');
scarySound.preload = 'auto';
scarySound.load();

(function setup() {
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        fruit.draw();
        snake.update();
        snake.draw();

        if (snake.eat(fruit)) {
            fruit.pickLocation();
        }

        if (snake.checkCollision()) {
            gameOver();
        }

        document.querySelector('.score').innerText = snake.total;
    }, 250);
}());

window.addEventListener('keydown', (evt) => {
    const direction = evt.key.replace('Arrow', '');
    snake.changeDirection(direction);
});

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.total = 0;
    this.tail = [];

    this.draw = function () {
        ctx.fillStyle = "#FFFFFF";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    };

    this.update = function () {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        this.tail[this.total - 1] = { x: this.x, y: this.y };
        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) this.x = 0;
        if (this.y >= canvas.height) this.y = 0;
        if (this.x < 0) this.x = canvas.width - scale;
        if (this.y < 0) this.y = canvas.height - scale;
    };

    this.changeDirection = function (direction) {
        switch (direction) {
            case 'Up':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case 'Down':
                if (this.ySpeed === 0) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case 'Left':
                if (this.xSpeed === 0) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case 'Right':
                if (this.xSpeed === 0) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    };

    this.eat = function (fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }
        return false;
    };

    this.checkCollision = function () {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    };
}

function Fruit() {
    this.x;
    this.y;

    this.pickLocation = function () {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
    };

    this.draw = function () {
        ctx.fillStyle = "#4cafab";
        ctx.fillRect(this.x, this.y, scale, scale);
    };
}

function gameOver() {
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('body').style.justifyContent = 'center';
    document.getElementById('horrorImage').style.display = 'flex';
    scarySound.play();
    setTimeout(() => {
        location.reload();
    }, 5000);
}

function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

function enableMobileMode() {
    document.body.style.overflow = 'hidden';

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (event) => {
        touchStartX = event.changedTouches[0].screenX;
        touchStartY = event.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', (event) => {
        touchEndX = event.changedTouches[0].screenX;
        touchEndY = event.changedTouches[0].screenY;
        handleGesture();
    }, false);

    function handleGesture() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) {
                snake.changeDirection('Right');
            } else {
                snake.changeDirection('Left');
            }
        } else {
            if (diffY > 0) {
                snake.changeDirection('Down');
            } else {
                snake.changeDirection('Up');
            }
        }
    }
}

function enableDesktopMode() {
    // Ne rien faire ou ajouter des fonctionnalités spécifiques à la version desktop
}

if (isTouchDevice()) {
    enableMobileMode();
} else {
    enableDesktopMode();
}
