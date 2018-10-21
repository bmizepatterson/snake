new Vue({

    el: "#root",

    data: {
        canvas: null,
        ctx: null,
        snake: null,
        food: null,
        spacer: 10,
        startSequence: '',
        gameInProgress: false,
        gameCounter: 0,
        gameWon: false
    },

    mounted: function() {
        this.canvas = this.$refs.gameBoard;
        this.ctx = this.canvas.getContext('2d');
        window.addEventListener('keydown', this.keyDown);
    },

    computed: {
        buttonText: function() {
            if (this.gameWon) {
                return 'PLAY AGAIN';
            }
            if (this.gameCounter) {
                return 'TRY AGAIN';
            }
            return 'START';
        },

        gridSize: function() {
            return this.canvas.width / this.spacer * this.canvas.height / this.spacer;
        }
    },

    methods: {
        start: function() {
            let self = this;
            self.snake = new self.Snake(self.snap(self.canvas.width/2), self.snap(self.canvas.height/2), self.spacer, self);
            self.food = null;
            self.gameWon = false;
            self.beginStartSequence();
            setTimeout(() => {
                this.gameCounter++;
                this.gameInProgress = true;
                self.endStartSequence();
                requestAnimationFrame(this.draw);
            }, 1500);
        },

        draw: function() {
            // The unlikely win scenario
            if (this.snake.segments == this.gridSize) this.triggerWin();

            if (this.snake.isInBounds() && this.snake.isClearOfItself()) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                // this.drawGrid();
                if (this.snake.isOnFood()) {
                    this.food = null;
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
                let [x, y] = this.getNewFoodCoords();
                this.food = new this.Food(x, y, this.spacer, this);
            }
            this.food.draw();
        },

        getNewFoodCoords: function() {
            let randomX, randomY, tryAgain;
            do {
                tryAgain = false;
                randomX = this.snap(Math.random() * (this.canvas.width - this.spacer));
                randomY = this.snap(Math.random() * (this.canvas.height - this.spacer));
                // Make sure the new food isn't placed underneath the snake
                for (let segment of this.snake.path) {
                    if (randomX == segment.x && randomY == segment.y) {
                        tryAgain = true;
                    }
                }
            } while (tryAgain)
            return [randomX, randomY];
        },

        beginStartSequence: function() {
            this.setStartSequence('wink-out');
        },

        endStartSequence: function() {
            this.setStartSequence('display-none');
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

        triggerWin: function() {
            this.gameInProgress = false;
            this.startSequence = '';
            this.gameWon = true;
        },

        keyDown: function(event) {
            // Prevent snake from curling back on itself when it has more than one segment
            if (event.key === 'ArrowUp' &&
                (this.snake.direction !== 'down' || this.snake.segments == 1)
            ) {
                this.snake.direction = 'up';

            } else if (event.key === 'ArrowDown' &&
                (this.snake.direction !== 'up' || this.snake.segments == 1)
            ) {
                this.snake.direction = 'down';

            } else if (event.key === 'ArrowLeft' &&
                (this.snake.direction !== 'right' || this.snake.segments == 1)
            ) {
                this.snake.direction = 'left';

            } else if (event.key === 'ArrowRight' &&
                (this.snake.direction !== 'left' || this.snake.segments == 1)
            ) {
                this.snake.direction = 'right';
            }

            if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
                event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
            }
        },

        Snake: function(x, y, size, self) {
            // self = Vue instance, which must be passed manually
            return {
                x: x,   // The position of the head
                y: y,
                size: size,
                direction: 'up',
                // An array of past positions; used for rendering segments
                path: [{ x: x, y: y }],
                segments: 1,

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

                isClearOfItself: function() {
                    // Head of snake shouldn't intersect with any segment
                    // in the path... except for the head itself, of course,
                    // so start loop at index 1.
                    for (let i = 1; i < this.path.length; i++) {
                        if (this.x == this.path[i].x && this.y == this.path[i].y) {
                            self.triggerLoss();
                            return false;
                        }
                    }
                    return true;
                },

                draw: function() {
                    for (let i = 0; i < this.segments; i++) {
                        self.ctx.beginPath();
                        self.ctx.fillStyle = '#fff';
                        self.ctx.fillRect(this.path[i].x, this.path[i].y, this.size, this.size);
                    }
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
                    // Add this new position to the path history
                    this.path.unshift({ x: this.x, y: this.y });
                    // Trim off irrelevant path data
                    // The length of this.path should equal this.segments
                    this.path.splice(this.segments + 1);
                },

                isOnFood: function() {
                    return (self.food &&
                        this.x == self.food.x &&
                        this.y == self.food.y);
                },

                grow: function() {
                    this.segments++;
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
