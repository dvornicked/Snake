let game =  {
    canvas: null,
     ctx: null,
     sprites: {
         background: null,
         cell: null,
     },
    width: 640,
    height: 360,
    init() {
        this.canvas = document.getElementById('myCanvas')
        this.ctx = this.canvas.getContext('2d')
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
         window.requestAnimationFrame(() => {
             this.ctx.drawImage(this.sprites.background, 0, 0)
             this.board.render()
         })
     }
}

game.board = {
    game: game,
    size: 15,
    cells: [],
    create() {
        console.log('Вызвана функция')
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                let cell = this.createCell(row, col)
                this.cells.push(cell)
            }
        }
        console.log(this.cells)
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
    }
}

game.start()
