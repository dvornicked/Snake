 let game =  {
    canvas: null,
     ctx: null,
     sprites: {
         background: null,
         cell: null,
     },
    start() {
        this.canvas = document.getElementById('myCanvas')
        this.ctx = this.canvas.getContext('2d')

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
         
         callback()
     },
     run() {
         window.requestAnimationFrame(() => {
             this.ctx.drawImage(this.sprites.background, 0, 0)
             this.ctx.drawImage(this.sprites.cell, 320, 180)
         })
     }
}

game.start()


