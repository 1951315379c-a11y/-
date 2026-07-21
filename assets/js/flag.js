function initFlagCanvas() {
  const canvas = document.getElementById('flagCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let time = 0, animId = null;

  function resize() {
    const p = canvas.parentElement;
    canvas.width = p.offsetWidth;
    canvas.height = p.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createFlagTexture(w, h) {
    const c = document.createElement('canvas');
    c.width = Math.round(w);
    c.height = Math.round(h);
    const cx = c.getContext('2d');
    cx.fillStyle = '#DE2910';
    cx.fillRect(0, 0, c.width, c.height);

    function drawStar(cx2, cy, r, pts, rot) {
      cx.beginPath();
      for (let i = 0; i < pts * 2; i++) {
        const a = rot + (i * Math.PI) / pts - Math.PI / 2;
        const rad = i % 2 === 0 ? r : r * 0.4;
        const x = cx2 + Math.cos(a) * rad;
        const y = cy + Math.sin(a) * rad;
        if (i === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
      }
      cx.closePath();
      cx.fill();
    }

    const bx = c.width / 6, by = c.height / 4, br = c.width * 0.085;
    cx.fillStyle = '#FFDE00';
    drawStar(bx, by, br, 5, 0);

    const sr = c.width * 0.032;
    const smalls = [[c.width*0.30,c.height*0.10],[c.width*0.35,c.height*0.225],[c.width*0.35,c.height*0.375],[c.width*0.30,c.height*0.50]];
    smalls.forEach(function(p) {
      drawStar(p[0], p[1], sr, 5, Math.atan2(by-p[1], bx-p[0]) + Math.PI/2);
    });
    return c;
  }

  let texCanvas = null;
  function updateTexture() {
    const fw = Math.min(canvas.width * 0.75, 750);
    const fh = fw * 2 / 3;
    texCanvas = createFlagTexture(fw, fh);
  }
  updateTexture();
  window.addEventListener('resize', function() { updateTexture(); });

  function animate() {
    time += 0.02;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!texCanvas) { animId = requestAnimationFrame(animate); return; }

    const tW = texCanvas.width, tH = texCanvas.height;
    const ox = (canvas.width - tW) / 2;
    const oy = (canvas.height - tH) / 3;
    const slices = 50, sliceW = tW / slices;
    const waves = [];

    for (let i = 0; i <= slices; i++) {
      const nx = i / slices, wind = time * 2.5;
      const w1 = Math.sin(nx * Math.PI * 3.5 + wind) * 14;
      const w2 = Math.sin(nx * Math.PI * 1.8 + wind * 0.7 + 1.2) * 10;
      const w3 = Math.sin(nx * Math.PI * 6 + wind * 1.4 + 0.8) * 5;
      const w4 = Math.sin(nx * Math.PI * 0.8 + wind * 0.4 + 2.1) * 8;
      waves.push((w1 + w2 + w3 + w4) * (nx * nx));
    }

    for (let i = 0; i < slices; i++) {
      const off = waves[i];
      ctx.drawImage(texCanvas, i*sliceW, 0, sliceW+1, tH, ox+i*sliceW+off, oy+off*0.15, sliceW+1, tH);
    }

    const grad = ctx.createLinearGradient(ox, 0, ox+40, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0.35)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(ox, oy+waves[0]*0.15, 40, tH);

    animId = requestAnimationFrame(animate);
  }
  animate();
}