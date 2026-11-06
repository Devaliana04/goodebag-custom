/**
 * Grid Motion Animation Component
 * Inspired by React Bits (reactbits.dev/tools/background-studio?bg=grid-motion)
 * High-performance, zero-dependency vanilla JS with smooth LERP physics,
 * alternating row movement, mouse tracking, touch drag, and ambient drift.
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.grid-motion-container');
  if (!container) return;

  const canvas = container.querySelector('.grid-motion-canvas');
  const rows = container.querySelectorAll('.grid-motion-row');
  if (!rows.length) return;

  // Configuration
  const baseSpeed = 0.45; // Pixels per frame ambient drift
  const mouseFactor = 120; // Maximum displacement on mouse hover
  const lerpFactor = 0.055; // Easing smoothness

  // Physics state
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let ambientOffset = 0;
  let isHovered = false;
  let isDragging = false;
  let startX = 0;
  let dragDeltaX = 0;

  // Duplicate items in each row for seamless infinite scrolling
  rows.forEach(row => {
    const items = Array.from(row.children);
    // Duplicate once so there are at least 10-12 items
    items.forEach(item => {
      const clone = item.cloneNode(true);
      row.appendChild(clone);
    });
  });

  // Calculate half width of a row track for seamless wrapping
  const getRowLoopWidth = (row) => {
    return row.scrollWidth / 2;
  };

  // Mouse move handler (tracks relative position from container center)
  const handleMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const yRel = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    targetX = xRel * 2 * mouseFactor;
    targetY = yRel * 2 * (mouseFactor * 0.4);
  };

  container.addEventListener('mouseenter', () => {
    isHovered = true;
  });

  container.addEventListener('mousemove', handleMouseMove);

  container.addEventListener('mouseleave', () => {
    isHovered = false;
    targetX = 0;
    targetY = 0;
  });

  // Touch drag support for mobile
  container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const currentTouchX = e.touches[0].clientX;
    dragDeltaX += (currentTouchX - startX) * 0.8;
    startX = currentTouchX;
  }, { passive: true });

  const endDrag = () => {
    isDragging = false;
  };
  container.addEventListener('touchend', endDrag);
  container.addEventListener('touchcancel', endDrag);

  // Main 60fps / 120fps Animation Loop
  let lastTime = performance.now();

  const animate = (time) => {
    const deltaTime = Math.min((time - lastTime) / 16.667, 2.0);
    lastTime = time;

    // Ambient floating drift
    ambientOffset += baseSpeed * deltaTime;

    // LERP mouse coordinates
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    // Dampen drag delta
    dragDeltaX *= 0.94;

    // Animate canvas subtle 3D tilt / parallax
    if (canvas) {
      canvas.style.transform = `rotate(-14deg) skewX(2deg) scale(1.08) translate3d(${currentX * 0.12}px, ${currentY * 0.12}px, 0)`;
    }

    // Animate alternating rows
    rows.forEach((row, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const loopWidth = getRowLoopWidth(row);

      // Total position combines ambient drift + mouse offset + touch drag
      const rowOffset = (ambientOffset * direction) + (currentX * direction * 0.85) + (dragDeltaX * direction);
      
      // Infinite modulo wrap
      let wrappedX = (rowOffset % loopWidth);
      if (direction === -1) {
        wrappedX -= loopWidth;
      }

      row.style.transform = `translate3d(${wrappedX}px, 0, 0)`;
    });

    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
});

