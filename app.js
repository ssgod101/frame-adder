let originalImage = null;
let currentFrameStyle = 'classic';
let currentFrameColor = '#8B4513';
let currentFrameWidth = 20;

const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const frameSelector = document.getElementById('frameSelector');
const canvasContainer = document.getElementById('canvasContainer');
const downloadSection = document.getElementById('downloadSection');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const frameWidth = document.getElementById('frameWidth');
const widthValue = document.getElementById('widthValue');
const colorInput = document.getElementById('colorInput');
const colorHex = document.getElementById('colorHex');

// Register Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered'))
        .catch(err => console.log('Service Worker registration failed'));
}

// Image upload
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                frameSelector.classList.remove('hidden');
                applyFrame();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Frame style buttons
document.querySelectorAll('.frame-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentFrameStyle = e.currentTarget.dataset.style;
        applyFrame();
    });
});

// Quick color buttons
document.querySelectorAll('.color-btn.quick').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const color = e.currentTarget.dataset.color;
        currentFrameColor = color;
        colorInput.value = color;
        colorHex.textContent = color;
        applyFrame();
    });
});

// Color wheel input
colorInput.addEventListener('input', (e) => {
    currentFrameColor = e.target.value;
    colorHex.textContent = e.target.value;
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    applyFrame();
});

// Frame width slider
frameWidth.addEventListener('input', (e) => {
    currentFrameWidth = parseInt(e.target.value);
    widthValue.textContent = currentFrameWidth;
    applyFrame();
});

// Apply frame to image
function applyFrame() {
    if (!originalImage) return;

    const frameSize = currentFrameWidth;
    const padding = frameSize * 2;
    
    canvas.width = originalImage.width + padding;
    canvas.height = originalImage.height + padding;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw frame based on style
    switch(currentFrameStyle) {
        case 'classic':
            drawClassicFrame(frameSize);
            break;
        case 'modern':
            drawModernFrame(frameSize);
            break;
        case 'ornate':
            drawOrnateFrame(frameSize);
            break;
        case 'polaroid':
            drawPolaroidFrame(frameSize);
            break;
        case 'shadow':
            drawShadowFrame(frameSize);
            break;
        case 'double':
            drawDoubleFrame(frameSize);
            break;
        case 'neon':
            drawNeonFrame(frameSize);
            break;
        case 'vintage':
            drawVintageFrame(frameSize);
            break;
        case 'emboss':
            drawEmbossFrame(frameSize);
            break;
    }

    // Draw image
    ctx.drawImage(originalImage, frameSize, frameSize, originalImage.width, originalImage.height);

    canvasContainer.classList.remove('hidden');
    downloadSection.classList.remove('hidden');
}

function drawClassicFrame(size) {
    ctx.fillStyle = currentFrameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Inner shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = size / 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(size, size, originalImage.width, originalImage.height);
    ctx.shadowColor = 'transparent';
}

function drawModernFrame(size) {
    ctx.fillStyle = currentFrameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Minimalist line
    ctx.strokeStyle = shadeColor(currentFrameColor, -20);
    ctx.lineWidth = 4;
    ctx.strokeRect(size - 2, size - 2, originalImage.width + 4, originalImage.height + 4);
}

function drawOrnateFrame(size) {
    ctx.fillStyle = currentFrameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Multiple borders
    for (let i = 0; i < 3; i++) {
        const offset = (size / 4) * i;
        ctx.strokeStyle = shadeColor(currentFrameColor, i * -15);
        ctx.lineWidth = 3;
        ctx.strokeRect(offset, offset, canvas.width - (offset * 2), canvas.height - (offset * 2));
    }
    
    // Corner decorations
    const cornerSize = size / 2;
    ctx.fillStyle = shadeColor(currentFrameColor, -30);
    [
        [0, 0],
        [canvas.width - cornerSize, 0],
        [0, canvas.height - cornerSize],
        [canvas.width - cornerSize, canvas.height - cornerSize]
    ].forEach(([x, y]) => {
        ctx.fillRect(x, y, cornerSize, cornerSize);
    });
}

function drawPolaroidFrame(size) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Extra space at bottom for polaroid effect
    const extraBottom = size * 2;
    canvas.height = originalImage.height + size * 2 + extraBottom;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.shadowColor = 'transparent';
}

function drawShadowFrame(size) {
    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = size;
    ctx.shadowOffsetX = size / 4;
    ctx.shadowOffsetY = size / 4;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(size, size, originalImage.width, originalImage.height);
    ctx.shadowColor = 'transparent';
}

function drawDoubleFrame(size) {
    // Outer frame
    ctx.fillStyle = currentFrameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Inner mat (white/cream)
    const matSize = size / 2;
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(matSize, matSize, canvas.width - (matSize * 2), canvas.height - (matSize * 2));
    
    // Inner border
    ctx.strokeStyle = currentFrameColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(size, size, originalImage.width, originalImage.height);
}

function drawNeonFrame(size) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Neon glow effect
    const neonColor = currentFrameColor;
    ctx.shadowColor = neonColor;
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.strokeStyle = neonColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(size - 2, size - 2, originalImage.width + 4, originalImage.height + 4);
    
    // Double line effect
    ctx.lineWidth = 1;
    ctx.strokeRect(size - 5, size - 5, originalImage.width + 10, originalImage.height + 10);
    ctx.shadowColor = 'transparent';
}

function drawVintageFrame(size) {
    // Sepia tone background
    ctx.fillStyle = '#c9a876';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Darker edges
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Decorative borders
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(size - 3, size - 3, originalImage.width + 6, originalImage.height + 6);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(size + 2, size + 2, originalImage.width - 4, originalImage.height - 4);
}

function drawEmbossFrame(size) {
    // Light base
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create emboss effect with gradients
    const innerGradient = ctx.createLinearGradient(size, size, size + 10, size + 10);
    innerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.4)');
    innerGradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
    ctx.fillStyle = innerGradient;
    ctx.fillRect(0, 0, size, canvas.height);
    ctx.fillRect(size, 0, canvas.width - size, size);
    
    // Inner frame border
    ctx.strokeStyle = currentFrameColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(size, size, originalImage.width, originalImage.height);
    
    // Highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(size + 2, size + 2, originalImage.width - 4, originalImage.height - 4);
}

// Helper function to shade colors
function shadeColor(color, percent) {
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 +
        (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255))
        .toString(16).slice(1);
}

// Download image
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'framed-photo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Reset
resetBtn.addEventListener('click', () => {
    originalImage = null;
    frameSelector.classList.add('hidden');
    canvasContainer.classList.add('hidden');
    downloadSection.classList.add('hidden');
    imageInput.value = '';
    currentFrameColor = '#8B4513';
    currentFrameWidth = 20;
    frameWidth.value = '20';
    widthValue.textContent = '20';
    colorInput.value = '#8B4513';
    colorHex.textContent = '#8B4513';
    document.querySelectorAll('.frame-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
});