(()=>{var t={canvas:null,ctx:null,sprites:{background:null,cell:null,body:null},width:640,height:360,init:function(){this.canvas=document.getElementById("myCanvas"),this.ctx=this.canvas.getContext("2d")},start:function(){var t=this;this.init(),this.preload((function(){t.run()}))},preload:function(t){var e=0,i=Object.keys(this.sprites).length,s=function(){++e>=i&&t()};for(var r in this.sprites)this.sprites[r]=new Image,this.sprites[r].src="./img/".concat(r,".png"),this.sprites[r].addEventListener("load",s)},run:function(){var t=this;this.board.create(),this.snake.create(),window.requestAnimationFrame((function(){t.ctx.drawImage(t.sprites.background,0,0),t.board.render(),t.snake.render()}))}};t.board={game:t,size:15,cells:[],create:function(){for(var t=0;t<this.size;t++)for(var e=0;e<this.size;e++){var i=this.createCell(t,e);this.cells.push(i)}},createCell:function(t,e){var i=this.game.sprites.cell.width+1;return{row:t,col:e,x:i*e+(this.game.width-i*this.size)/2,y:i*t+(this.game.height-i*this.size)/2}},render:function(){var t=this;this.cells.forEach((function(e){t.game.ctx.drawImage(t.game.sprites.cell,e.x,e.y)}))},getCell:function(t,e){return this.cells.find((function(i){return i.row===t&&i.col===e}))}},t.snake={game:t,cells:[],create:function(){for(var t=0,e=[{row:7,col:7},{row:8,col:7}];t<e.length;t++){var i=e[t],s=this.game.board.getCell(i.row,i.col);this.cells.push(s)}},render:function(){var t=this;this.cells.forEach((function(e){t.game.ctx.drawImage(t.game.sprites.body,e.x,e.y)}))}},t.start()})();