window.onload = () => {
  const width = 12
  const height = 21
  const speed = 20

  let fills = {}
  const html = ['<table>']

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
  document.getElementById('view').innerHTML = html.join('')
}
