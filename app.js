new Vue({

    el: "#root",

    data: {
        canvas: null,
        ctx: null,
        snake: null,
        food: null,
        spacer: 20,
        startSequence: '',
        gameInProgress: false,
        gameCounter: 0,
        score: 0
    },

    mounted: function() {
        this.canvas = this.$refs.gameBoard;
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener('keydown', this.keyDown);
    },

    computed: {
        buttonText: function() {
            return (this.gameCounter ? 'TRY AGAIN' : 'START');
        }
    },

    methods: {
        start: function() {
            let self = this;
            self.snake = new self.Snake(self.snap(self.canvas.width/2), self.snap(self.canvas.height/2), self.spacer, self);
            self.beginStartSequence();
            setTimeout(self.endStartSequence, 1500);
        },

        draw: function() {
            if (this.snake.isInBounds()) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawGrid();
                if (this.snake.isOnFood()) {
                    this.food = null;
                    this.score++;
                    this.snake.grow();
                }
                this.drawFood();
                this.snake.draw();
                this.snake.move();
            }
            if (this.gameInProgress) {
                // Aim for a framerate of 10 frames/sec
                setTimeout(() => requestAnimationFrame(this.draw), 100);
            }
        },

        drawGrid: function() {
            this.ctx.strokeStyle = '#323232';
            this.ctx.lineWidth = 1;
            for (let x = this.spacer + 0.5; x < this.canvas.width; x += this.spacer) {
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.width);
                this.ctx.stroke();
            }
            for (let y = this.spacer + 0.5; y < this.canvas.height; y += this.spacer) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.height, y);
                this.ctx.stroke();
            }
        },

        drawFood: function() {
            if (!this.food) {
                // Place new food
                let randomX = this.snap(Math.random() * this.canvas.width);
                let randomY = this.snap(Math.random() * this.canvas.height);
                this.food = new this.Food(randomX, randomY, this.spacer, this);
            }
            this.food.draw();
        },

        beginStartSequence: function() {
            this.score = 0;
            this.food = null;
            this.setStartSequence('wink-out');
        },

        endStartSequence: function() {
            this.gameCounter++;
            this.gameInProgress = true;
            this.setStartSequence('display-none');
            requestAnimationFrame(this.draw);
        },

        setStartSequence: function(sequence) {
            this.startSequence = sequence;
        },

        snap: function(val) {
            return this.spacer * Math.round(val / this.spacer);
        },

        triggerLoss: function() {
            this.gameInProgress = false;
            this.startSequence = '';
        },

        keyDown: function(event) {
            switch (event.key) {
                case 'ArrowUp':
                this.snake.direction = 'up';
                break;
                case 'ArrowDown':
                this.snake.direction = 'down';
                break;
                case 'ArrowLeft':
                this.snake.direction = 'left';
                break;
                case 'ArrowRight':
                this.snake.direction = 'right';
                break;
            }
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowRight':
                    event.preventDefault();
                    break;
            }
        },

        Snake: function(x, y, size, self) {
            // self = Vue instance, which must be passed manually
            return {
                x: x,
                y: y,
                size: size,
                direction: 'up',

                isInBounds: function() {
                    // Have we run into the wall?
                    if (this.y < 0 ||
                        this.y > self.canvas.height - this.size ||
                        this.x < 0 ||
                        this.x > self.canvas.width - this.size) {

                        self.triggerLoss();
                        return false;
                    }
                    return true;
                },

                draw: function() {
                    self.ctx.beginPath();
                    self.ctx.fillStyle = '#fff';
                    self.ctx.fillRect(this.x, this.y, this.size, this.size);
                },

                move: function() {
                    switch (this.direction) {
                        case 'up':
                            this.y -= this.size;
                            break;
                        case 'down':
                            this.y += this.size;
                            break;
                        case 'left':
                            this.x -= this.size;
                            break;
                        case 'right':
                            this.x += this.size;
                            break;
                    }
                },

                isOnFood: function() {
                    return (self.food &&
                        this.x == self.food.x &&
                        this.y == self.food.y);
                },

                grow: function() {

                }
            }
        },

        Food: function(x, y, size, self) {
            // self = Vue instance, which must be passed manually
            return {
                x: x,
                y: y,
                size: size,

                draw: function () {
                    self.ctx.beginPath();
                    self.ctx.fillStyle = '#fff';
                    self.ctx.fillRect(this.x, this.y, this.size, this.size);
                }
            }
        }


    }
});
