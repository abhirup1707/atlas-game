// Atlas Official 3D Realistic Earth Globe (Three.js & NASA Blue Marble)
// ==========================================================================

class AtlasGlobe {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.earthMesh = null;
    this.atmosphereMesh = null;
    this.globeGroup = null;

    // Interaction state
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.autoRotate = true;
    this.lastInteractionTime = Date.now();

    // Rotation targets (radians)
    this.currentRotationY = 0;
    this.currentRotationX = 0.2;
    this.targetRotationY = 0;
    this.targetRotationX = 0.2;

    // Active arcs and pins
    this.arcMeshes = [];
    this.pinMeshes = [];

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();

    const w = this.container.clientWidth || 280;
    const h = this.container.clientHeight || 180;
    this.camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 1000);
    this.camera.position.set(0, 0, 2.75);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    const oldCanvas = this.container.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();
    this.container.appendChild(this.renderer.domElement);

    // Realistic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.85);
    sunLight.position.set(4, 3, 5);
    this.scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
    rimLight.position.set(-4, -2, -3);
    this.scene.add(rimLight);

    // Globe group for synchronized rotation
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // High-res Realistic Earth (NASA Blue Marble)
    const earthGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const textureLoader = new THREE.TextureLoader();

    textureLoader.load(
      'earth-texture.jpg',
      (texture) => {
        texture.anisotropy = 8;
        const earthMat = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.8,
          metalness: 0.05
        });
        this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
        this.globeGroup.add(this.earthMesh);
      },
      undefined,
      (err) => {
        console.warn("Fallback material loaded", err);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0x1b4332,
          roughness: 0.8
        });
        this.earthMesh = new THREE.Mesh(earthGeo, fallbackMat);
        this.globeGroup.add(this.earthMesh);
      }
    );

    // Glowing Atmosphere Rim
    const atmosGeo = new THREE.SphereGeometry(1.02, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.BackSide
    });
    this.atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    this.scene.add(this.atmosphereMesh);

    this.initEvents();
    this.animate();
  }

  initEvents() {
    const el = this.renderer.domElement;

    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => this.resize());
      ro.observe(this.container);
    }
    window.addEventListener('resize', () => this.resize());

    // Mouse Drag
    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.autoRotate = false;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.lastInteractionTime = Date.now();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.targetRotationY += dx * 0.008;
      this.targetRotationX = Math.max(-1.15, Math.min(1.15, this.targetRotationX + dy * 0.008));
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.lastInteractionTime = Date.now();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch Support
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.autoRotate = false;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
        this.lastInteractionTime = Date.now();
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length === 0) return;
      const dx = e.touches[0].clientX - this.lastMouseX;
      const dy = e.touches[0].clientY - this.lastMouseY;
      this.targetRotationY += dx * 0.008;
      this.targetRotationX = Math.max(-1.15, Math.min(1.15, this.targetRotationX + dy * 0.008));
      this.lastMouseX = e.touches[0].clientX;
      this.lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  resize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // Mathematically aligns with Three.js SphereGeometry Equirectangular UVs
  latLonToVector3(lat, lon, radius = 1.0, altitude = 0) {
    const r = radius + altitude;
    const latRad = lat * (Math.PI / 180);
    const lonRad = (lon + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.cos(lonRad) * Math.cos(latRad),
       r * Math.sin(latRad),
       r * Math.sin(lonRad) * Math.cos(latRad)
    );
  }

  // Mathematically centers (lat, lon) directly facing the camera at (0, 0, +Z)
  // with North pointing UP (+Y) and East pointing RIGHT (+X)
  focusOn(lat, lon) {
    this.targetRotationY = -((lon + 90) * (Math.PI / 180));
    this.targetRotationX = lat * (Math.PI / 180);
    this.autoRotate = false;
    this.lastInteractionTime = Date.now();
  }

  // Drop initial pin when game begins or first word is played
  addInitialPin(place) {
    if (typeof getCoordinatesForPlace !== 'function') return;
    const coords = getCoordinatesForPlace(place);
    if (!coords) return;

    this.focusOn(coords[0], coords[1]);
    const v = this.latLonToVector3(coords[0], coords[1], 1.0, 0.005);
    this.addVividRedPin(v, place);

    const bannerEl = document.getElementById("globeFlightBanner");
    const routeText = document.getElementById("globeFlightRouteText");
    if (routeText) {
      routeText.innerHTML = `Starting Expedition: <strong>${place}</strong>`;
      if (bannerEl) bannerEl.classList.add("active");
    }
  }

  // Draw 3D Great-Circle Flight Arc between consecutive places
  addFlightArc(fromPlace, toPlace) {
    if (typeof getCoordinatesForPlace !== 'function') return;
    const c1 = getCoordinatesForPlace(fromPlace);
    const c2 = getCoordinatesForPlace(toPlace);
    if (!c1 || !c2) return;

    const dist = typeof calculateDistanceKm === 'function' ? calculateDistanceKm(c1, c2) : 0;
    this.focusOn(c2[0], c2[1]);

    const v1 = this.latLonToVector3(c1[0], c1[1], 1.0, 0.005);
    const v2 = this.latLonToVector3(c2[0], c2[1], 1.0, 0.005);

    // Parabolic arc elevated based on great circle distance
    const distance3D = v1.distanceTo(v2);
    const altitude = Math.min(0.55, Math.max(0.14, distance3D * 0.35));

    let mid = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
    if (mid.lengthSq() < 0.001) mid = new THREE.Vector3(0, 1, 0);
    const normal = mid.clone().normalize();
    const controlPoint = normal.multiplyScalar(1.0 + altitude);

    const curve = new THREE.QuadraticBezierCurve3(v1, controlPoint, v2);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    // Glowing Emerald Flight Path
    const material = new THREE.LineBasicMaterial({
      color: 0x10b981,
      linewidth: 3,
      transparent: true,
      opacity: 0.95
    });

    const arcMesh = new THREE.Line(geometry, material);
    this.globeGroup.add(arcMesh);
    this.arcMeshes.push(arcMesh);

    if (this.arcMeshes.length > 5) {
      const old = this.arcMeshes.shift();
      this.globeGroup.remove(old);
      if (old.geometry) old.geometry.dispose();
      if (old.material) old.material.dispose();
    }

    // Add Vivid Scarlet Red Map Pin Emoji at destination
    this.addVividRedPin(v2, toPlace);

    // Update flight banner in dedicated card footer (outside globe canvas)
    const bannerEl = document.getElementById("globeFlightBanner");
    const routeText = document.getElementById("globeFlightRouteText");
    if (routeText) {
      routeText.innerHTML = `<strong>${fromPlace}</strong> ➔ <strong>${toPlace}</strong> <span class="flight-dist-tag">${dist.toLocaleString()} km</span>`;
      if (bannerEl) bannerEl.classList.add("active");
    }
  }

  // Create High-Definition Canvas Texture for Vivid 📍 Pin Emoji with Place Label
  createPinCanvasTexture(placeName) {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');

    // Soft drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;

    // 1. Teardrop Map Pin Shape (📍)
    // Head center at (80, 70), radius 34. Needle tip at (80, 160).
    ctx.beginPath();
    ctx.arc(80, 70, 34, Math.PI * 0.88, Math.PI * 0.12, false);
    ctx.lineTo(80, 160);
    ctx.closePath();

    // Ultra-vivid scarlet red radial gradient
    const grad = ctx.createRadialGradient(68, 56, 4, 80, 70, 40);
    grad.addColorStop(0, '#ff476f');
    grad.addColorStop(0.45, '#ff0038');
    grad.addColorStop(1, '#a7001a');
    ctx.fillStyle = grad;
    ctx.fill();

    // Crisp pure white outline for maximum contrast against all terrains
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // 2. Signature White Pin Hole / Ring
    ctx.beginPath();
    ctx.arc(80, 70, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Deep crimson center dot
    ctx.beginPath();
    ctx.arc(80, 70, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#a7001a';
    ctx.fill();

    ctx.restore();

    // 3. Crisp Destination Label Tag (above pin)
    if (placeName) {
      const text = placeName.toUpperCase();
      ctx.font = 'bold 17px "Outfit", "Segoe UI", sans-serif';
      const textMetrics = ctx.measureText(text);
      const boxW = Math.min(150, Math.max(50, textMetrics.width + 16));
      const boxH = 22;
      const boxX = (160 - boxW) / 2;
      const boxY = 8;

      ctx.fillStyle = 'rgba(10, 18, 36, 0.92)';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 0, 56, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else {
        ctx.fillRect(boxX, boxY, boxW, boxH);
      }

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 80, boxY + boxH / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    return texture;
  }

  // Vivid Scarlet Red Pin Emoji & Ground Ripple
  addVividRedPin(pos, label) {
    const pinGroup = new THREE.Group();
    pinGroup.position.copy(pos);

    // Normal vector pointing away from globe center
    const normal = pos.clone().normalize();

    // 1. Billboard 📍 Pin Sprite (Always faces user upright)
    const texture = this.createPinCanvasTexture(label);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      depthTest: true,
      sizeAttenuation: true
    });
    const sprite = new THREE.Sprite(spriteMat);

    // Anchor: Tip of needle (y = 160 on a 200px tall canvas) touches ground
    sprite.center.set(0.5, (200 - 160) / 200);
    sprite.scale.set(0.24, 0.30, 1.0);
    pinGroup.add(sprite);

    // 2. Small Glowing Ground Dot at the landing point
    const beaconGeo = new THREE.SphereGeometry(0.016, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff0038 });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    pinGroup.add(beacon);

    // 3. Ground Ripple Beacon Ring on Earth surface
    const rippleGeo = new THREE.RingGeometry(0.02, 0.045, 32);
    const rippleMat = new THREE.MeshBasicMaterial({
      color: 0xff0038,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9
    });
    const ripple = new THREE.Mesh(rippleGeo, rippleMat);
    // Align ring to sphere normal
    ripple.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    this.globeGroup.add(ripple);
    ripple.position.copy(pos);

    this.globeGroup.add(pinGroup);
    this.pinMeshes.push({ group: pinGroup, ripple, scale: 1 });

    if (this.pinMeshes.length > 6) {
      const old = this.pinMeshes.shift();
      this.globeGroup.remove(old.group);
      this.globeGroup.remove(old.ripple);
      if (old.ripple.geometry) old.ripple.geometry.dispose();
      if (old.ripple.material) old.ripple.material.dispose();
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Shortest rotational path around Y
    let diffY = (this.targetRotationY - this.currentRotationY) % (Math.PI * 2);
    if (diffY > Math.PI) diffY -= Math.PI * 2;
    if (diffY < -Math.PI) diffY += Math.PI * 2;
    this.currentRotationY += diffY * 0.08;

    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.08;

    if (this.globeGroup) {
      this.globeGroup.rotation.y = this.currentRotationY;
      this.globeGroup.rotation.x = this.currentRotationX;
    }

    // Auto rotate slowly when idle
    if (Date.now() - this.lastInteractionTime > 3500 && !this.isDragging) {
      this.targetRotationY += 0.003;
    }

    // Animate ripple rings
    this.pinMeshes.forEach(p => {
      p.scale += 0.022;
      if (p.scale > 2.2) p.scale = 1.0;
      p.ripple.scale.set(p.scale, p.scale, p.scale);
      p.ripple.material.opacity = Math.max(0, 0.9 - (p.scale - 1.0) / 1.3);
    });

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
}

let atlasGlobeInstance = null;
function initAtlasGlobe() {
  const container = document.getElementById("globeContainer");
  if (!container) return;
  if (!atlasGlobeInstance) {
    atlasGlobeInstance = new AtlasGlobe("globeContainer");
  } else {
    atlasGlobeInstance.resize();
  }
}
