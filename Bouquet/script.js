// ------------------------------
// Canvas Greeting Card App
// ------------------------------

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Assets
const bouquets = [
    { id: 'b1', name: 'Rose Bouquet', src: 'assets/1.png' },
    { id: 'b2', name: 'Tulip Bouquet', src: 'assets/2.png' },
    { id: 'b3', name: 'Daisy Bouquet', src: 'assets/3.png' },
    { id: 'b4', name: 'Sunflower Bouquet', src: 'assets/4.png' },
    { id: 'b5', name: 'Lily Bouquet', src: 'assets/5.png' },
    { id: 'b6', name: 'Cherry Blossom', src: 'assets/6.png' },
    { id: 'b7', name: 'Orchid Bouquet', src: 'assets/7.png' },
    { id: 'b8', name: 'Lavender Bouquet', src: 'assets/8.png' },
    { id: 'b9', name: 'Peony Bouquet', src: 'assets/9.png' },
    { id: 'b10', name: 'Hibiscus Bouquet', src: 'assets/10.png' },
    { id: 'b11', name: 'Magnolia Bouquet', src: 'assets/11.png' },
    { id: 'b12', name: 'Azalea Bouquet', src: 'assets/12.png' },
    { id: 'b13', name: 'Camellia Bouquet', src: 'assets/13.png' },
    { id: 'b14', name: 'Daffodil Bouquet', src: 'assets/14.png' },
    { id: 'b15', name: 'Gladiolus Bouquet', src: 'assets/15.png' },
    { id: 'b16', name: 'Iris Bouquet', src: 'assets/16.png' }
];

const characters = [
    { id: 'c1', name: 'Character 1', src: 'assets/17.png' },
    { id: 'c2', name: 'Character 2', src: 'assets/18.png' },
    { id: 'c3', name: 'Character 3', src: 'assets/19.png' },
    { id: 'c4', name: 'Character 4', src: 'assets/20.png' },
    { id: 'c5', name: 'Character 5', src: 'assets/21.png' },
    { id: 'c6', name: 'Character 6', src: 'assets/22.png' },
    { id: 'c7', name: 'Character 7', src: 'assets/23.png' },
    { id: 'c8', name: 'Character 8', src: 'assets/24.png' },
    { id: 'c9', name: 'Character 9', src: 'assets/25.png' },
    { id: 'c10', name: 'Character 10', src: 'assets/26.png' },
    { id: 'c11', name: 'Character 11', src: 'assets/27.png' },
    { id: 'c12', name: 'Character 12', src: 'assets/28.png' },
    { id: 'c13', name: 'Character 13', src: 'assets/29.png' },
    { id: 'c14', name: 'Character 14', src: 'assets/30.png' },
    { id: 'c15', name: 'Character 15', src: 'assets/31.png' },
    { id: 'c16', name: 'Character 16', src: 'assets/32.png' }
];

// State
let currentBouquetIndex = -1;
let currentCharacterIndex = -1;
let backgroundColor = '#ffffff';
let messageText = '';
let fontStyle = 'elegant';
let bouquetX = 400, bouquetY = 250;
let textX = 400, textY = 500;
let isDraggingBouquet = false;
let isDraggingText = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// DOM Elements
const bouquetDisplay = document.getElementById('bouquet-display');
const characterDisplay = document.getElementById('character-display');
const colorBtns = document.querySelectorAll('.color-btn');
const messageInput = document.getElementById('message-text');
const charCount = document.getElementById('char-count');

// ------------------------------
// Initialize App
// ------------------------------
function init() {
    setupEventListeners();
    drawCanvas();
}

function setupEventListeners() {
    // Bouquet navigation
    document.getElementById('bouquet-prev').addEventListener('click', prevBouquet);
    document.getElementById('bouquet-next').addEventListener('click', nextBouquet);

    // Character navigation
    document.getElementById('character-prev').addEventListener('click', prevCharacter);
    document.getElementById('character-next').addEventListener('click', nextCharacter);

    // Download
    document.getElementById('download-btn').addEventListener('click', downloadImage);

    // Color buttons
    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            backgroundColor = btn.dataset.color;
            drawCanvas();
        });
    });
    colorBtns[0].classList.add('active');

    // Message input
    messageInput.addEventListener('input', (e) => {
        messageText = e.target.value;
        charCount.textContent = messageText.length;
        drawCanvas();
    });

    // Font style
    document.getElementById('font-style').addEventListener('change', (e) => {
        fontStyle = e.target.value;
        drawCanvas();
    });

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });

    // Canvas drag (desktop)
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('mouseleave', handleCanvasMouseUp);

    // Canvas drag (mobile)
    canvas.addEventListener('touchstart', handleCanvasTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleCanvasTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleCanvasTouchEnd, { passive: false });
}

// ------------------------------
// Tab Switching
// ------------------------------
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabName + '-tab').classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

