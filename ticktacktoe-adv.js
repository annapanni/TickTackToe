"use strict"

const n=10
const toWin = 5
let filler = "o"
// lines = [[linetype, [next possible places for the line]], [any, pos] ....]
let linesX = []
let posX = []
let linesO = []
let posY = []

const inList = (a, b) => !! b.find( bl => (a.find((ae, i) => ae !== bl[i]))===undefined)
const equList = (a,b) =>  (a.find((ae, i) => ae !== b[i])) === undefined
const commonItem = (a,b) => a.find((ae) => b.includes(ae)) !== undefined

//puts an x or an o into the grid
function fillGrid (e){
  if (e.target["innerText"] !="x" && e.target["innerText"]!="o"){
    e.target["innerText"] = filler
    if (filler=="x") {
      if (inRow(e.target.index, linesX, posX)) alert("X wins!!!")}
    else if (inRow(e.target.index, linesO, posY)) alert ("O wins!!!")
    //filler = (filler=="o")? "x": "o"
  }
}

//return whether two coordiantes are adjacent or not, if yes what kind of connection they have
function nextTo (pos1, pos2){
  const diffX = pos1[0] - pos2[0]
  const diffY = pos1[1] - pos2[1]
  if (diffX == 0 && Math.abs(diffY) == 1) return "vertical"
  else if (Math.abs(diffX) == 1 && diffY == 0) return "horizontal"
  else if (diffX == diffY && (diffX === 1 || diffX === -1)) return "left diagonal"
  else if (diffX == -diffY && (diffX ===1 || diffX === -1)) return "right diagonal"
  else return false
}

//returns diatance of two coordinates (diagonals count as 1 too)
function dist (pos1, pos2){
  const diffX = Math.abs(pos1[0] - pos2[0])
  const diffY = Math.abs(pos1[1] - pos2[1])
  console.log(diffX, diffY)
  return Math.max(diffX, diffY)
}

//returns the possible moves to continue a line for a list of points
function emptyPlace (type, lista){
  let a
  let b
  let places = []
  for (let p of lista){
    if (type == "vertical"){
      a = [p[0], p[1]+1]
      b = [p[0], p[1]-1]
    }
    else if (type == "horizontal"){
      a = [p[0]+1, p[1]]
      b = [p[0]-1, p[1]]
    }
    else if (type == "left diagonal"){
      a = [p[0]+1, p[1]+1]
      b = [p[0]-1, p[1]-1]
    }
    else if (type == "right diagonal"){
      a = [p[0]-1, p[1]+1]
      b = [p[0]+1, p[1]-1]
    }
    if (!inList(a, lista)) places.push(a)
    if (!inList(b, lista)) places.push(b)
  }
  return places
}

//gives the next empty space for a new point of the line
function nextEmpty (type, newPoint, prevPoint){
  let a
  let b
  if (type == "vertical"){
    a = [newPoint[0], newPoint[1]+1]
    b = [newPoint[0], newPoint[1]-1]
  }
  else if (type == "horizontal"){
    a = [newPoint[0]+1, newPoint[1]]
    b = [newPoint[0]-1, newPoint[1]]
  }
  else if (type == "left diagonal"){
    a = [newPoint[0]+1, newPoint[1]+1]
    b = [newPoint[0]-1, newPoint[1]-1]
  }
  else if (type == "right diagonal"){
    a = [newPoint[0]-1, newPoint[1]+1]
    b = [newPoint[0]+1, newPoint[1]-1]
  }
  return [(dist(a, prevPoint) > dist(b, prevPoint)? a:b), prevPoint]
}

function joinLines(a,b){
  const type = a[0]
  let bestDist = 0
  let best;
  for (let i of a[1]){
    for (let j of b[1]){
      if (dist(i,j) > bestDist){
        bestDist = dist(i,j)
        best = [i,j]
      }
    }
  }
  return [type, best]
}

//checks if new point falls in line with any previous ones
function inRow (pos, lines, allPos){
  let done = 0
  let win = false
  //lines that the given position is already in [index, type]
  let alreadyLines = []
  let lineTypes = {}
  for (let i =0; i<lines.length; i++){
    const line = lines[i]
    if (inList(pos, line[1])){
      line [1] = nextEmpty(line[0], pos, (equList(line[1][0], pos)? line[1][1]: line[1][0]))
      alreadyLines.push(i)
      lineTypes[i]=line[0]
      done = 1
      if (dist(line[1][0], line[1][1])>toWin) win = true
    }
  }
  for (let i = 0; i < allPos.length; i++){
    const p = allPos[i][0]
    const type = nextTo(pos, p)
    if (type && !commonItem(alreadyLines, allPos[i][1])){
      lines.push([type, emptyPlace(type, [p, pos])])
      alreadyLines.push(lines.length-1)
      allPos[i][1].push(lines.length-1)
      lineTypes[lines.length-1]=type
      done = 1
    }
  }
  let toRemove = []
  let joinedLines = []
  for (let i = 0; i<alreadyLines.length; i++){
    for (let j = 0; j<i; j++){
      if (lineTypes[alreadyLines[i]]===lineTypes[alreadyLines[j]]){
        toRemove.push(j)
        const l = joinLines(lines[i], lines[j])
        if (dist(l[1][0], l[1][1]) > toWin) {win = true; console.log("dfgdfg")}
        joinedLines.push([i,l])
      }
    }
  }
  for (let i of joinedLines){lines[i[0]]=i[1]}
  for (let i of toRemove){lines.splice(i, 1)}
  allPos.push([pos, alreadyLines])
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
document.body.appendChild(tabl)
