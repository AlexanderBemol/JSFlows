var width = window.innerWidth;
var height = window.innerHeight;
let nodeWidth = 120;
let nodeHeight = 40;

let startX = 0;
let startY = 0;
let circleRadio = 6;

let startArrowX = 0;
let startArrowY = 0;
let startId
let startCCId

let circleConnector = document.getElementById('circleConnector')
let canvas = document.getElementById('canvas');

let hoveringConnector = false;
let drawing = false;
let line
let keepLine = false

var data = new Map()

let drawArrow = (ax, ay, bx, by) => {
  if(ax > bx) {
      bx = ax + bx; 
      ax = bx - ax;
      bx = bx - ax;

      by = ay + by;
      ay = by - ay;
      by = by - ay;
  }

  let distance = Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2));
  let calc = Math.atan((by - ay) / (bx - ax));
  let degree = calc * 180 / Math.PI;
  //let unitVector = (bx-ax)/distance + (bx-ax)/distance

  if(line) document.body.removeChild(line)

  line = document.createElement('div');
  line.style.position = 'absolute'
  line.style.transformOrigin = 'top left'
  line.style.height = '2px'
  line.style.width = distance + 'px'
  line.style.top =  ay + 'px'
  line.style.left = ax + 'px',
  line.style.transform = `rotate(${degree}deg)`
  line.style.backgroundColor = '#5c5c5c'
  line.style.zIndex = '0'

  line.classList.add('line')
  line.classList.add('line-drawing')

  document.body.appendChild(line);
}

let onMouseMove = (posX,posY) => {
    if(drawing)
      drawArrow(startArrowX,startArrowY,posX,posY)
}

let onDragStart = (e) => {
    if(hoveringConnector){
      e.preventDefault();
      return
    }
    e.dataTransfer.setData("text", e.target.id);
    e.currentTarget.style.opacity = '0.8'
    startX = e.layerX
    startY = e.layerY
    //drawing = true
}

let onDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    let objNodo = {
      id: e.currentTarget.id,
      posX: e.currentTarget.style.left,
      posY: e.currentTarget.style.top,
      arrows: {
        0: [],
        1: [],
        2: [],
        3: []  
      }
    }
    if(data.has(objNodo.id)){
      let aux = data.get(objNodo.id)
      aux.posX = objNodo.posX
      aux.posY = objNodo.posY
      data.set(objNodo.id,aux)
    } else {
      data.set(objNodo.id,objNodo)
    }
}

let onDragOver = (e) => {
  e.preventDefault();
}

let onDrop = (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text')
    const draggableElement = document.getElementById(id);
    const dropzone = e.target;

    if(!dropzone.classList.contains('nodo')){
      dropzone.appendChild(draggableElement);
      draggableElement.style.position = 'absolute'
      draggableElement.style.left = (e.clientX-startX) +"px";
      draggableElement.style.top = (e.clientY-startY)+ "px";
    }   
}

let cleanNodes = () =>{
  let items = document.querySelectorAll('.nodo')
  items.forEach(item => {
    item.classList.remove('node-active')
  })
}

let configureConnector = (connector) =>{
  connector.addEventListener('mouseenter', e => {
    hoveringConnector = true
  })
  connector.addEventListener('mouseleave', e => {
    hoveringConnector = false
  })
  connector.addEventListener('mousedown', e =>  {
    if(e.target.parentElement.parentElement.classList.contains('nodo')){
      drawing = true
      e.target.parentElement.parentElement.classList.add('node-active')
      startArrowX = e.clientX
      startArrowY = e.clientY
      startId = e.target.parentElement.parentElement.id
      startCCId = e.target.id.replace('cc','')
    }
  })
  connector.addEventListener('mouseup', e =>  {
    if(line) line.classList.remove('line-drawing')
    line = null
    drawing = false
    cleanNodes()
    let obj = data.get(startId)
    obj.arrows[startCCId].push(e.currentTarget.parentElement.id)
    data.set(startId,obj)
    console.log(data)
  })
}

let items = document.querySelectorAll('.nodo');
  items.forEach((item) => {
    item.addEventListener('dragstart', onDragStart, false);
    item.addEventListener('dragend', onDragEnd, false);
    
    let ccTop = circleConnector.cloneNode(true);
    let ccBottom = circleConnector.cloneNode(true);
    let ccLeft = circleConnector.cloneNode(true);
    let ccRight = circleConnector.cloneNode(true);
    
    ccTop.id="cc0"
    ccBottom.id="cc2"
    ccLeft.id = "cc3"
    ccRight.id = "cc1"

    item.appendChild(ccTop)
    item.appendChild(ccBottom)
    item.appendChild(ccLeft)
    item.appendChild(ccRight)

    ccTop.style.position = 'absolute'
    ccTop.style.left = item.clientWidth/2 - circleRadio + 'px'
    ccTop.style.top = 0 - circleRadio +'px'

    ccBottom.style.position = 'absolute'
    ccBottom.style.left = item.clientWidth/2 - circleRadio + 'px'
    ccBottom.style.top = item.clientHeight - circleRadio +'px'

    ccLeft.style.position = 'absolute'
    ccLeft.style.left = 0 - circleRadio + 'px'
    ccLeft.style.top = item.clientHeight/2 - circleRadio +'px'

    ccRight.style.position = 'absolute'
    ccRight.style.left = item.clientWidth - circleRadio + 'px'
    ccRight.style.top = item.clientHeight/2 - circleRadio +'px'

    configureConnector(ccTop)
    configureConnector(ccBottom)
    configureConnector(ccLeft)
    configureConnector(ccRight)

  });


canvas.addEventListener('dragover', onDragOver, false);
canvas.addEventListener('drop', onDrop, false);
canvas.addEventListener('mouseup',e => {
  cleanNodes()
  if(line) document.body.removeChild(line)
  line = null
  drawing = false
})
canvas.addEventListener('mousemove',e => {onMouseMove(e.clientX,e.clientY)})