// ------------------------------
// Navigation
// ------------------------------
function nextBouquet() { currentBouquetIndex = (currentBouquetIndex + 1) % bouquets.length; updateBouquetDisplay(); drawCanvas(); }
function prevBouquet() { currentBouquetIndex = (currentBouquetIndex - 1 + bouquets.length) % bouquets.length; updateBouquetDisplay(); drawCanvas(); }
function updateBouquetDisplay() {
    if (currentBouquetIndex === -1) return;
    bouquetDisplay.src = bouquets[currentBouquetIndex].src;
}

function nextCharacter() { currentCharacterIndex = (currentCharacterIndex + 1) % characters.length; updateCharacterDisplay(); drawCanvas(); }
function prevCharacter() { currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length; updateCharacterDisplay(); drawCanvas(); }
function updateCharacterDisplay() {
    if (currentCharacterIndex === -1) return;
    characterDisplay.src = characters[currentCharacterIndex].src;
}

// ------------------------------
// Draw Canvas
// ------------------------------
function drawCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let bouquetLoaded = false;
    let characterLoaded = false;

    // Draw bouquet
    if (currentBouquetIndex !== -1) {
        const img = new Image();
        img.src = bouquets[currentBouquetIndex].src;
        img.onload = () => {
            ctx.drawImage(img, bouquetX - 150, bouquetY - 100, 300, 300);
            bouquetLoaded = true;
            if (characterLoaded) drawText();
        };
    } else {
        bouquetLoaded = true;
    }

    // Draw characters
    if (currentCharacterIndex !== -1) {
        const img = new Image();
        img.src = characters[currentCharacterIndex].src;
        const positions = [
            { x: 10, y: 10, w: 100, h: 130 },
            { x: canvas.width - 110, y: 10, w: 100, h: 130 },
            { x: 10, y: canvas.height - 140, w: 100, h: 130 },
            { x: canvas.width - 110, y: canvas.height - 140, w: 100, h: 130 }
        ];
        img.onload = () => {
            positions.forEach(pos => ctx.drawImage(img, pos.x, pos.y, pos.w, pos.h));
            characterLoaded = true;
            if (bouquetLoaded) drawText();
        };
    } else {
        characterLoaded = true;
    }

    if (bouquetLoaded && characterLoaded) drawText();
}

// ------------------------------
// Draw Text
// ------------------------------
function drawText() {
    if (!messageText) return;
    const lines = wrapText(messageText, 40);
    const textHeight = lines.length;

    let fontSize = textHeight > 6 ? 16 : textHeight > 4 ? 20 : 24;
    let lineHeight = textHeight > 6 ? 22 : textHeight > 4 ? 28 : 32;

    let fontFamily = 'Arial', fontWeight = 'bold', fillColor = '#d91e63';
    switch (fontStyle) {
        case 'elegant': fontFamily = 'Georgia, serif'; fontWeight = 'normal'; fillColor = '#d91e63'; break;
        case 'playful': fontFamily = 'Comic Sans MS, cursive'; fontWeight = 'bold'; fillColor = '#ff1744'; break;
        case 'romantic': fontFamily = 'Georgia, serif'; fontWeight = 'normal'; fillColor = '#ec407a'; ctx.strokeStyle = 'rgba(236, 64, 122, 0.3)'; ctx.lineWidth = 1; break;
        case 'bold': fontFamily = 'Arial Black, sans-serif'; fontWeight = '900'; fillColor = '#d91e63'; break;
    }

    ctx.fillStyle = fillColor;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const totalTextHeight = textHeight * lineHeight;
    let y = Math.max(160, Math.min(textY, canvas.height - totalTextHeight - 40));

    lines.forEach(line => {
        if (fontStyle === 'romantic') ctx.strokeText(line, textX, y);
        ctx.fillText(line, textX, y);
        y += lineHeight;
    });
}

// ------------------------------
// Wrap Text
// ------------------------------
function wrapText(text, charsPerLine) {
    const lines = [];
    for (let i = 0; i < text.length; i += charsPerLine) {
        lines.push(text.substr(i, charsPerLine));
    }
    return lines;
}

// ------------------------------
// Drag Handlers (Desktop)
// ------------------------------
function handleCanvasMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x > bouquetX - 150 && x < bouquetX + 150 && y > bouquetY - 100 && y < bouquetY + 200) {
        isDraggingBouquet = true;
        dragOffsetX = x - bouquetX;
        dragOffsetY = y - bouquetY;
    } else if (messageText && x > textX - 150 && x < textX + 150 && y > textY - 20 && y < textY + 80) {
        isDraggingText = true;
        dragOffsetX = x - textX;
        dragOffsetY = y - textY;
    }
}
function handleCanvasMouseMove(e) {
    if (!isDraggingBouquet && !isDraggingText) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDraggingBouquet) {
        bouquetX = Math.max(150, Math.min(x - dragOffsetX, canvas.width - 150));
        bouquetY = Math.max(100, Math.min(y - dragOffsetY, canvas.height - 200));
    }
    if (isDraggingText) {
        textX = Math.max(100, Math.min(x - dragOffsetX, canvas.width - 100));
        textY = Math.max(20, Math.min(y - dragOffsetY, canvas.height - 80));
    }
    drawCanvas();
}
function handleCanvasMouseUp() { isDraggingBouquet = false; isDraggingText = false; }

