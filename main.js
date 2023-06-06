var score = 0
var mash = 0
var highscore = ""
var xDown = null;
var yDown = null;
function getTouches(evt) {
  return evt.touches || evt.originalEvent.touches;
}
function handleTouchStart(evt) {
  const firstTouch = getTouches(evt)[0]
  xDown = firstTouch.clientX
  yDown = firstTouch.clientY
}
function handleTouchMove(evt) {
  if ( ! xDown || ! yDown ) {
    return;
}
var xUp = evt.touches[0].clientX;
var yUp = evt.touches[0].clientY;
var xDiff = xDown - xUp;
var yDiff = yDown - yUp;
if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
  if ( xDiff > 0 ) {
    movestat(2,false)
  } else {
    movestat(4,false)
  }
} else {
  if ( yDiff > 0 ) {
    movestat(3,false)
  } else {
    movestat(1,false)
  }
}
xDown = null;
yDown = null;
};
function getHighScore() {
  if ((document.cookie).includes("highscore=")) {
    e = 0
    wr = false
    highscore = ""
    while (e < ((document.cookie).length)+1) {
      if (wr) {
        highscore += (document.cookie)[e]
      }
      if ((document.cookie)[e] == ";") {
        wr = false
        e = (document.cookie).length-1
      }
      if ((document.cookie)[e] == "=") {
        wr = true
      }
      e ++
    }
    highscore = parseInt(highscore)
    document.getElementById("highscore").innerHTML = "High Score: "+highscore
    document.cookie = "highscore="+highscore+"; expires="+new Date(Date.now() + 9999999999).toUTCString()
  }
  else {
    highscore = 0
    document.cookie = "highscore=0; expires="+new Date(Date.now() + 9999999999).toUTCString()
    document.getElementById("highscore").innerHTML = "High Score: "+highscore
  }
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function addBlock(data, x, y) {
  document.getElementById("block_"+y+x).innerHTML = data
}
function addRandBlock(data) {
  x = getRndInteger(0,3)+""+getRndInteger(0,3)
  if (document.getElementById("block_"+x).innerHTML == "&nbsp;") {
    addBlock(data, x[1], x[0])
  }
  else {
    addRandBlock(data)
  }
}
function RNGBlock() {
  if (getRndInteger(1,10) == 1) {
    addRandBlock(4)
  }
  else {
    addRandBlock(2)
  }
}
function moveBlock(bx, by, x, y, c) {
  to = document.getElementById("block_"+by+bx).innerHTML
  if (to == "&nbsp;") {
    return
  }
  if (y == 0) {
    if (x > 0) {
      tx = bx
      r = true
      while (r) {
        tx ++
        if (tx > 3) {
          if (tx-1 == bx) {
            return
          }
          tx --
          document.getElementById("block_"+by+tx).innerHTML = to
          document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
          r = false
        }
        else if (!(document.getElementById("block_"+by+tx).innerHTML == "&nbsp;")) {
          if (document.getElementById("block_"+by+tx).innerHTML == to) {
            document.getElementById("block_"+by+tx).innerHTML = parseInt(to)*2
            if (!c) {
              score += parseInt(to)*2
            }
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            moveBlock(tx, by, x, y, c)
            r = false
          }
          else {
            if (tx-1 == bx) {
              return
            }
            tx --
            document.getElementById("block_"+by+tx).innerHTML = to
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            r = false
          }
        }
      }
    }
    else if (x < 0) {
      tx = bx
      r = true
      while (r) {
        tx --
        if (tx < 0) {
          if (tx+1 == bx) {
            return
          }
          tx ++
          document.getElementById("block_"+by+tx).innerHTML = to
          document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
          r = false
        }
        else if (!(document.getElementById("block_"+by+tx).innerHTML == "&nbsp;")) {
          if (document.getElementById("block_"+by+tx).innerHTML == to) {
            document.getElementById("block_"+by+tx).innerHTML = parseInt(to)*2
            if (!c) {
              score += parseInt(to)*2
            }
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            moveBlock(tx, by, x, y, c)
            r = false
          }
          else {
            if (tx+1 == bx) {
              return
            }
            tx ++
            document.getElementById("block_"+by+tx).innerHTML = to
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            r = false
          }
        }
      }
    }
  }
  else {
    if (y > 0) {
      ty = by
      r = true
      while (r) {
        ty ++
        if (ty > 3) {
          if (ty-1 == by) {
            return
          }
          ty --
          document.getElementById("block_"+ty+bx).innerHTML = to
          document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
          r = false
        }
        else if (!(document.getElementById("block_"+ty+bx).innerHTML == "&nbsp;")) {
          if (document.getElementById("block_"+ty+bx).innerHTML == to) {
            document.getElementById("block_"+ty+bx).innerHTML = parseInt(to)*2
            if (!c) {
              score += parseInt(to)*2
            }
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            moveBlock(bx, ty, x, y, c)
            r = false
          }
          else {
            if (ty-1 == by) {
              return
            }
            ty --
            document.getElementById("block_"+ty+bx).innerHTML = to
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            r = false
          }
        }
      }
    }
    else if (y < 0) {
      ty = by
      r = true
      while (r) {
        ty --
        if (ty < 0) {
          if (ty+1 == by) {
            return
          }
          ty ++
          document.getElementById("block_"+ty+bx).innerHTML = to
          if (!(ty == by)) {
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
          }
          r = false
        }
        else if (!(document.getElementById("block_"+ty+bx).innerHTML == "&nbsp;")) {
          if (document.getElementById("block_"+ty+bx).innerHTML == to) {
            document.getElementById("block_"+ty+bx).innerHTML = parseInt(to)*2
            if (!c) {
              score += parseInt(to)*2
            }
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            moveBlock(bx, ty, x, y, c)
            r = false
          }
          else {
            if (ty+1 == by) {
              return
            }
            ty ++
            document.getElementById("block_"+ty+bx).innerHTML = to
            document.getElementById("block_"+by+bx).innerHTML = "&nbsp;"
            r = false
          }
        }
      }
    }
  }
}
function settmp() {
  i = 0
  while (i < 4) {
    i2 = 0
    while (i2 < 4) {
      document.getElementById("tmp_"+i+i2).innerHTML = document.getElementById("block_"+i+i2).innerHTML
      i2++
    }
    i++
  }
}
function comparetmp() {
  same = true
  i = 0
  while (i < 4) {
    i2 = 0
    while (i2 < 4) {
      if (!(document.getElementById("tmp_"+i+i2).innerHTML == document.getElementById("block_"+i+i2).innerHTML)) {
        same = false
        return same
      }
      i2++
    }
    i++
  }
  return same
}
function setwft() {
  i = 0
  while (i < 4) {
    i2 = 0
    while (i2 < 4) {
      document.getElementById("block_"+i+i2).innerHTML = document.getElementById("tmp_"+i+i2).innerHTML
      i2++
    }
    i++
  }
}
function checkded() {
  settmp()
  movestat(1, true)
  if (comparetmp()) {
    movestat(2, true)
    if (comparetmp()) {
      movestat(3, true)
      if (comparetmp()) {
        movestat(4, true)
        if (comparetmp()) {
          return true;
        }
      }
    }
  }
  setwft()
  return false;
}
function updatecolor() {
  i = 0
  while (i < 4) {
    i2 = 0
    while (i2 < 4) {
      if (parseInt(document.getElementById("block_"+i+i2).innerHTML) != "NaN") {
        if (parseInt(document.getElementById("block_"+i+i2).innerHTML) > 4) {
          document.getElementById("block_"+i+i2).style.color = "#f9f6f2"
        }
        else {
          document.getElementById("block_"+i+i2).style.color = "#776e65"
        }
      }
      if (document.getElementById("block_"+i+i2).innerHTML == "&nbsp;") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#cdc1b4"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "2") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#eee4da"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "4") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#eee1c9"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "8") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#f3b27a"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "16") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#f59563"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "32") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#f77c5f"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "64") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#f65e3b"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "128") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#edd073"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "256") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#edcc62"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "512") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#edc950"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "1024") {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#edc53f"
      }
      else if (document.getElementById("block_"+i+i2).innerHTML == "2048"){
        document.getElementById("block_"+i+i2).style.backgroundColor = "#edc22e"
      }
      else {
        document.getElementById("block_"+i+i2).style.backgroundColor = "#ebb914"
      }
      i2++
    }
    i++
  }
  document.getElementById("score").innerHTML = "Score: "+score
  if (score > highscore) {
    highscore = score
    document.cookie = "highscore="+score+"; expires="+new Date(Date.now() + 9999999999).toUTCString()
  }
  document.getElementById("highscore").innerHTML = "High Score: "+highscore
}
function movestat(dir, c) {
  if (!c) {
    settmp()
  }
  if (dir == 1) {
    j = 0
    while (j < 4) {
      j2 = 0
      while (j2 < 4) {
        moveBlock(j2, j, 0, -1, c)
        j2++
      }
      j++
    }
  }
  else if (dir == 2) {
    j = 0
    while (j < 4) {
      j2 = 0
      while (j2 < 4) {
        moveBlock(3-j, j2, 1, 0, c)
        j2++
      }
      j++
    }
  }
  else if (dir == 3) {
    j = 0
      while (j < 4) {
        j2 = 0
        while (j2 < 4) {
          moveBlock(j2, 3-j, 0, 1, c)
          j2++
        }
        j++
      }
  }
  else if (dir == 4) {
    j = 0
      while (j < 4) {
        j2 = 0
        while (j2 < 4) {
          moveBlock(j, j2, -1, 0, c)
          j2++
        }
        j++
      }
  }
  if (!c) {
    if (!comparetmp()) {
      RNGBlock()
    }
    updatecolor()
    if (checkded()) {
      alert("You Died")
      window.location.reload()
    }
  }
}
window.onload = function(){
  getHighScore()
  RNGBlock()
  RNGBlock()
  updatecolor()
  document.addEventListener("keydown", function(event){
    if (event.key == "ArrowUp") {
      movestat(1, false)
    }
    if (event.key == "ArrowDown") {
      movestat(3, false)
    }
    if (event.key == "ArrowLeft") {
      movestat(4, false)
    }
    if (event.key == "ArrowRight") {
      movestat(2, false)
    }
  })
}