/**
 * Clawd - A pixel art desktop pet for web pages
 * https://github.com/...
 * MIT License
 */
;(function(root) {
  'use strict'

  var VERSION = '1.0.0'

  var DEFAULT_LINES = {
    poke:  ['here', 'hey', '(nudge)', 'hi?', 'hmm?', '(wiggles)', 'sup', 'boop'],
    night: ['sleepy?', '(yawn)', 'zzz', 'shh', 'night owl'],
    busy:  ['busy...', 'one sec', '(typing)', 'working', 'hold on'],
    spam:  ['ok ok ok', 'stop poking', '(flops over)', 'im here!', '(afterimage)'],
    rare:  ['(hands you a tiny cookie)', 'secret line unlocked', '<3']
  }

  var DEFAULT_COLORS = {
    body: '#D97757',
    eyes: '#1F1512',
    bubbleBg: 'rgba(20,25,40,0.92)',
    bubbleText: 'rgba(255,255,255,0.92)',
    termBg: '#1a1d24',
    termBar: '#2b303b',
    termText: '#7ee787',
    termLine1: '#3fb950',
    termLine2: '#2ea043',
    laptopBody: '#59626E',
    laptopKeys: '#8B95A1'
  }

  var SVG_TEMPLATE = function(c) {
    return '<svg class="clawd-svg" viewBox="0 0 70 48" width="40" height="28" shape-rendering="crispEdges">' +
      '<g fill="' + c.body + '">' +
        '<rect x="10" y="4" width="50" height="30"/>' +
        '<rect class="clawd-arm-l" x="4" y="18" width="6" height="8"/>' +
        '<rect class="clawd-arm-r" x="60" y="18" width="6" height="8"/>' +
        '<rect x="15" y="34" width="4" height="9"/>' +
        '<rect x="23" y="34" width="4" height="9"/>' +
        '<rect x="43" y="34" width="4" height="9"/>' +
        '<rect x="51" y="34" width="4" height="9"/>' +
      '</g>' +
      '<g class="clawd-eyes-open" fill="' + c.eyes + '">' +
        '<rect x="20" y="11" width="4" height="10"/>' +
        '<rect x="46" y="11" width="4" height="10"/>' +
      '</g>' +
      '<g class="clawd-eyes-closed" fill="' + c.eyes + '">' +
        '<rect x="17" y="17" width="9" height="3"/>' +
        '<rect x="44" y="17" width="9" height="3"/>' +
      '</g>' +
      '<g class="clawd-eyes-x" fill="none" stroke="' + c.eyes + '" stroke-width="3">' +
        '<path d="M19 13 L26 20 M26 13 L19 20"/>' +
        '<path d="M44 13 L51 20 M51 13 L44 20"/>' +
      '</g>' +
      '<g class="clawd-laptop">' +
        '<rect x="8" y="26" width="54" height="14" fill="' + c.laptopBody + '"/>' +
        '<g fill="' + c.laptopKeys + '">' +
          '<rect x="11" y="28" width="4" height="3"/><rect x="17" y="28" width="4" height="3"/><rect x="23" y="28" width="4" height="3"/><rect x="29" y="28" width="4" height="3"/><rect x="35" y="28" width="4" height="3"/><rect x="41" y="28" width="4" height="3"/><rect x="47" y="28" width="4" height="3"/><rect x="53" y="28" width="4" height="3"/>' +
          '<rect x="13" y="33" width="4" height="3"/><rect x="19" y="33" width="4" height="3"/><rect x="25" y="33" width="4" height="3"/><rect x="31" y="33" width="4" height="3"/><rect x="37" y="33" width="4" height="3"/><rect x="43" y="33" width="4" height="3"/><rect x="49" y="33" width="4" height="3"/>' +
          '<rect x="24" y="37" width="22" height="2"/>' +
        '</g>' +
      '</g>' +
    '</svg>'
  }

  var CSS = function(c) {
    return '.clawd{position:fixed;z-index:9999;width:44px;height:44px;right:16px;bottom:80px;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none}' +
    '.clawd:active{cursor:grabbing}' +
    '.clawd-body{display:flex;align-items:center;justify-content:center;width:100%;height:100%;border-radius:50%;animation:clawd-breathe 3.6s ease-in-out infinite;transition:filter .4s}' +
    '.clawd.busy .clawd-body{animation:clawd-work .55s ease-in-out infinite}' +
    '.clawd.sleep .clawd-body{animation:clawd-breathe 4.8s ease-in-out infinite}' +
    '.clawd .clawd-svg{transition:transform .35s}' +
    '.clawd.peek-l .clawd-svg{transform:rotate(22deg)}' +
    '.clawd.peek-r .clawd-svg{transform:rotate(-22deg)}' +
    '.clawd.peek-l .clawd-bubble{left:82%}' +
    '.clawd.peek-r .clawd-bubble{left:18%}' +
    '.clawd.offline .clawd-body{filter:grayscale(1) opacity(0.55);animation:none;box-shadow:none}' +
    '.clawd-eyes-closed,.clawd-eyes-x,.clawd-laptop{display:none}' +
    '.clawd.busy .clawd-laptop{display:block}' +
    '.clawd-term{display:none;position:absolute;bottom:calc(100% + 5px);left:50%;transform:translateX(-50%);width:72px;background:' + c.termBg + ';border-radius:4px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.35)}' +
    '.clawd.busy .clawd-term{display:block}' +
    '.clawd.busy .clawd-bubble{display:none}' +
    '.clawd-term-bar{height:8px;background:' + c.termBar + ';display:flex;align-items:center;gap:2px;padding:0 4px}' +
    '.clawd-term-bar i{width:3px;height:3px;border-radius:50%;display:block}' +
    '.clawd-term-bar i:nth-child(1){background:#ff5f56}' +
    '.clawd-term-bar i:nth-child(2){background:#ffbd2e}' +
    '.clawd-term-bar i:nth-child(3){background:#27c93f}' +
    '.clawd-term-body{padding:3px 5px 5px}' +
    '.clawd-term-text{display:block;font-size:9px;line-height:1.3;color:' + c.termText + ';font-family:ui-monospace,monospace;word-break:break-all}' +
    '.clawd-term-line{height:3px;background:' + c.termLine1 + ';border-radius:1px;margin-top:3px;animation:clawd-term-grow 2s steps(5) infinite}' +
    '.clawd-term-line.l2{background:' + c.termLine2 + ';animation-delay:1s;animation-duration:2.6s}' +
    '@keyframes clawd-term-grow{0%{width:10%}60%{width:85%}100%{width:30%}}' +
    '.clawd.peek-l .clawd-term{left:82%}' +
    '.clawd.peek-r .clawd-term{left:18%}' +
    '.clawd.sleep .clawd-eyes-open{display:none}' +
    '.clawd.sleep .clawd-eyes-closed{display:block}' +
    '.clawd.offline .clawd-eyes-open{display:none}' +
    '.clawd.offline .clawd-eyes-x{display:block}' +
    '.clawd.busy .clawd-arm-l{animation:clawd-tap .3s steps(1) infinite}' +
    '.clawd.busy .clawd-arm-r{animation:clawd-tap .3s steps(1) .15s infinite}' +
    '@keyframes clawd-tap{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}' +
    '.clawd-bubble{position:absolute;bottom:calc(100% + 2px);left:50%;transform:translateX(-50%);background:' + c.bubbleBg + ';color:' + c.bubbleText + ';font-size:11px;padding:3px 9px;border-radius:10px;white-space:nowrap;opacity:0;transition:opacity .3s;pointer-events:none}' +
    '.clawd-bubble.show{opacity:1}' +
    '@keyframes clawd-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}' +
    '@keyframes clawd-work{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-3px) rotate(-5deg)}75%{transform:translateY(-3px) rotate(5deg)}}'
  }

  function merge(base, override) {
    var result = {}
    for (var k in base) result[k] = base[k]
    if (override) for (var k in override) result[k] = override[k]
    return result
  }

  function Clawd(opts) {
    opts = opts || {}
    this.lines = merge(DEFAULT_LINES, opts.lines)
    this.colors = merge(DEFAULT_COLORS, opts.colors)
    this.busyPhrases = opts.busyPhrases || ['$ coding...', '$ thinking...', '$ reading...', '$ writing...']
    this.state = 'idle'
    this._workTimer = null
    this._pokeUntil = 0
    this._lastPoke = 0
    this._pokeStreak = 0
    this._el = null
    this._bubble = null
    this._termText = null
    this._onStateChange = opts.onStateChange || null
    this._onPoke = opts.onPoke || null
    this._mounted = false
  }

  Clawd.prototype.mount = function(container) {
    if (this._mounted) return this
    this._mounted = true

    var style = document.createElement('style')
    style.textContent = CSS(this.colors)
    document.head.appendChild(style)

    var el = document.createElement('div')
    el.className = 'clawd sleep'
    el.innerHTML =
      '<div class="clawd-term">' +
        '<div class="clawd-term-bar"><i></i><i></i><i></i></div>' +
        '<div class="clawd-term-body">' +
          '<span class="clawd-term-text"></span>' +
          '<div class="clawd-term-line l1"></div>' +
          '<div class="clawd-term-line l2"></div>' +
        '</div>' +
      '</div>' +
      '<div class="clawd-bubble"></div>' +
      '<div class="clawd-body">' + SVG_TEMPLATE(this.colors) + '</div>'

    this._el = el
    this._bubble = el.querySelector('.clawd-bubble')
    this._termText = el.querySelector('.clawd-term-text')

    ;(container || document.body).appendChild(el)
    this._initDrag()
    this._restorePosition()
    this._render()
    return this
  }

  Clawd.prototype.busy = function() { this._setState('busy') }
  Clawd.prototype.idle = function() { this._setState('idle') }
  Clawd.prototype.offline = function() { this._setState('offline') }

  Clawd.prototype.say = function(text, duration) {
    var self = this
    this._setBubble(text)
    if (duration !== 0) {
      setTimeout(function() { self._setBubble(null) }, duration || 3000)
    }
  }

  Clawd.prototype.setLines = function(lines) {
    this.lines = merge(this.lines, lines)
  }

  Clawd.prototype._setState = function(state) {
    if (this.state === state) return
    this.state = state
    this._render()
    if (this._onStateChange) this._onStateChange(state)
  }

  Clawd.prototype._render = function() {
    if (!this._el || Date.now() < this._pokeUntil) return
    var el = this._el
    if (this._workTimer) { clearInterval(this._workTimer); this._workTimer = null }
    var peek = el.classList.contains('peek-l') ? ' peek-l' : el.classList.contains('peek-r') ? ' peek-r' : ''

    if (this.state === 'offline') {
      el.className = 'clawd offline' + peek
      this._setBubble('offline')
    } else if (this.state === 'busy') {
      el.className = 'clawd busy' + peek
      this._setBubble(null)
      var tt = this._termText
      var phrases = this.busyPhrases
      var pi = 0
      var self = this
      tt.textContent = phrases[0]
      this._workTimer = setInterval(function() {
        pi = (pi + 1) % phrases.length
        if (Date.now() >= self._pokeUntil) tt.textContent = phrases[pi]
      }, 2600)
    } else {
      el.className = 'clawd sleep' + peek
      this._setBubble('zzZ')
    }
  }

  Clawd.prototype._setBubble = function(text) {
    if (!this._bubble) return
    if (text) { this._bubble.textContent = text; this._bubble.classList.add('show') }
    else this._bubble.classList.remove('show')
  }

  Clawd.prototype._restorePosition = function() {
    try {
      var saved = JSON.parse(localStorage.getItem('clawd-pos'))
      if (saved && saved.x != null) {
        var maxX = saved.peek ? window.innerWidth : window.innerWidth - 60
        var minX = saved.peek ? -40 : 0
        this._el.style.left = Math.min(Math.max(saved.x, minX), maxX) + 'px'
        this._el.style.top = Math.min(Math.max(saved.y, 0), window.innerHeight - 60) + 'px'
        this._el.style.right = 'auto'; this._el.style.bottom = 'auto'
        if (saved.peek === 'l') this._el.classList.add('peek-l')
        if (saved.peek === 'r') this._el.classList.add('peek-r')
      }
    } catch (e) {}
  }

  Clawd.prototype._initDrag = function() {
    var el = this._el, self = this
    var dragging = false, moved = false, startX = 0, startY = 0, offX = 0, offY = 0
    var pressTimer = null, pressFired = false

    el.addEventListener('pointerdown', function(e) {
      dragging = true; moved = false; pressFired = false
      startX = e.clientX; startY = e.clientY
      var r = el.getBoundingClientRect()
      offX = e.clientX - r.left; offY = e.clientY - r.top
      el.setPointerCapture(e.pointerId)
      pressTimer = setTimeout(function() {
        pressFired = true; dragging = false
        try { el.releasePointerCapture(e.pointerId) } catch (ex) {}
        if (self._onLongPress) self._onLongPress()
      }, 650)
    })

    el.addEventListener('pointermove', function(e) {
      if (!dragging) return
      if (Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) > 6) moved = true
      if (!moved) return
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null }
      el.classList.remove('peek-l', 'peek-r')
      var x = Math.min(Math.max(e.clientX - offX, 4), window.innerWidth - el.offsetWidth - 4)
      var y = Math.min(Math.max(e.clientY - offY, 4), window.innerHeight - el.offsetHeight - 4)
      el.style.left = x + 'px'; el.style.top = y + 'px'
      el.style.right = 'auto'; el.style.bottom = 'auto'
    })

    el.addEventListener('pointerup', function(e) {
      if (pressTimer) { clearTimeout(pressTimer); pressTimer = null }
      if (pressFired) { pressFired = false; return }
      dragging = false
      if (moved) {
        var r = el.getBoundingClientRect()
        var x = r.left, peek = null
        if (r.left < 18) { x = -r.width * 0.45; peek = 'l'; el.classList.add('peek-l') }
        else if (r.right > window.innerWidth - 18) { x = window.innerWidth - r.width * 0.55; peek = 'r'; el.classList.add('peek-r') }
        el.style.left = x + 'px'
        try { localStorage.setItem('clawd-pos', JSON.stringify({ x: x, y: r.top, peek: peek })) } catch (ex) {}
      } else {
        self._handlePoke()
      }
    })
  }

  Clawd.prototype._handlePoke = function() {
    var now = Date.now()
    this._pokeStreak = (now - this._lastPoke < 4000) ? this._pokeStreak + 1 : 1
    this._lastPoke = now
    var hh = new Date().getHours()
    var pool
    if (this._pokeStreak >= 3) pool = this.lines.spam
    else if (this.state === 'busy') pool = this.lines.busy
    else if (hh >= 23 || hh < 5) pool = (this.lines.night || []).concat(this.lines.poke)
    else pool = (Math.random() < 0.06) ? this.lines.rare : this.lines.poke
    var line = pool[Math.floor(Math.random() * pool.length)]
    this._pokeUntil = now + 1800
    if (this.state === 'busy') this._termText.textContent = '$ ' + line
    else this._setBubble(line)
    var self = this
    setTimeout(function() { self._render() }, 1900)
    if (this._onPoke) this._onPoke(line, this._pokeStreak)
  }

  Clawd.prototype.destroy = function() {
    if (this._workTimer) clearInterval(this._workTimer)
    if (this._el && this._el.parentNode) this._el.parentNode.removeChild(this._el)
    this._mounted = false
  }

  Clawd.VERSION = VERSION

  if (typeof module !== 'undefined' && module.exports) module.exports = Clawd
  else root.Clawd = Clawd

})(typeof window !== 'undefined' ? window : this)
