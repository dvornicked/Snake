let game =  {
    canvas: null,
     ctx: null,
     sprites: {
         background: null,
         cell: null,
         body: null,
         food: null
     },
    width: 0,
    height: 0,
    dimensions: {
        max: {
            width: 640,
            height: 360
        },
        min: {
            width: 300,
            height: 300
        }
    },
    init() {
        this.canvas = document.getElementById('myCanvas')
        this.ctx = this.canvas.getContext('2d')
        this.initDimensions()
    },
    initDimensions() {
        let data = {
            maxWidth: this.dimensions.max.width,
            maxHeight: this.dimensions.max.height,
            minWidth: this.dimensions.min.width,
            minHeight: this.dimensions.min.height,
            realWidth: window.innerWidth,
            realHeight: window.innerHeight
        }

        if (data.realWidth / data.realHeight > data.maxWidth / data.maxHeight) {
            this.fitWidth(data)
        } else {
            this.fitHeight(data)
        }

        this.canvas.width = this.width
        this.canvas.height = this.height
    },
    fitHeight(data) {
        this.width = Math.round(data.realWidth * data.maxHeight / data.realHeight)
        this.width = Math.min(this.width, data.maxWidth)
        this.width = Math.max(this.width, data.minWidth)
        this.height = Math.round(this.width * data.realHeight / data.realWidth)
        this.canvas.style.height = '100%'
    },
    fitWidth(data) {
        this.height = Math.round(data.maxWidth * data.realHeight / data.realWidth)
        this.height = Math.min(this.height, data.maxHeight)
        this.height = Math.max(this.height, data.minHeight)
        this.width = Math.round(data.realWidth * this.height / data.realHeight)
        this.canvas.style.width = '100%'
    },
    start() {
        this.init()
        this.preload(() => {
            this.run()
        })
    },
     preload(callback) {
        let loaded = 0
        let required = Object.keys(this.sprites).length
        let onAssetLoad = () => {
            ++loaded

            if (loaded >= required) {
                callback()
            }
        }
         for (let key in this.sprites) {
             this.sprites[key] = new Image()
             this.sprites[key].src = `./img/${key}.png`
             this.sprites[key].addEventListener('load', onAssetLoad)
         }
     },
    create() {
        this.board.create()
        this.snake.create()
        this.board.createFood()

        window.addEventListener('keydown', e => {
            this.snake.start(e.key)
        })
    },
    render() {
        window.requestAnimationFrame(() => {
            this.ctx.clearRect(0, 0, this.width, this.height)
            this.ctx.drawImage(this.sprites.background, (this.width - this.sprites.background.width) / 2, (this.height - this.sprites.background.height) / 2)
            this.board.render()
            this.snake.render()
        })
    },
    update() {
        this.snake.move()
        this.render()
    },
     run() {
         this.create()

         setInterval(() => {
             this.update()
         }, 150)

     },
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

game.board = {
    game: game,
    size: 15,
    cells: [],
    create() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                let cell = this.createCell(row, col)
                this.cells.push(cell)
            }
        }
    },
    createCell(row, col) {
        let cellSize = this.game.sprites.cell.width + 1
        let offsetX, offsetY

        offsetX = (this.game.width - cellSize * this.size) / 2
        offsetY = (this.game.height - cellSize * this.size) / 2
        let cell = {row, col, x: cellSize * col + offsetX, y: cellSize * row + offsetY}
        return cell
    },
    render() {
        this.cells.forEach(cell => {
            this.game.ctx.drawImage(this.game.sprites.cell, cell.x, cell.y)
            if (cell.hasFood) {
                this.game.ctx.drawImage(this.game.sprites.food, cell.x, cell.y)
            }
        })
    },
    getCell(row, col) {
        return this.cells.find(cell => cell.row === row && cell.col === col)
    },
    createFood() {
        let cell = this.cells.find(cell => cell.hasFood)
        if (cell) {
            cell.hasFood = false
        }
        cell = this.getRandomAvailableCell()
        cell.hasFood = true
    },
    getRandomAvailableCell() {
        let pool = this.cells.filter(cell => !this.game.snake.hasCell(cell))
        let index = this.game.random(0, pool.length - 1)
        return pool [index]
    },
    isFoodCell(cell) {
        return cell.hasFood
    }
}

game.snake = {
    game: game,
    cells: [],
    moving: false,
    direction: false,
    directions: {
        up: {
            row: -1,
            col: 0
        },
        down: {
            row: 1,
            col: 0
        },
        left: {
            row: 0,
            col: -1
        },
        right: {
            row: 0,
            col: 1
        }
    },
    create() {
        let startCells= [
            {row: 0, col: 0},
            {row: 1, col: 0}
        ]
        this.direction = this.directions.up

        for (let startCell of startCells) {
            let cell = this.game.board.getCell(startCell.row, startCell.col)
            this.cells.push(cell)
        }
    },
    render() {
        this.cells.forEach(cell => {
            this.game.ctx.drawImage(this.game.sprites.body, cell.x, cell.y)
        })
    },
    start(key) {
        switch (key) {
            case 'ArrowUp':
                this.direction = this.directions.up
                break
            case 'ArrowDown':
                this.direction = this.directions.down
                break
            case 'ArrowLeft':
                this.direction = this.directions.left
                break
            case 'ArrowRight':
                this.direction = this.directions.right
                break
        }
        this.moving = true
    },
    move() {
        if (!this.moving) {
            return
        }
        let cell = this.getNextCell()

        if (cell) {
            this.cells.unshift(cell)


            if (!this.game.board.isFoodCell(cell)) {
                this.cells.pop()
            } else {
                this.game.board.createFood()
            }
        }
    },
    getNextCell() {
        let head = this.cells[0]

        let row = head.row + this.direction.row
        let col = head.col + this.direction.col

        return this.game.board.getCell(row, col)
    },
    hasCell(cell) {
        return this.cells.find(part => part === cell)
    }
}

game.start()