// ------------------------------
// Drag Handlers (Mobile)
// ------------------------------
function handleCanvasTouchStart(e) {
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (x > bouquetX - 180 && x < bouquetX + 180 && y > bouquetY - 130 && y < bouquetY + 230) {
        isDraggingBouquet = true;
        dragOffsetX = x - bouquetX;
        dragOffsetY = y - bouquetY;
        e.preventDefault();
    } else if (messageText && x > textX - 180 && x < textX + 180 && y > textY - 50 && y < textY + 120) {
        isDraggingText = true;
        dragOffsetX = x - textX;
        dragOffsetY = y - textY;
        e.preventDefault();
    }
}
function handleCanvasTouchMove(e) {
    if (!isDraggingBouquet && !isDraggingText) return;
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (isDraggingBouquet) {
        bouquetX = Math.max(150, Math.min(x - dragOffsetX, canvas.width - 150));
        bouquetY = Math.max(100, Math.min(y - dragOffsetY, canvas.height - 200));
    }
    if (isDraggingText) {
        textX = Math.max(100, Math.min(x - dragOffsetX, canvas.width - 100));
        textY = Math.max(20, Math.min(y - dragOffsetY, canvas.height - 80));
    }
    drawCanvas();
}
function handleCanvasTouchEnd() { isDraggingBouquet = false; isDraggingText = false; }

// ------------------------------
// Download Image
// ------------------------------
async function downloadImage() {
    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = 800;
    downloadCanvas.height = 600;
    const downloadCtx = downloadCanvas.getContext('2d');

    // Background
    downloadCtx.fillStyle = backgroundColor;
    downloadCtx.fillRect(0, 0, 800, 600);

    // Helper to draw images
    async function drawImageAsync(src, x, y, w, h) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => { downloadCtx.drawImage(img, x, y, w, h); resolve(); };
            img.onerror = resolve;
        });
    }

    // Draw bouquet
    if (currentBouquetIndex !== -1) {
        await drawImageAsync(bouquets[currentBouquetIndex].src, bouquetX - 150, bouquetY - 100, 300, 300);
    }

    // Draw characters
    if (currentCharacterIndex !== -1) {
        const positions = [
            { x: 10, y: 10, w: 100, h: 130 },
            { x: 690, y: 10, w: 100, h: 130 },
            { x: 10, y: 460, w: 100, h: 130 },
            { x: 690, y: 460, w: 100, h: 130 }
        ];
        for (const pos of positions) {
            await drawImageAsync(characters[currentCharacterIndex].src, pos.x, pos.y, pos.w, pos.h);
        }
    }

    // Draw text
    if (messageText) {
        const lines = wrapText(messageText, 40);
        const textHeight = lines.length;

        let fontSize = textHeight > 6 ? 16 : textHeight > 4 ? 20 : 24;
        let lineHeight = textHeight > 6 ? 22 : textHeight > 4 ? 28 : 32;

        let fontFamily = 'Arial', fontWeight = 'bold', fillColor = '#d91e63';
        switch (fontStyle) {
            case 'elegant': fontFamily = 'Georgia, serif'; fontWeight = 'normal'; fillColor = '#d91e63'; break;
            case 'playful': fontFamily = 'Comic Sans MS, cursive'; fontWeight = 'bold'; fillColor = '#ff1744'; break;
            case 'romantic': fontFamily = 'Georgia, serif'; fontWeight = 'normal'; fillColor = '#ec407a'; downloadCtx.strokeStyle = 'rgba(236, 64, 122, 0.3)'; downloadCtx.lineWidth = 1; break;
            case 'bold': fontFamily = 'Arial Black, sans-serif'; fontWeight = '900'; fillColor = '#d91e63'; break;
        }

        downloadCtx.fillStyle = fillColor;
        downloadCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        downloadCtx.textAlign = 'center';
        downloadCtx.textBaseline = 'top';

        const totalTextHeight = textHeight * lineHeight;
        let y = Math.max(160, Math.min(textY, 600 - totalTextHeight - 40));

        lines.forEach(line => {
            if (fontStyle === 'romantic') downloadCtx.strokeText(line, textX, y);
            downloadCtx.fillText(line, textX, y);
            y += lineHeight;
        });
    }

    // Trigger download
    const link = document.createElement('a');
    link.href = downloadCanvas.toDataURL('image/png');
    link.download = 'my-bouquet.png';
    link.click();
}

// ------------------------------
// Start App
// ------------------------------
init();
