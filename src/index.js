 let game =  {
    start() {
        let canvas = document.getElementById('myCanvas')
        let ctx = canvas.getContext('2d')

        let background = new Image()
        background.src = './img/background.png'
        background.addEventListener('load', () => {
            window.requestAnimationFrame(() => {
                ctx.drawImage(background, 0, 0)
            })
        })
    }
}

game.start()


