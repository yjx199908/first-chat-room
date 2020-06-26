// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
let win = require('electron').remote.getCurrentWindow()
let body = document.getElementById('login-block')

let dragstart = false
let offsetx =400;
let offsety = 300;

body.addEventListener('mouseleave', () => {
    win.setIgnoreMouseEvents(true, { forward: true })
    dragstart = false
})

body.addEventListener('mouseenter', () => {
    win.setIgnoreMouseEvents(false)
})

body.addEventListener('mousedown',()=>{
    dragstart = true
})

body.addEventListener('mousemove',function(event){
    if(dragstart){
        offsetx += event.movementX
        offsety += event.movementY

        this.style.top = offsety + 'px'
        this.style.left = offsetx + 'px'
    }
})

body.addEventListener('mouseup',()=>{
    dragstart = false
})
