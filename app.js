new Vue({

    el: "#app",

    data: {
        canvas: null,
        ctx: null,
        snake: null,
        food: null,
        spacer: 20,
        startSequence: '',
        gameInProgress: false
    },

    mounted: function() {
        this.canvas = this.$refs.gameBoard;
        this.ctx = this.canvas.getContext('2d');
    },

    methods: {
        start: function() {
            let self = this;

            self.snake = new self.Snake(self.snap(self.canvas.width/2), self.snap(self.canvas.height/2), self.spacer);
            self.beginStartSequence();

            setTimeout(function () {
                self.endStartSequence();
                self.gameInProgress = true;
                requestAnimationFrame(self.draw);
            }, 1500);
        },

        draw: function() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawGrid();
        },

        drawGrid() {
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

        beginStartSequence() {
            this.setStartSequence('wink-out');
        },

        endStartSequence() {
            this.setStartSequence('display-none');
        },

        setStartSequence(sequence) {
            this.startSequence = sequence;
        },

        snap: function(val) {
            return this.spacer * Math.round(val / this.spacer);
        },

        Snake: function(x, y, size) {
            return {
                x: x,
                y: y,
                size: size
            }
        }


    }
});
