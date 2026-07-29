// @ts-check

/**
 * @param {string} c
 */
function isDark(c) {
  return parseInt(c.slice(1, 3), 16)*.299+parseInt(c.slice(3, 5), 16)*.587+parseInt(c.slice(5, 7), 16)*.114 < 128
}

const COLOURS = {
  0: ["var(--light-colour)", "#FFFFFF"],
  2: ["#FF50A0", "#FFFFFF"],
  4: ["#5050FF", "#FFFFFF"],
  8: ["#FFFF50", "#808020"],
  16: ["#50FFA0", "#208020"],
  32: ["#FFA000", "#FFFFFF"],
  64: ["#FF80FF", "#FFFFFF"],
  128: ["#A0FF50", "#408020"],
  256: ["#FFD050", "#804020"],
  512: ["#A080FF", "#FFFFFF"],
  1024: ["#FF5050", "#FFFFFF"],
  2048: ["#50FFFF", "#208080"],
  4096: ["#E0FF20", "#808020"],
  8192: ["#D0A0FF", "#FFFFFF"],
}

  /**
   * @type {{ x: number; y: number; }[]}
   */
const AROUND = [
  {x:0, y:-1},
  {x:0, y:1},
  {x:-1, y:0},
  {x:1, y:0}
]

class Cell {
  /**
   * @param {{ x: number; y: number; }} pos
   * @param {HTMLDivElement} ref
   */
  constructor(pos, ref) {
    this.pos = pos
    this.value = 0
    this.ref = ref
  }
  update() {
    if (this.value < 0) {this.value = 0}
    let display = "";
    let background = COLOURS[8192];
    if (this.value > 0) {
      display = this.value.toString()
    }
    this.ref.innerHTML = display
    // @ts-ignore
    if (this.value in COLOURS) {background = COLOURS[this.value]}
    this.ref.style.backgroundColor = background[0]
    this.ref.style.color = background[1]
  }
  /**
   * @param {{ x: number; y: number; }} pos
   */
  updatePos(pos) {
    this.pos = pos
  }
}

