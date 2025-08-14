const tasks = [
  'Post a Dobby meme',
  'Post a Dobby art',
  'Spend 30 min in Discord',
  'Post Sentient content',
  'Comment on 5 posts',
  'Share a crypto fact on X',
  'Create 1 short video',
  'Invite 1 new person',
  'Learn 1 thing & post',
  'Write a short thread',
]

const colors = [
  '#ff4757',
  '#ffa502',
  '#2ed573',
  '#1e90ff',
  '#9b59b6',
  '#e67e22',
  '#f1c40f',
  '#00b894',
  '#d35400',
  '#6c5ce7',
]

const spinGroup = document.getElementById('spinGroup')
const usernameInput = document.getElementById('username')
const resultEl = document.getElementById('result')
const spinBtn = document.getElementById('spinBtn')

const R = 260
const R_TEXT = 200
const R_TEXT2 = 178
let isSpinning = false

const toRad = (deg) => ((deg - 90) * Math.PI) / 180
const polar = (r, angDeg) => {
  const a = toRad(angDeg)
  return { x: r * Math.cos(a), y: r * Math.sin(a) }
}
const arcPath = (r, a0, a1) => {
  const p0 = polar(r, a0),
    p1 = polar(r, a1)
  const large = (a1 - a0) % 360 > 180 ? 1 : 0
  return `M ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`
}
const wedgePath = (r, a0, a1) => {
  const p0 = polar(r, a0),
    p1 = polar(r, a1)
  const large = (a1 - a0) % 360 > 180 ? 1 : 0
  return `M 0 0 L ${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y} Z`
}
const splitTwoLines = (text, maxCharsPerLine) => {
  const words = text.split(' ')
  let l1 = '',
    l2 = ''
  for (const w of words) {
    if ((l1 + (l1 ? ' ' : '') + w).length <= maxCharsPerLine)
      l1 += (l1 ? ' ' : '') + w
    else l2 += (l2 ? ' ' : '') + w
  }
  if (!l1) {
    l1 = text
    l2 = ''
  }
  return [l1, l2]
}

function buildWheel() {
  spinGroup.innerHTML = ''
  const n = tasks.length,
    seg = 360 / n

  for (let i = 0; i < n; i++) {
    const a0 = i * seg,
      a1 = (i + 1) * seg

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', wedgePath(R, a0, a1))
    path.setAttribute('fill', colors[i % colors.length])
    path.setAttribute('class', 'sliceStroke')
    spinGroup.appendChild(path)

    const pad = Math.min(4, seg * 0.06)
    const arcId1 = `tp_${i}_1`,
      arcId2 = `tp_${i}_2`

    const arc1 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    arc1.setAttribute('id', arcId1)
    arc1.setAttribute('d', arcPath(R_TEXT, a0 + pad, a1 - pad))
    arc1.setAttribute('fill', 'none')
    spinGroup.appendChild(arc1)

    const arc2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    arc2.setAttribute('id', arcId2)
    arc2.setAttribute('d', arcPath(R_TEXT2, a0 + pad, a1 - pad))
    arc2.setAttribute('fill', 'none')
    spinGroup.appendChild(arc2)

    const theta = (Math.PI * 2) / n
    const L1 = R_TEXT * theta * 0.92
    const base = 16,
      min = 11,
      estCharW = 0.62
    let fs = Math.min(base, Math.floor(L1 / (estCharW * tasks[i].length)))
    if (fs < min) fs = min

    const maxChars = Math.floor(L1 / (estCharW * fs))
    const [line1, line2] = splitTwoLines(tasks[i], Math.max(8, maxChars))

    const text1 = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text1.setAttribute('class', 'label')
    text1.setAttribute('font-size', fs)
    const tpath1 = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'textPath'
    )
    tpath1.setAttribute('href', `#${arcId1}`)
    tpath1.setAttribute('startOffset', '50%')
    tpath1.setAttribute('text-anchor', 'middle')
    tpath1.textContent = line1
    text1.appendChild(tpath1)
    spinGroup.appendChild(text1)

    if (line2) {
      const text2 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text'
      )
      text2.setAttribute('class', 'label')
      text2.setAttribute('font-size', Math.max(min, fs - 1))
      const tpath2 = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'textPath'
      )
      tpath2.setAttribute('href', `#${arcId2}`)
      tpath2.setAttribute('startOffset', '50%')
      tpath2.setAttribute('text-anchor', 'middle')
      tpath2.textContent = line2
      text2.appendChild(tpath2)
      spinGroup.appendChild(text2)
    }
  }

  spinGroup.style.transition = 'none'
  spinGroup.style.transform = 'rotate(0deg)'
}

function spinWheel() {
  if (isSpinning) return

  const username = usernameInput.value.trim()
  if (!username) {
    alert('Please enter your Discord username!')
    usernameInput.focus()
    return
  }

  isSpinning = true
  spinBtn.disabled = true
  resultEl.innerHTML = ''

  const randomDegree = Math.floor(Math.random() * 360) + 720

  requestAnimationFrame(() => {
    spinGroup.style.transition = 'transform 3.2s cubic-bezier(.07,.82,.22,1)'
    spinGroup.style.transform = `rotate(${randomDegree}deg)`
  })

  setTimeout(() => {
    const seg = 360 / tasks.length
    const finalDeg = randomDegree % 360
    const fromTop = (360 - finalDeg + seg / 2) % 360
    const index = Math.floor(fromTop / seg) % tasks.length

    const prize = tasks[index]
    const color = colors[index % colors.length]

    resultEl.innerHTML = `
      <div class="pill" style="background:${color}">
        <strong>@${username}</strong><br/>
        🎯 Task: <span style="font-weight:500">${prize}</span>
      </div>
    `
    isSpinning = false
    spinBtn.disabled = false
  }, 3250)
}

buildWheel()
window.addEventListener('resize', buildWheel)
spinBtn.addEventListener('click', spinWheel)
usernameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') spinWheel()
})
