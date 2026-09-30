// ==========================================================================
// Atlas Cartographic Background Visualizer
// Topographic Contours, Rotating Astrolabe Compass, & Coordinate Graticule
// ==========================================================================

class AtlasBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.time = 0;
    this.compassAngle = 0;
    this.waypoints = [];
    this.flightRoutes = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Generate random geographic waypoints
    this.generateWaypoints();

    // Start render loop
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.scale(dpr, dpr);
  }

  generateWaypoints() {
    this.waypoints = [];
    const count = Math.max(6, Math.floor(this.width / 200));
    for (let i = 0; i < count; i++) {
      this.waypoints.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: 2.5 + Math.random() * 2,
        pulse: Math.random() * Math.PI * 2,
        label: `WP-${String.fromCharCode(65 + (i % 26))}${i + 1}`
      });
    }
  }

  drawTopographicContours() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Draw 4 organic topographic elevation contour waves
    ctx.save();
    ctx.lineWidth = 1;

    for (let layer = 0; layer < 4; layer++) {
      ctx.beginPath();
      const alpha = 0.025 + layer * 0.012;
      ctx.strokeStyle = layer % 2 === 0 
        ? `rgba(56, 189, 248, ${alpha})` 
        : `rgba(16, 185, 129, ${alpha})`;

      const baseY = h * (0.2 + layer * 0.22);
      ctx.moveTo(0, baseY);

      const segments = 24;
      for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * w;
        const wave1 = Math.sin((x * 0.003) + (this.time * 0.25) + layer) * 45;
        const wave2 = Math.cos((x * 0.0015) - (this.time * 0.15) + (layer * 1.5)) * 30;
        const y = baseY + wave1 + wave2;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  drawCoordinateGraticule() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);

    // Latitude parallels
    const latSpacing = 120;
    for (let y = latSpacing; y < h; y += latSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();

      // Latitude label stamp
      ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.font = '10px "JetBrains Mono", monospace';
      const deg = Math.round(90 - (y / h) * 180);
      const latText = `${Math.abs(deg)}°${deg >= 0 ? 'N' : 'S'}`;
      ctx.fillText(latText, 16, y - 4);
    }

    // Longitude meridians
    const lonSpacing = 180;
    for (let x = lonSpacing; x < w; x += lonSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();

      // Longitude label stamp
      ctx.fillStyle = 'rgba(100, 116, 139, 0.35)';
      ctx.font = '10px "JetBrains Mono", monospace';
      const deg = Math.round(((x / w) * 360) - 180);
      const lonText = `${Math.abs(deg)}°${deg >= 0 ? 'E' : 'W'}`;
      ctx.fillText(lonText, x + 6, h - 16);
    }

    ctx.restore();
  }

  drawNavigationalCompass() {
    const ctx = this.ctx;
    // Position astrolabe in upper-right corner
    const cx = this.width - Math.min(180, this.width * 0.18);
    const cy = Math.min(220, this.height * 0.28);
    const radius = Math.min(110, this.width * 0.12);

    if (radius < 40) return; // Skip on very small screens

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.compassAngle);

    // 1. Outer degree ring
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.07)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 2. Middle ring
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.stroke();

    // 3. Degree tick marks around the ring
    for (let i = 0; i < 36; i++) {
      const angle = (i * Math.PI) / 18;
      const isMajor = i % 9 === 0;
      const innerR = isMajor ? radius * 0.72 : radius * 0.88;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.strokeStyle = isMajor ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = isMajor ? 1.5 : 1;
      ctx.stroke();
    }

    // 4. Nautical 8-Point Star Rose
    const points = 8;
    for (let i = 0; i < points; i++) {
      const a = (i * Math.PI * 2) / points;
      const nextA = ((i + 0.5) * Math.PI * 2) / points;
      const isCard = i % 2 === 0;
      const tipR = isCard ? radius * 0.68 : radius * 0.45;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * tipR, Math.sin(a) * tipR);
      ctx.lineTo(Math.cos(nextA) * (radius * 0.18), Math.sin(nextA) * (radius * 0.18));
      ctx.closePath();

      ctx.fillStyle = isCard ? 'rgba(56, 189, 248, 0.06)' : 'rgba(255, 255, 255, 0.03)';
      ctx.fill();
    }

    // Center pivot
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    ctx.fill();

    ctx.restore();

    // Fixed Cardinal Indicators (Do not spin with the astrolabe)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.font = '700 11px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', 0, -radius - 12);
    ctx.fillStyle = 'rgba(100, 116, 139, 0.2)';
    ctx.fillText('S', 0, radius + 12);
    ctx.fillText('E', radius + 14, 0);
    ctx.fillText('W', -radius - 14, 0);
    ctx.restore();
  }

  drawWaypointsAndRoutes() {
    const ctx = this.ctx;

    // Update waypoint positions
    for (let i = 0; i < this.waypoints.length; i++) {
      const wp = this.waypoints[i];
      wp.x += wp.vx;
      wp.y += wp.vy;
      wp.pulse += 0.04;

      if (wp.x < 0) wp.x = this.width;
      if (wp.x > this.width) wp.x = 0;
      if (wp.y < 0) wp.y = this.height;
      if (wp.y > this.height) wp.y = 0;

      // Draw faint flight routes between nearby waypoints
      for (let j = i + 1; j < this.waypoints.length; j++) {
        const wp2 = this.waypoints[j];
        const dx = wp.x - wp2.x;
        const dy = wp.y - wp2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 260) {
          const alpha = (1 - dist / 260) * 0.04;
          ctx.beginPath();
          ctx.moveTo(wp.x, wp.y);
          // Curved geodesic line
          const midX = (wp.x + wp2.x) / 2;
          const midY = ((wp.y + wp2.y) / 2) - 15;
          ctx.quadraticCurveTo(midX, midY, wp2.x, wp2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.setLineDash([3, 5]);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Draw Waypoint Beacon
      const pulseSize = wp.radius + Math.sin(wp.pulse) * 1.5;
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(wp.x, wp.y, wp.radius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.fill();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.time += 0.015;
    this.compassAngle += 0.0006; // Slow serene celestial rotation

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawCoordinateGraticule();
    this.drawTopographicContours();
    this.drawNavigationalCompass();
    this.drawWaypointsAndRoutes();
  }
}

// Initialize on load
let atlasBackgroundInstance = null;
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('atlasBgCanvas');
  if (canvas) {
    atlasBackgroundInstance = new AtlasBackground('atlasBgCanvas');
  }
});
