"use strict"

const n=10
const toWin = 5
let filler = "x"

let posX = []
let posO = []
let xP = 0
let oP = 0

const inList = (a, b) => !! b.find( bl => (a.find((ae, i) => ae !== bl[i]))===undefined)
const equList = (a,b) =>  (a.find((ae, i) => ae !== b[i])) === undefined
const commonItem = (a,b) => a.find((ae) => b.includes(ae)) !== undefined
const inWich = (s, l) => l.filter( le => le.includes(s))


function clear(){
  posO = []
  posX = []
  for (let row of tabl.rows){
    for (let cell of row.cells){
      cell.innerHTML = "&nbsp;"+"&nbsp;"
    }
  }
}

function wins (a){
  alert(`${a} wins!!!`)
  clear()
  if (a === "X") xP += 1
  else oP += 1
  points.innerHTML = `X: ${xP}
  O: ${oP}`
}

//puts an x or an o into the grid
function fillGrid (e){
  if (e.target["innerText"] !="x" && e.target["innerText"]!="o"){
    e.target["innerText"] = filler
    if (filler=="x") {
      if (administrate(e.target.index, posX)) wins("X")
    }
    else if (administrate(e.target.index, posO)) wins("O")
    filler = (filler=="o")? "x": "o"
  }
}

function check ([x,y], positions, d){
  const nextPos = [x + d[0], y + d[1]]
  if (inList(nextPos, positions)){
    return check(nextPos, positions, d) + 1
  }
  else return 0
}

function administrate ([x,y], positions){
  let win = false
  let directions = {
    "r": [1,0],  //right
    "u":[0, -1],  //up
    "tl":[-1,-1], //top left
    "tr":[-1,1],  //top right
    "l":[-1, 0],  //left
    "d":[0,1],  //down
    "br":[1,1],   //bottom right
    "bl":[1,-1],   //bottom left
  }
  let points = {
    "r l":1,
    "u d":1,
    "tl br":1,
    "tr bl":1
  }
  for (let dName in directions){
    let dPos = directions[dName]
    let line  = inWich(dName, Object.keys(points))[0]
    points[line] += check([x,y], positions, dPos)
    if (points[line] >= toWin) win = true
  }
  positions.push([x,y])
  return win
}

//generating table
const tabl=document.createElement("table")
tabl.style["width"]=n*60+"px"
tabl.style["height"]=n*60+"px"
for (let i=0; i<n; i++){
  const row=document.createElement("tr")
  for ( let y=0; y<n; y++){
    const data=document.createElement("td")
    data.addEventListener("click", fillGrid)
    data["innerHTML"]="&nbsp;"+"&nbsp;"
    data.index = [y, i]
    row.appendChild(data)
  }
  tabl.appendChild(row)
}

const points = document.createElement("p")
points.innerHTML = `X: 0
O: 0`

const newGameBtn = document.createElement("button")
newGameBtn.innerHTML = "Új játék"
newGameBtn.addEventListener("click", clear)

document.body.appendChild(tabl)
document.body.appendChild(newGameBtn)
document.body.appendChild(points)
