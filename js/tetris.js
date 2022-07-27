window.onload = () => {
  const width = 12
  const height = 21
  const speed = 20

  let fills = {}
  const html = ['<table id="tetris">']

  for(let y = 0; y < height; y++) {
    html.push('<tr>')
    for(let x = 0; x < width; x++) {
      if(x == 0 || x == width - 1 || y == height - 1) {
        html.push('<td style="background-color: black"></td>')
        fills[x + y * width] = 'black'
      } else {
        html.push('<td></td>')
      }
    }
    html.push('</tr>')
  }
  html.push('</table>')

  html.push('<table id="next-block">')
  for(let y = 0; y < 4; y++) {
    html.push('<tr>')
    for(let x = 0; x < 4; x++) {
      html.push('<td></td>')
    }
  }
  document.getElementById('view').innerHTML = html.join('')

  const cells = document.getElementById('tetris').getElementsByTagName('td')
  let top = 2
  let top0 = top
  let left = Math.floor(width / 2)
  let left0 = left
  let w = width
  const blocks = [
    { color: 'cyan',    angles: [[-1, 1, 2],    [-w, w, w+w], [-2, -1, 1],  [-w-w, -w, w]] },
    { color: 'yellow',  angles: [[-w-1, -w, -1]] },
    { color: 'green',   angles: [[-w, 1-w, -1], [-w, 1, w+1], [1, w-1, w],  [-w-1, -1, w]] },
    { color: 'red',     angles: [[-w-1, -w, 1], [1-w, 1, w],  [-1, w, w+1], [-w, -1, w-1]] },
    { color: 'blue',    angles: [[-w-1, -1, 1], [-w, 1-w, w], [-1, 1, w+1], [-w, w-1, w]] },
    { color: 'orange',  angles: [[1-w, -1, 1],  [-w, w, w+1], [-1, 1, w-1], [-w-1, -w, w]] },
    { color: 'magenta', angles: [[-w, -1, 1],   [-w, 1, w],   [-1, 1, w],   [-w, -1, w]] }
  ]
  let  block = blocks[Math.floor(Math.random() * blocks.length)]
  let  angle = 0
  let angle0 = angle
  let parts0 = []
  let  score = 0
  let score0 = score
  let   keys = {}

  document.onkeydown = (e) => {
    // console.log(e.key)
    switch(e.key) {
      case  'ArrowLeft':     keys.left = true; break
      case 'ArrowRight':    keys.right = true; break
      case  'ArrowDown':     keys.down = true; break
      case          ' ':
        if(e.shiftKey) {
          keys.rotate_l = true;
        } else {
          keys.rotate_r = true;
        }
        break
    }
  }

  let tick = 0

  const move = () => {
    tick++
    left0 = left
    top0 = top
    angle0 = angle

    if(tick % speed == 0) {
      top++
    } else {
      if(keys.left) left--
      if(keys.right) left++
      if(keys.down) top++
      if(keys.rotate_r) angle++
      if(keys.rotate_l) angle--
    }
    keys = {}

    angle = (angle % block.angles.length + block.angles.length) % block.angles.length
    let parts = block.angles[angle]
    for(let i = -1; i < parts.length; i++) {
      let offset = parts[i] || 0

      if(fills[top * width + left + offset]) {
        if(tick % speed == 0) {
          for(let j = -1; j < parts0.length; j++) {
            let offset = parts0[j] || 0
            fills[top0 * width + left0 + offset] = block.color
          }

          if(score == score0) {
            for(let i in fills) {
              if(fills[i]) cells[i].style.backgroundColor = 'black'
            }
            return
          }

          let cleans = 0
          for(let y = height-2; y >= 0; y--) {
            let filled = true
            for(let x = 1; x < width-1; x++) {
              if(!fills[y * width + x]) {
                filled = false
                break
              }
            }

            if(filled) {
              for(let y2 = y; y2 >= 0; y2--) {
                for(let x = 1; x < width-1; x++) {
                  fills[y2*width + x] = fills[(y2-1)*width + x]
                }
              }
              y++
              cleans++
            }
          }
          if(cleans > 0) {
            score += Math.pow(10, cleans) * 10
            for(let y = height-2; y >= 0; y--) {
              for(let x = 1; x < width-1; x++) {
                let color = fills[y * width + x] || ''
                cells[y * width + x].style.backgroundColor = color
              }
            }
          }
          block = blocks[Math.floor(Math.random() * blocks.length)]
          left0 = left = Math.floor(width/2)
          top0 = top = 2
          angle0 = angle = 0
          parts0 = parts = block.angles[angle % block.angles.length]
          score0 = score
        } else {
          left = left0
          top = top0
          angle = angle0
          parts = parts0
        }
        break
      }
    }
    if(top != top0) score++
    for(let i = -1; i < parts0.length; i++) {
      let offset = parts0[i] || 0
      cells[top0 * width + left0 + offset].style.backgroundColor = ''
    }
    parts0 = parts
    for(let i = -1; i < parts0.length; i++) {
      let offset = parts0[i] || 0
      cells[top * width + left + offset].style.backgroundColor = block.color
    }
    let info = tick + '(' + left + ',' + top + ') score: ' + score
    document.getElementById('info').innerHTML = info
    setTimeout(move, 1000 / speed)
  }
  move()
}