class Board {
  /**
   * @param {number} size
   * @param {string} id
   */
  constructor(size, id) {
    this.size = size
    this.id = id
    this.element = document.getElementById(id)
    // @ts-ignore
    this.element.replaceChildren();
    // @ts-ignore
    this.element.style.setProperty("--gridSize", size);
    this.cells = []
    /**
     * @type {{ x: number; y: number; }[]}
     */
    this.animating = []
    this.moved = false
    this.score = 0
    for (let y = 0; y < this.size; y++) {
      let tmp = []
      for (let x = 0; x < this.size; x++) {
        let cont = document.createElement("div");
        cont.className = "cellCont";
        // @ts-ignore
        this.element.appendChild(cont);
        let cellB = document.createElement("div");
        cellB.className = "cell";
        cont.appendChild(cellB)
        let cell = document.createElement("div");
        cell.className = "cell";
        cont.appendChild(cell)
        tmp.push(new Cell({x:x, y:y}, cell))
      }
      this.cells.push(tmp)
    }
    this.addBlock()
    this.addBlock()
    this.forceUpdate()
    this.updateScore()
  }
  reinit() {
    // @ts-ignore
    this.element.replaceChildren();
    // @ts-ignore
    document.getElementById("gameover").classList.remove("visible");
    this.cells = []
    this.animating = []
    this.moved = false
    this.score = 0
    for (let y = 0; y < this.size; y++) {
      let tmp = []
      for (let x = 0; x < this.size; x++) {
        let cont = document.createElement("div");
        cont.className = "cellCont";
        // @ts-ignore
        this.element.appendChild(cont);
        let cellB = document.createElement("div");
        cellB.className = "cell";
        cont.appendChild(cellB)
        let cell = document.createElement("div");
        cell.className = "cell";
        cont.appendChild(cell)
        tmp.push(new Cell({x:x, y:y}, cell))
      }
      this.cells.push(tmp)
    }
    this.addBlock()
    this.addBlock()
    this.forceUpdate()
    this.updateScore()
  }
  /**
   * @param {number[][]} board
   */
  loadBoard(board) {
    this.reinit()
    this.forceUpdate()
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.at({x:x, y:y}).value = board[y][x]
        this.at({x:x, y:y}).update()
      }
    }
  }
  isDead() {
    let x, y, s, o;
    for (let i = 0; i < this.size*this.size; i++) {
      x = i%4
      y = Math.floor(i/4)
      if ((x+y)%2 == 1) {continue}
      s = this.at({x:x, y:y})
      if (s.value < 1) {return false}
      for (let j = 0; j < AROUND.length; j++) {
        if (x+AROUND[j].x < 0 || x+AROUND[j].x >= this.size || y+AROUND[j].y < 0 || y+AROUND[j].y >= this.size) {continue}
        o = this.at({x:x+AROUND[j].x, y:y+AROUND[j].y})
        if (o.value == s.value) {return false}
        if (o.value < 1) {return false}
      }
    }
    return true
  }
  /**
   * @param {{ x: number; y: number; }} pos
   */
  at(pos) {
    return this.cells[pos.y][pos.x]
  }
  /**
   * @param {{ x: number; y: number; }} a
   * @param {{ x: number; y: number; }} b
   */
  swap(a, b) {
    const ca = this.cells[a.y][a.x];
    const cb = this.cells[b.y][b.x];
    [ca.ref, cb.ref] = [cb.ref, ca.ref];
    [this.cells[a.y][a.x], this.cells[b.y][b.x]] = [this.cells[b.y][b.x], this.cells[a.y][a.x]]
  }
  /**
   * @param {{ x: number; y: number; }} dir
   */
  move(dir) {
    this.forceUpdate()
    if (this.isDead()) {return}
    this.moved = false
    let x;
    let y;
    for (let lat = 0; lat < this.size; lat++) {
      for (let lon = 1; lon < this.size; lon++) {
        for (let step = 0; step < lon; step++) {
          switch (dir.x) {
            case (0): x = lat; break
            case (1): x = this.size-1-lon+step; break
            case (-1): x = lon-step;  break
            default: x = 1
          }
          switch (dir.y) {
            case (0): y = lat; break
            case (1): y = this.size-1-lon+step; break
            case (-1): y = lon-step;  break
            default: y = 1
          }
          let startPos = {x:x, y:y}
          let start = this.at(startPos)
          if (start.value == 0) {if (step == 0) {break} else {continue}}
          let endPos = {x:x+dir.x, y:y+dir.y}
          let end = this.at(endPos)
          if (end.value == 0) {
            this.swap(startPos, endPos)
            this.moved = true
          }
          if (end.value < 0) {
            end.value -= 1
            this.swap(startPos, endPos)
            this.moved = true
          }
          else if (start.value == end.value) {
            end.value = -1
            start.value *= 2
            this.score += start.value
            this.swap(startPos, endPos)
            this.moved = true
            break
          }
        }
      }
    }
    this.update(dir)
  }
  /**
   * @param {{ x: number; y: number; }} dir
   */
  update(dir) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let cell = this.at({x:x, y:y})
        if (cell.value < 0) {this.animate(cell.pos, {x:x+(-dir.x*cell.value), y:y+(-dir.y*cell.value)})}
        else if ((cell.pos.x != x || cell.pos.y != y) && cell.value != 0){
          this.animate(cell.pos, {x:x, y:y})
        }
        else if (cell.value == 0) {
          cell.updatePos({x:x, y:y})
        }
      }
    }
  }
  clearAnimating() {
    if (this.animating.length > 0) {
      for (let i = 0; i < this.animating.length; i++) {
        let a = this.animating[i]
        let cell = this.at(a).ref
        this.at(a).updatePos(a)
        this.at(a).update()
        cell.style.transition = "none";
        cell.style.transform = "";
        cell.style.zIndex = "";
      }
      this.animating = []
      if (this.moved) {
        this.addBlock()
        this.moved = false
        localStorage.setItem("boardBackup", JSON.stringify(this.toJSON()))
        localStorage.setItem("score", this.score.toString())
      }
    }
  }
  forceUpdate() {
    this.clearAnimating()
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        this.at({x:x, y:y}).updatePos({x:x, y:y})
        this.at({x:x, y:y}).update()
      }
    }
  }
  /**
   * @param {{ x: number; y: number; }} a
   * @param {{ x: number; y: number; }} b
   */
  animate(a, b) {
    const cellA = this.at(a).ref
    const cellB = this.at(b).ref
    const start = cellA.getBoundingClientRect();
    const end = cellB.getBoundingClientRect();

    const dx = end.left - start.left;
    const dy = end.top - start.top;

    cellA.style.transition = "transform 100ms ease";
    cellA.style.transform = `translate(${dx}px, ${dy}px)`;
    cellA.style.zIndex = "999";
    this.animating.push(a)

    cellA.ontransitionend = () => {
      this.forceUpdate()
    };
  }
  addBlock() {
    let clear = []
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.at({x:x, y:y}).value == 0) {clear.push({x:x, y:y})}
      }
    }
    if (clear.length == 0) {return}
    let b = this.at(clear[Math.floor(Math.random()*clear.length)])
    if (Math.random() >= 0.8) { b.value = 4 }
    else { b.value = 2 }
  }
  /**
   * @param {number | null} hiscore
   */
  updateScore(hiscore=null) {
    // @ts-ignore
    document.getElementById("score").innerHTML = this.score
    if (hiscore != null) {
      if (this.score > hiscore) {hiscore = this.score}
      localStorage.setItem("highScore", hiscore.toString());
      // @ts-ignore
      document.getElementById("hiscore").innerHTML = hiscore
    }
    else {return 0}
    return hiscore
  }
  toJSON() {
    let out = [];
    let sub;
    for (let y = 0; y < this.size; y++) {
      sub = [];
      for (let x = 0; x < this.size; x++) {
        sub.push(Math.max(0, this.at({x:x, y:y}).value))
      }
      out.push(sub)
    }
    return out
  }
}

