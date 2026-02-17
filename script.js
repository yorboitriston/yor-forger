const canvas = document.getElementById('portraitCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const images = ['image1.JPG', 'image2.JPG', 'toge.png'];
const soloImage = 'solo.png';
let currentIndex = 0;
let isSoloMode = false;

const tributeText = `You are not standing alone now. You stood firm through our darkest hours, when everything felt unsteady, when strength had to be chosen every day. You carried more than your share so the rest of us could breathe, so we could keep going. We did not forget that. What we forged together was not made in ease. It was shaped by pressure, by nights that demanded endurance, by faith in each other when certainty was nowhere to be found. The memories we built are not distant. They live in us. They are reminders of who we are and what we are capable of surviving together. This bond moved beyond friendship. It became family—chosen, earned, unbreakable. Not blood, but deeper than that. You are one of my own. And now, in this moment that weighs heavier than the rest, we stand tall for you. Just as you did for us. No matter how this path unfolds—whether the days ahead bring relief or difficulty—we will be here. Steady. Present. Unmoving. Through the best outcome. Through the hardest one. Through joy and through trial, "The Forgers" remain united. When the world feels uncertain, we rely on each other. When strength falters, we hold the line together. We have faced moments where it felt like we had no one but each other—and we learned that was enough. I am thankful for everything we created. For every time you fought—for me, for us, for what we believed in. Now it is our turn. You do not have to be strong for us. We will be strong with you. We will stay. We will not waver. We will not leave. You are not alone. Not now. Not ever. `;

function drawPortrait(imagePath) {
    const img = new Image();
    img.src = imagePath;
    
    img.onload = () => {
        const targetWidth = 1200; 
        canvas.width = targetWidth;
        canvas.height = (img.height / img.width) * targetWidth;
        
        // --- IMAGE-SPECIFIC PANNING/ZOOM ---
        if (!isSoloMode && currentIndex === 1) { 
            // Image 2: Zoomed Out
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        } else if (!isSoloMode && currentIndex === 2) {
            // toge.png: Panned >>>
            const zoomFactor = 0.85; 
            const sourceW = img.width * zoomFactor;
            const sourceH = img.height * zoomFactor;
            const sourceX = 0; // Revealing left side shifts subject right
            const sourceY = (img.height - sourceH) / 2;
            ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // --- TEXT ART SETTINGS (Improved Readability) ---
        const fontSize = 10.0;
        ctx.font = `bold ${fontSize}px Courier, monospace`;
        const contrast = 2.8;    
        const exposure = 1.6;    
        const spacingX = fontSize * 0.65; 
        const spacingY = fontSize * 1.1; 

        let charIndex = 0;
        for (let y = 0; y < canvas.height; y += spacingY) {
            for (let x = 0; x < canvas.width; x += spacingX) {
                const pixelIndex = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
                if (pixelIndex >= imageData.data.length) continue;

                let r = (((imageData.data[pixelIndex] - 128) * contrast) + 128) * exposure;
                let g = (((imageData.data[pixelIndex + 1] - 128) * contrast) + 128) * exposure;
                let b = (((imageData.data[pixelIndex + 2] - 128) * contrast) + 128) * exposure;

                const brightness = (r + g + b) / 3;
                if (brightness > 18) { 
                    ctx.fillStyle = `rgb(${Math.min(255, Math.max(0, r))},${Math.min(255, Math.max(0, g))},${Math.min(255, Math.max(0, b))})`;
                    ctx.fillText(tributeText[charIndex % tributeText.length], x, y);
                    charIndex++;
                }
            }
        }
    };
}

// SURPRISE LOGIC
function showPopup() {
    document.getElementById('popupOverlay').style.display = 'flex';
}

function enterSoloMode() {
    isSoloMode = true;
    document.getElementById('popupOverlay').style.display = 'none';
    document.getElementById('heartIcon').style.display = 'none';
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('backBtn').style.display = 'block';
    drawPortrait(soloImage);
}

function hideSoloMode() {
    isSoloMode = false;
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('heartIcon').style.display = 'block';
    document.getElementById('prevBtn').style.display = 'block';
    document.getElementById('nextBtn').style.display = 'block';
    drawPortrait(images[currentIndex]);
}

function changeSlide(dir) {
    if (isSoloMode) return;
    currentIndex = (currentIndex + dir + images.length) % images.length;
    drawPortrait(images[currentIndex]);
}

window.onload = () => drawPortrait(images[currentIndex]);