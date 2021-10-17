let game =  {
    canvas: null,
     ctx: null,
     sprites: {
         background: null,
         cell: null,
         body: null
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
        this.height = Math.round(this.width * data.realHeight / data.realWidth)
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
     run() {
        this.board.create()
         this.snake.create()
         window.requestAnimationFrame(() => {
             this.ctx.drawImage(this.sprites.background, (this.width - this.sprites.background.width) / 2, (this.height - this.sprites.background.height) / 2)
             this.board.render()
             this.snake.render()
         })
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
        })
    },
    getCell(row, col) {
        return this.cells.find(cell => cell.row === row && cell.col === col)
    }
}

game.snake = {
    game: game,
    cells: [],
    create() {
        let startCells= [
            {row: 7, col: 7},
            {row: 8, col: 7}
        ]

        for (let startCell of startCells) {
            let cell = this.game.board.getCell(startCell.row, startCell.col)
            this.cells.push(cell)
        }
    },
    render() {
        this.cells.forEach(cell => {
            this.game.ctx.drawImage(this.game.sprites.body, cell.x, cell.y)
        })
    }
}

game.start()
