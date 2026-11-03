import base64
import os

# Read logo badge base64
logo_path = 'frontend/assets/logo-badge.png'
with open(logo_path, 'rb') as f:
    logo_b64 = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('utf-8')

html_content = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Convoy Radio - App Store Header & Search Results Studio</title>
  <style>
    :root {{
      --bg: #07090e;
      --card-bg: #0f1422;
      --border: #1e293b;
      --accent: #00f2fe;
      --accent-blue: #3b82f6;
      --accent-glow: rgba(0, 242, 254, 0.25);
      --text: #f8fafc;
      --text-muted: #94a3b8;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      padding: 32px 24px;
    }}
    .container {{
      max-width: 1400px;
      margin: 0 auto;
    }}
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }}
    .header-info h1 {{
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 40%, var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }}
    .header-info p {{
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.5;
    }}
    .header-actions {{
      display: flex;
      gap: 12px;
    }}
    .btn {{
      background: linear-gradient(135deg, #00f2fe, #3b82f6);
      color: #07090e;
      border: none;
      font-weight: 700;
      font-size: 14px;
      padding: 12px 24px;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 20px var(--accent-glow);
    }}
    .btn:hover {{
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(0, 242, 254, 0.4);
    }}
    .btn-secondary {{
      background: #1e293b;
      color: #fff;
      border: 1px solid #334155;
      box-shadow: none;
    }}
    .btn-secondary:hover {{
      background: #334155;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }}
    .config-panel {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }}
    .config-group {{
      display: flex;
      flex-direction: column;
      gap: 8px;
    }}
    .config-group label {{
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      font-weight: 700;
    }}
    .config-group input, .config-group select {{
      background: #0a0e17;
      border: 1px solid var(--border);
      border-radius: 8px;
      color: #fff;
      padding: 10px 14px;
      font-size: 14px;
      font-family: inherit;
    }}
    .config-group input:focus, .config-group select:focus {{
      outline: none;
      border-color: var(--accent);
    }}
    .dropzones {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }}
    .dropzone {{
      border: 2px dashed #2a374a;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      background: rgba(10, 14, 23, 0.6);
      transition: all 0.2s ease;
      font-size: 12px;
      color: var(--text-muted);
    }}
    .dropzone.dragover, .dropzone:hover {{
      border-color: var(--accent);
      background: rgba(0, 242, 254, 0.05);
      color: var(--text);
    }}
    .dropzone input {{
      display: none;
    }}
    .dropzone-status {{
      margin-top: 6px;
      font-size: 11px;
      color: var(--accent);
      font-weight: 600;
    }}
    .preview-section {{
      display: flex;
      flex-direction: column;
      gap: 32px;
    }}
    .asset-card {{
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }}
    .asset-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }}
    .asset-title-group h2 {{
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }}
    .asset-title-group p {{
      font-size: 13px;
      color: var(--text-muted);
      margin-top: 2px;
    }}
    .asset-badge {{
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 5px 12px;
      border-radius: 6px;
      background: rgba(0, 242, 254, 0.12);
      color: var(--accent);
      border: 1px solid rgba(0, 242, 254, 0.3);
    }}
    .canvas-wrapper {{
      width: 100%;
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #1e293b;
      position: relative;
    }}
    .canvas-wrapper canvas {{
      width: 100%;
      height: auto;
      display: block;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-info">
        <h1>Header & Search Results Studio</h1>
        <p>App Store Connect için pixel-perfect Product Page Header (3840x1646) ve Search Results (3840x2560) görsel üreticisi.</p>
      </div>
      <div class="header-actions">
        <button class="btn" id="btn-download-all">Download All Assets</button>
      </div>
    </div>

    <!-- Configuration Panel -->
    <div class="config-panel">
      <div class="config-group">
        <label>App Title</label>
        <input type="text" id="cfg-title" value="CONVOY RADIO">
        <label style="margin-top:8px;">Tagline</label>
        <input type="text" id="cfg-tagline" value="REAL-TIME WALKIE-TALKIE & LIVE CONVOY MAP">
      </div>

      <div class="config-group">
        <label>Feature Badges (Separated by |)</label>
        <input type="text" id="cfg-badges" value="ZERO LATENCY PTT | LIVE GPS RADAR | NO ACCOUNT REQUIRED">
        <label style="margin-top:8px;">Style Mode</label>
        <select id="cfg-style">
          <option value="dual-phone">Dual Phone Mockup Showcase (Recommended)</option>
          <option value="tactical-hud">Pure Tactical HUD & Waveform</option>
        </select>
      </div>

      <div class="config-group">
        <label>Phone Mockup Screens (Optional)</label>
        <div class="dropzones">
          <div class="dropzone" id="dropzone-p1">
            <span>Drop Phone 1 (Radio Screen)</span>
            <input type="file" id="file-p1" accept="image/*">
            <div class="dropzone-status" id="status-p1">Using Simulated UI</div>
          </div>
          <div class="dropzone" id="dropzone-p2">
            <span>Drop Phone 2 (Map Screen)</span>
            <input type="file" id="file-p2" accept="image/*">
            <div class="dropzone-status" id="status-p2">Using Simulated UI</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preview & Canvas Section -->
    <div class="preview-section">
      <!-- 1. Product Page Header -->
      <div class="asset-card">
        <div class="asset-header">
          <div class="asset-title-group">
            <h2>Product Page Header</h2>
            <p>App Store ürün sayfasının en üstünde yer alan 21:9 sinematik afiş.</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="asset-badge">3840 × 1646 • 21:9 PNG</span>
            <button class="btn btn-secondary" id="btn-dl-header">Download Header (3840x1646)</button>
          </div>
        </div>
        <div class="canvas-wrapper">
          <canvas id="canvas-header" width="3840" height="1646"></canvas>
        </div>
      </div>

      <!-- 2. Search Results Asset -->
      <div class="asset-card">
        <div class="asset-header">
          <div class="asset-title-group">
            <h2>Search Results Asset</h2>
            <p>App Store arama sonuçlarında uygulamanızın kartında görünen 3:2 vitrin görseli.</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="asset-badge">3840 × 2560 • 3:2 PNG</span>
            <button class="btn btn-secondary" id="btn-dl-search">Download Search Asset (3840x2560)</button>
          </div>
        </div>
        <div class="canvas-wrapper">
          <canvas id="canvas-search" width="3840" height="2560"></canvas>
        </div>
      </div>

      <!-- 3. Universal Master Asset -->
      <div class="asset-card">
        <div class="asset-header">
          <div class="asset-title-group">
            <h2>Universal Master Asset</h2>
            <p>Her iki alanı tek bir görselle doldurmak isteyenler için 16:9 master afiş.</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="asset-badge">5244 × 2950 • 16:9 PNG</span>
            <button class="btn btn-secondary" id="btn-dl-universal">Download Universal (5244x2950)</button>
          </div>
        </div>
        <div class="canvas-wrapper">
          <canvas id="canvas-universal" width="5244" height="2950"></canvas>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Embedded assets
    const LOGO_SRC = "{logo_b64}";
    const logoImg = new Image();
    logoImg.src = LOGO_SRC;

    let phone1Img = null;
    let phone2Img = null;

    // Elements
    const canvasHeader = document.getElementById('canvas-header');
    const canvasSearch = document.getElementById('canvas-search');
    const canvasUniversal = document.getElementById('canvas-universal');

    const cfgTitle = document.getElementById('cfg-title');
    const cfgTagline = document.getElementById('cfg-tagline');
    const cfgBadges = document.getElementById('cfg-badges');
    const cfgStyle = document.getElementById('cfg-style');

    const dropzoneP1 = document.getElementById('dropzone-p1');
    const dropzoneP2 = document.getElementById('dropzone-p2');
    const fileP1 = document.getElementById('file-p1');
    const fileP2 = document.getElementById('file-p2');
    const statusP1 = document.getElementById('status-p1');
    const statusP2 = document.getElementById('status-p2');

    // Events
    [cfgTitle, cfgTagline, cfgBadges, cfgStyle].forEach(el => {{
      el.addEventListener('input', redrawAll);
      el.addEventListener('change', redrawAll);
    }});

    function setupDropzone(dz, fileInput, statusEl, onLoaded) {{
      dz.addEventListener('click', () => fileInput.click());
      dz.addEventListener('dragover', (e) => {{
        e.preventDefault();
        dz.classList.add('dragover');
      }});
      dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
      dz.addEventListener('drop', (e) => {{
        e.preventDefault();
        dz.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {{
          loadFile(e.dataTransfer.files[0], statusEl, onLoaded);
        }}
      }});
      fileInput.addEventListener('change', (e) => {{
        if (e.target.files && e.target.files[0]) {{
          loadFile(e.target.files[0], statusEl, onLoaded);
        }}
      }});
    }}

    function loadFile(file, statusEl, onLoaded) {{
      const reader = new FileReader();
      reader.onload = (e) => {{
        const img = new Image();
        img.onload = () => {{
          statusEl.textContent = file.name;
          onLoaded(img);
          redrawAll();
        }};
        img.src = e.target.result;
      }};
      reader.readAsDataURL(file);
    }}

    setupDropzone(dropzoneP1, fileP1, statusP1, (img) => {{ phone1Img = img; }});
    setupDropzone(dropzoneP2, fileP2, statusP2, (img) => {{ phone2Img = img; }});

    logoImg.onload = () => {{
      redrawAll();
    }};

    function redrawAll() {{
      drawHeader(canvasHeader);
      drawSearch(canvasSearch);
      drawUniversal(canvasUniversal);
    }}

    // Draw Background Grid & Glows
    function drawCyberBackground(ctx, w, h) {{
      // Base solid background (STRICT NO ALPHA)
      ctx.fillStyle = '#06080e';
      ctx.fillRect(0, 0, w, h);

      // Deep radial gradients
      const gradCenter = ctx.createRadialGradient(w * 0.5, h * 0.45, 100, w * 0.5, h * 0.45, w * 0.7);
      gradCenter.addColorStop(0, 'rgba(0, 150, 255, 0.15)');
      gradCenter.addColorStop(0.5, 'rgba(0, 242, 254, 0.06)');
      gradCenter.addColorStop(1, 'rgba(6, 8, 14, 0)');
      ctx.fillStyle = gradCenter;
      ctx.fillRect(0, 0, w, h);

      const gradCyan = ctx.createRadialGradient(w * 0.2, h * 0.2, 50, w * 0.2, h * 0.2, w * 0.5);
      gradCyan.addColorStop(0, 'rgba(0, 242, 254, 0.12)');
      gradCyan.addColorStop(1, 'rgba(6, 8, 14, 0)');
      ctx.fillStyle = gradCyan;
      ctx.fillRect(0, 0, w, h);

      // Tactical grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 2;
      const gridSize = Math.round(w / 40);
      ctx.beginPath();
      for (let x = 0; x < w; x += gridSize) {{
        ctx.moveTo(x, 0); ctx.lineTo(x, h);
      }}
      for (let y = 0; y < h; y += gridSize) {{
        ctx.moveTo(0, y); ctx.lineTo(w, y);
      }}
      ctx.stroke();

      // Concentric Radar circles in center
      const cx = w * 0.5;
      const cy = h * 0.55;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
      ctx.lineWidth = 3;
      for (let r = 300; r < w * 0.6; r += 260) {{
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }}

      // Tactical telemetry text markers
      ctx.font = '700 24px monospace';
      ctx.fillStyle = 'rgba(0, 242, 254, 0.35)';
      ctx.fillText('LOC: 41.0082°N 28.9784°E // FREQ: CH-01 (446.006 MHz)', 60, 80);
      ctx.textAlign = 'right';
      ctx.fillText('ENCRYPTED TRANSIENT PTT // ZERO RETENTION', w - 60, 80);
      ctx.textAlign = 'left';
    }}

    // Draw Sleek Phone Mockup Frame
    function drawPhoneFrame(ctx, x, y, pw, ph, img, isLeft) {{
      ctx.save();
      ctx.translate(x, y);

      // Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 80;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 40;

      // Outer bezel (Titanium Dark)
      const radius = 64;
      ctx.fillStyle = '#161d2b';
      ctx.beginPath();
      ctx.roundRect(-pw/2, -ph/2, pw, ph, radius);
      ctx.fill();

      // Border highlight
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#2d3b52';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Inner screen border (OLED black border)
      const bezel = 22;
      const sw = pw - bezel * 2;
      const sh = ph - bezel * 2;
      ctx.fillStyle = '#0a0d14';
      ctx.beginPath();
      ctx.roundRect(-sw/2, -sh/2, sw, sh, radius - 10);
      ctx.fill();

      // Clip for screen content
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-sw/2, -sh/2, sw, sh, radius - 10);
      ctx.clip();

      if (img) {{
        ctx.drawImage(img, -sw/2, -sh/2, sw, sh);
      }} else {{
        // Simulated App Screen
        drawSimulatedScreen(ctx, sw, sh, isLeft);
      }}

      // Top Dynamic Island Notch
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(-75, -sh/2 + 18, 150, 44, 22);
      ctx.fill();

      ctx.restore(); // end clip

      // Screen glass sheen reflection
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(-sw/2, -sh/2, sw, sh, radius - 10);
      ctx.clip();
      const sheenGrad = ctx.createLinearGradient(-sw/2, -sh/2, sw/2, sh/2);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.02)');
      sheenGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(-sw/2, -sh/2, sw, sh);
      ctx.restore();

      ctx.restore(); // end translate
    }}

    // Simulated fallback UI if no screenshot uploaded
    function drawSimulatedScreen(ctx, w, h, isRadio) {{
      ctx.fillStyle = '#07090e';
      ctx.fillRect(-w/2, -h/2, w, h);

      if (isRadio) {{
        // Radio Screen Simulation
        ctx.fillStyle = '#0f1422';
        ctx.beginPath();
        ctx.roundRect(-w/2 + 30, -h/2 + 90, w - 60, 110, 20);
        ctx.fill();

        ctx.fillStyle = '#00f2fe';
        ctx.font = '800 28px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('CONVOY CHANNEL #01', 0, -h/2 + 145);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 20px -apple-system, sans-serif';
        ctx.fillText('4 DRIVERS ONLINE • COCKPIT READY', 0, -h/2 + 175);

        // Huge Glowing PTT Button
        const pttR = w * 0.32;
        const pttY = 80;
        const pttGrad = ctx.createRadialGradient(0, pttY, 20, 0, pttY, pttR);
        pttGrad.addColorStop(0, '#00f2fe');
        pttGrad.addColorStop(1, '#0072ff');

        ctx.shadowColor = 'rgba(0, 242, 254, 0.6)';
        ctx.shadowBlur = 60;
        ctx.fillStyle = pttGrad;
        ctx.beginPath();
        ctx.arc(0, pttY, pttR, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#07090e';
        ctx.font = '900 44px -apple-system, sans-serif';
        ctx.fillText('HOLD TO TALK', 0, pttY + 16);

        // Telemetry speed
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(-w/2 + 30, h/2 - 200, w - 60, 120, 20);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.font = '800 36px monospace';
        ctx.fillText('94 KM/H  •  CONVOY LEADER', 0, h/2 - 130);
      }} else {{
        // Map Screen Simulation
        ctx.fillStyle = '#09111e';
        ctx.fillRect(-w/2, -h/2, w, h);

        // Map roads grid
        ctx.strokeStyle = '#1e2d42';
        ctx.lineWidth = 14;
        ctx.beginPath();
        ctx.moveTo(-w/2, -100); ctx.lineTo(w/2, 200);
        ctx.moveTo(0, -h/2); ctx.lineTo(-80, h/2);
        ctx.stroke();

        // Glowing convoy route
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 8;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 30;
        ctx.beginPath();
        ctx.moveTo(-150, 250); ctx.lineTo(0, 50); ctx.lineTo(120, -180);
        ctx.stroke();
        ctx.shadowColor = 'transparent';

        // Vehicle markers
        [-150, 0, 120].forEach((vx, idx) => {{
          const vy = idx === 0 ? 250 : idx === 1 ? 50 : -180;
          ctx.fillStyle = '#00f2fe';
          ctx.beginPath();
          ctx.arc(vx, vy, 24, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(vx, vy, 12, 0, Math.PI * 2);
          ctx.fill();
        }});

        ctx.fillStyle = '#0f1422';
        ctx.beginPath();
        ctx.roundRect(-w/2 + 30, h/2 - 200, w - 60, 120, 20);
        ctx.fill();

        ctx.fillStyle = '#00f2fe';
        ctx.font = '800 30px -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LIVE CONVOY RADAR', 0, h/2 - 145);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 20px -apple-system, sans-serif';
        ctx.fillText('3 VEHICLES IN RANGE (250m - 1.2km)', 0, h/2 - 110);
      }}
    }}

    // Draw Badges Pill Bar
    function drawBadges(ctx, badgesText, cx, cy, badgeSize = 34) {{
      const badges = badgesText.split('|').map(s => s.trim()).filter(Boolean);
      ctx.font = `800 ${{badgeSize}}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;

      let totalWidth = 0;
      const paddings = 40;
      const gaps = 24;
      const badgeWidths = badges.map(b => ctx.measureText(b).width + paddings * 2);
      totalWidth = badgeWidths.reduce((acc, w) => acc + w, 0) + (badges.length - 1) * gaps;

      let startX = cx - totalWidth / 2;
      badges.forEach((b, i) => {{
        const bw = badgeWidths[i];
        const bh = badgeSize * 2.2;

        ctx.fillStyle = 'rgba(0, 242, 254, 0.1)';
        ctx.beginPath();
        ctx.roundRect(startX, cy - bh/2, bw, bh, bh/2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#00f2fe';
        ctx.textAlign = 'center';
        ctx.fillText(b, startX + bw/2, cy + badgeSize * 0.35);

        startX += bw + gaps;
      }});
    }}

    // Draw Audio Spectrum Visualizer
    function drawSpectrumWave(ctx, x, y, width, height) {{
      ctx.save();
      const count = 48;
      const barW = width / (count * 1.6);
      const gap = barW * 0.6;
      let startX = x - width / 2;

      for (let i = 0; i < count; i++) {{
        const progress = i / count;
        const wave = Math.sin(progress * Math.PI) * (0.35 + 0.65 * Math.sin(i * 0.7));
        const barH = Math.max(12, height * wave);

        const grad = ctx.createLinearGradient(0, y - barH/2, 0, y + barH/2);
        grad.addColorStop(0, '#00f2fe');
        grad.addColorStop(1, '#0066ff');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(startX, y - barH/2, barW, barH, barW/2);
        ctx.fill();

        startX += barW + gap;
      }}
      ctx.restore();
    }}

    // ==========================================
    // 1. PRODUCT PAGE HEADER (3840 x 1646)
    // ==========================================
    function drawHeader(canvas) {{
      const ctx = canvas.getContext('2d');
      const w = 3840;
      const h = 1646;

      drawCyberBackground(ctx, w, h);

      const title = cfgTitle.value || 'CONVOY RADIO';
      const tagline = cfgTagline.value || 'REAL-TIME WALKIE-TALKIE & LIVE CONVOY MAP';
      const badges = cfgBadges.value || '';
      const style = cfgStyle.value;

      if (style === 'dual-phone') {{
        // Left Side: Brand & Details, Right Side: Angled Phones
        const leftCenterX = w * 0.32;

        // Logo
        const logoSize = 240;
        if (logoImg.complete && logoImg.naturalWidth > 0) {{
          ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
          ctx.shadowBlur = 50;
          ctx.drawImage(logoImg, leftCenterX - logoSize/2, h * 0.22, logoSize, logoSize);
          ctx.shadowColor = 'transparent';
        }}

        // Title
        ctx.textAlign = 'center';
        ctx.font = '900 120px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        const titleGrad = ctx.createLinearGradient(0, 0, w * 0.6, 0);
        titleGrad.addColorStop(0, '#ffffff');
        titleGrad.addColorStop(1, '#00f2fe');
        ctx.fillStyle = titleGrad;
        ctx.fillText(title, leftCenterX, h * 0.50);

        // Tagline
        ctx.font = '700 48px -apple-system, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(tagline, leftCenterX, h * 0.58);

        // Spectrum Wave
        drawSpectrumWave(ctx, leftCenterX, h * 0.68, 800, 100);

        // Badges
        drawBadges(ctx, badges, leftCenterX, h * 0.82, 28);

        // Right Side: Phones
        const phoneW = 540;
        const phoneH = 1100;
        const p1X = w * 0.70;
        const p1Y = h * 0.54;
        const p2X = w * 0.86;
        const p2Y = h * 0.50;

        drawPhoneFrame(ctx, p1X, p1Y, phoneW, phoneH, phone1Img, true);
        drawPhoneFrame(ctx, p2X, p2Y, phoneW, phoneH, phone2Img, false);

      }} else {{
        // Centered Pure Tactical HUD
        const cx = w * 0.5;

        const logoSize = 320;
        if (logoImg.complete && logoImg.naturalWidth > 0) {{
          ctx.shadowColor = 'rgba(0, 242, 254, 0.6)';
          ctx.shadowBlur = 80;
          ctx.drawImage(logoImg, cx - logoSize/2, h * 0.16, logoSize, logoSize);
          ctx.shadowColor = 'transparent';
        }}

        ctx.textAlign = 'center';
        ctx.font = '900 140px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
        const titleGrad = ctx.createLinearGradient(0, 0, w, 0);
        titleGrad.addColorStop(0.3, '#ffffff');
        titleGrad.addColorStop(0.7, '#00f2fe');
        ctx.fillStyle = titleGrad;
        ctx.fillText(title, cx, h * 0.52);

        ctx.font = '700 54px -apple-system, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(tagline, cx, h * 0.62);

        drawSpectrumWave(ctx, cx, h * 0.74, 1200, 120);

        drawBadges(ctx, badges, cx, h * 0.86, 32);
      }}
    }}

    // ==========================================
    // 2. SEARCH RESULTS ASSET (3840 x 2560)
    // ==========================================
    function drawSearch(canvas) {{
      const ctx = canvas.getContext('2d');
      const w = 3840;
      const h = 2560;

      drawCyberBackground(ctx, w, h);

      const title = cfgTitle.value || 'CONVOY RADIO';
      const tagline = cfgTagline.value || 'REAL-TIME WALKIE-TALKIE & LIVE CONVOY MAP';
      const badges = cfgBadges.value || '';
      const style = cfgStyle.value;

      const cx = w * 0.5;

      // Header Brand Row
      const logoSize = 220;
      if (logoImg.complete && logoImg.naturalWidth > 0) {{
        ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
        ctx.shadowBlur = 60;
        ctx.drawImage(logoImg, cx - logoSize/2, 140, logoSize, logoSize);
        ctx.shadowColor = 'transparent';
      }}

      ctx.textAlign = 'center';
      ctx.font = '900 130px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      const titleGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.8, 0);
      titleGrad.addColorStop(0, '#ffffff');
      titleGrad.addColorStop(1, '#00f2fe');
      ctx.fillStyle = titleGrad;
      ctx.fillText(title, cx, 490);

      ctx.font = '700 52px -apple-system, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(tagline, cx, 580);

      if (style === 'dual-phone') {{
        // Center Dual Phones
        const phoneW = 740;
        const phoneH = 1520;
        const p1X = cx - 440;
        const p1Y = 1480;
        const p2X = cx + 440;
        const p2Y = 1480;

        drawPhoneFrame(ctx, p1X, p1Y, phoneW, phoneH, phone1Img, true);
        drawPhoneFrame(ctx, p2X, p2Y, phoneW, phoneH, phone2Img, false);

        // Bottom Badges
        drawBadges(ctx, badges, cx, h - 140, 36);

      }} else {{
        // Tactical Center Visual
        drawSpectrumWave(ctx, cx, 1100, 1800, 260);

        // Big Radar circle
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 6;
        ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
        ctx.shadowBlur = 60;
        ctx.beginPath();
        ctx.arc(cx, 1600, 360, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = '#00f2fe';
        ctx.font = '900 64px -apple-system, sans-serif';
        ctx.fillText('LIVE PTT COCKPIT', cx, 1620);

        drawBadges(ctx, badges, cx, 2260, 40);
      }}
    }}

    // ==========================================
    // 3. UNIVERSAL MASTER (5244 x 2950)
    // ==========================================
    function drawUniversal(canvas) {{
      const ctx = canvas.getContext('2d');
      const w = 5244;
      const h = 2950;

      drawCyberBackground(ctx, w, h);

      const title = cfgTitle.value || 'CONVOY RADIO';
      const tagline = cfgTagline.value || 'REAL-TIME WALKIE-TALKIE & LIVE CONVOY MAP';
      const badges = cfgBadges.value || '';
      const style = cfgStyle.value;

      const cx = w * 0.5;

      // Brand Top
      const logoSize = 300;
      if (logoImg.complete && logoImg.naturalWidth > 0) {{
        ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
        ctx.shadowBlur = 70;
        ctx.drawImage(logoImg, cx - logoSize/2, 180, logoSize, logoSize);
        ctx.shadowColor = 'transparent';
      }}

      ctx.textAlign = 'center';
      ctx.font = '900 160px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
      const titleGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.8, 0);
      titleGrad.addColorStop(0, '#ffffff');
      titleGrad.addColorStop(1, '#00f2fe');
      ctx.fillStyle = titleGrad;
      ctx.fillText(title, cx, 640);

      ctx.font = '700 64px -apple-system, sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(tagline, cx, 760);

      if (style === 'dual-phone') {{
        const phoneW = 900;
        const phoneH = 1840;
        const p1X = cx - 560;
        const p1Y = 1800;
        const p2X = cx + 560;
        const p2Y = 1800;

        drawPhoneFrame(ctx, p1X, p1Y, phoneW, phoneH, phone1Img, true);
        drawPhoneFrame(ctx, p2X, p2Y, phoneW, phoneH, phone2Img, false);

        drawBadges(ctx, badges, cx, h - 140, 42);
      }} else {{
        drawSpectrumWave(ctx, cx, 1300, 2400, 320);
        drawBadges(ctx, badges, cx, 2200, 50);
      }}
    }}

    // Downloader
    function downloadCanvas(canvas, filename) {{
      canvas.toBlob((blob) => {{
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }}, 'image/png');
    }}

    document.getElementById('btn-dl-header').addEventListener('click', () => {{
      downloadCanvas(canvasHeader, 'convoy-radio-product-page-header-3840x1646.png');
    }});

    document.getElementById('btn-dl-search').addEventListener('click', () => {{
      downloadCanvas(canvasSearch, 'convoy-radio-search-results-3840x2560.png');
    }});

    document.getElementById('btn-dl-universal').addEventListener('click', () => {{
      downloadCanvas(canvasUniversal, 'convoy-radio-universal-master-5244x2950.png');
    }});

    document.getElementById('btn-download-all').addEventListener('click', () => {{
      downloadCanvas(canvasHeader, 'convoy-radio-product-page-header-3840x1646.png');
      setTimeout(() => {{
        downloadCanvas(canvasSearch, 'convoy-radio-search-results-3840x2560.png');
      }}, 600);
      setTimeout(() => {{
        downloadCanvas(canvasUniversal, 'convoy-radio-universal-master-5244x2950.png');
      }}, 1200);
    }});
  </script>
</body>
</html>
'''

output_path = 'tools/header-generator/index.html'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Created {output_path} successfully ({len(html_content)} bytes)")