let board = new Board(4, "grid")
let boardbackuptxt = localStorage.getItem("boardBackup");
if (!(boardbackuptxt == "boardBackup" || boardbackuptxt == null)) {
  board.loadBoard(JSON.parse(boardbackuptxt))
}
let scorebackuptxt = localStorage.getItem("score");
if (!(scorebackuptxt == "score" || scorebackuptxt == null)) {
  board.score = parseInt(scorebackuptxt)
}

/**
 * @type {{ x: number; y: number; }}
*/
let dragStart;
/**
 * @type {{ x: number; y: number; }}
*/
let dragEnd;

/**
 * @type {number}
*/
let hiscore;

/**
 * @type {boolean}
*/
let instruct = false;

function newBoard() {
  board.reinit()
  localStorage.setItem("boardBackup", JSON.stringify(board.toJSON()))
  localStorage.setItem("score", "0")
}

function instructions() {
  if (board.isDead()) {return}
  if (!instruct) {
    // @ts-ignore
    document.getElementById("instructions").classList.add("visible");
    instruct = true;
  }
  else {
    // @ts-ignore
    document.getElementById("instructions").classList.remove("visible");
    instruct = false;
  }
}

window.onload = function(){
  let hiscoretxt = localStorage.getItem("highScore");
  if (hiscoretxt == "highScore" || hiscoretxt == null) {
    hiscore = 0;
    localStorage.setItem("highScore", "0");
  }
  else {
    hiscore = parseInt(hiscoretxt)
    hiscore = board.updateScore(hiscore)
  }
  // @ts-ignore
  document.getElementById("gameover").style.display = "block";
  // @ts-ignore
  document.getElementById("instructions").style.display = "block";
  document.addEventListener("keydown", function(event){
    if (instruct) {return}
    if (event.key == "ArrowUp" || event.key == "w" || event.key == "W") {
      board.move({x: 0, y:-1})
    }
    if (event.key == "ArrowDown" || event.key == "s" || event.key == "S") {
      board.move({x: 0, y:1})
    }
    if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") {
      board.move({x: -1, y:0})
    }
    if (event.key == "ArrowRight" || event.key == "d" || event.key == "D") {
      board.move({x: 1, y:0})
    }
    hiscore = board.updateScore(hiscore)
    if (board.isDead()) {
      // @ts-ignore
      document.getElementById("gameover").classList.add("visible");
      localStorage.removeItem("boardBackup")
    }
  })
}

window.addEventListener("touchstart", e => {
  dragStart = {x: e.touches[0].clientX, y: e.touches[0].clientY}
})

window.addEventListener("touchmove", e => {
  dragEnd = {x: e.touches[0].clientX, y: e.touches[0].clientY}
})

window.addEventListener("touchend", e => {
  if (instruct) {return}
  let diff = {x: dragEnd.x - dragStart.x, y: dragEnd.y - dragStart.y}
  if (Math.abs(diff.x) > Math.abs(diff.y)) {
    if (diff.x < 0) {
      board.move({x: -1, y:0})
    } else {
      board.move({x: 1, y:0})
    }  
  } else {
    if (diff.y < 0) {
      board.move({x: 0, y:-1})
    } else { 
      board.move({x: 0, y:1})
    }  
  }
  hiscore = board.updateScore(hiscore)
  if (board.isDead()) {
    // @ts-ignore
    document.getElementById("gameover").classList.add("visible");
    localStorage.removeItem("boardBackup")
  }
})
