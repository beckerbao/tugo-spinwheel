// Simple confetti utility
const confetti = {
  canvas: null as HTMLCanvasElement | null,
  context: null as CanvasRenderingContext2D | null,
  particles: [] as Array<{
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
  }>,
  colors: [
    '#FFD700', // gold
    '#FF6B6B', // red
    '#4ECDC4', // teal
    '#7B68EE', // purple
    '#FF9A76', // orange
  ],
  animationId: 0,
  
  init() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    
    if (!this.context) return;
    
    // Set canvas to full window size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Style the canvas
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1000';
    
    // Add to document
    document.body.appendChild(this.canvas);
    
    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    });
  },
  
  start() {
    if (!this.canvas) {
      this.init();
    }
    
    // Clear existing particles
    this.particles = [];
    
    // Create particles
    for (let i = 0; i < 150; i++) {
      this.particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: Math.random() * 10 + 5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speed: Math.random() * 10 + 2,
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.2 - 0.1
      });
    }
    
    // Start animation
    this.animate();
  },
  
  animate() {
    if (!this.canvas || !this.context) return;
    
    // Clear canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      
      // Update position
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed + 1; // Add gravity
      p.rotation += p.rotationSpeed;
      
      // Fade out
      p.speed *= 0.99;
      
      // Draw particle (square)
      this.context.save();
      this.context.translate(p.x, p.y);
      this.context.rotate(p.rotation);
      this.context.fillStyle = p.color;
      this.context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.context.restore();
    }
    
    // Remove particles that are off screen
    this.particles = this.particles.filter(p => 
      p.x > -p.size && 
      p.x < window.innerWidth + p.size && 
      p.y > -p.size && 
      p.y < window.innerHeight + p.size
    );
    
    // Continue animation if particles remain
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  },
  
  stop() {
    cancelAnimationFrame(this.animationId);
    
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
      this.canvas = null;
    }
  }
};

export default confetti;