const envelope = document.getElementById("envelope");
const card = document.getElementById("card");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const questionPage = document.getElementById("questionPage");
const lovePage = document.getElementById("lovePage");
const secondLovePage = document.getElementById("secondLovePage");
const backBtn = document.getElementById("backBtn");
const cardTitle = document.getElementById("cardTitle");
const message = document.getElementById("message");
const gif = document.getElementById("gif");
const music = document.getElementById("bgMusic");


const fakeCaptcha = document.getElementById("fakeCaptcha");
const fakeCheck = document.getElementById("fakeCheck");
const fakeText = document.getElementById("fakeText");

fakeCheck.addEventListener("click", () => {
    if (fakeCheck.classList.contains("loading")) return;

    fakeCheck.classList.add("loading");
    fakeText.textContent = "Verifying…";

    setTimeout(() => {
        fakeCheck.classList.remove("loading");
        fakeCheck.classList.add("checked");
        fakeText.textContent = "Verified";

        setTimeout(() => {
            fakeCaptcha.style.opacity = "0";
            fakeCaptcha.style.pointerEvents = "none";

            setTimeout(() => fakeCaptcha.remove(), 400);
        }, 600);
    }, 1400);
});


const captchaGate = document.getElementById("captchaGate");
const tiles = document.querySelectorAll(".captcha-tile");
const verifyBtn = document.getElementById("verifyBtn");

tiles.forEach(tile => {
    tile.addEventListener("click", () => {
        tile.classList.toggle("selected");
    });
});

verifyBtn.addEventListener("click", () => {
    let success = true;

    tiles.forEach(tile => {
        const isHeart = tile.classList.contains("heart");
        const isSelected = tile.classList.contains("selected");

        if (isHeart !== isSelected) {
            success = false;
        }
    });

    if (!success) {
        verifyBtn.textContent = "Try again";
        verifyBtn.style.background = "#d93025";
        return;
    }

    // success → hide captcha
    captchaGate.style.opacity = "0";
    captchaGate.style.pointerEvents = "none";

    setTimeout(() => {
        captchaGate.remove();
        
        // Show unlock label
        const unlockLabel = document.getElementById("unlockLabel");
        unlockLabel.classList.add("show");
        
        // Fade out unlock label and reveal envelope
        setTimeout(() => {
            unlockLabel.classList.remove("show");
            
            setTimeout(() => {
                unlockLabel.remove();
                // NOW show the envelope
                document.querySelector('.envelope-container').classList.add('show');
            }, 500);
        }, 2000); // Show for 2 seconds
        
    }, 400);
});

let flipped = false;

// helper: center the Yes button inside its card face (absolute positioning)
function centerYes() {
    const face = yesBtn.closest('.card-face');
    if (!face) return;
    const faceRect = face.getBoundingClientRect();
    const yesW = yesBtn.offsetWidth;
    const yesH = yesBtn.offsetHeight;

    // make yes absolute so left/top refer to the face box
    yesBtn.style.position = 'absolute';
    yesBtn.style.left = Math.round((face.clientWidth - yesW) / 2) + 'px';
    yesBtn.style.top = Math.round((face.clientHeight - yesH) / 2) + 'px';
}
    // ensure No is not sitting in the center — if it's visible, push it to the side
    try {
        if (noBtn && noBtn.style.display !== 'none') {
            noBtn.style.position = 'absolute';
            // put No to the left edge inside the face
            noBtn.style.left = '12px';
            noBtn.style.top = Math.round((face.clientHeight - noBtn.offsetHeight) / 2) + 'px';
        }
    } catch (e) {
        // ignore
    }

/* OPEN ENVELOPE */
envelope.addEventListener("click", () => {
    envelope.classList.add("open");
});

let pageState = 0; // 0 = front, 1 = question, 2 = lovePage, 3 = secondLovePage, 4 = finalPage

/* HELPER: Update back button visibility */
function updateBackButton() {
    if (pageState >= 2) {
        backBtn.classList.add("show");
    } else {
        backBtn.classList.remove("show");
    }
}

/* BACK BUTTON */
backBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    
    if (pageState === 2) {
        // Go back from lovePage to questionPage
        pageState = 1;
        lovePage.style.display = "none";
        questionPage.style.display = "flex";
        if (cardTitle) cardTitle.style.display = "block";
    } else if (pageState === 3) {
        // Go back from secondLovePage to lovePage
        pageState = 2;
        secondLovePage.style.display = "none";
        lovePage.style.display = "block";
        if (cardTitle) cardTitle.style.display = "none";
    } else if (pageState === 4) {
        // Go back from finalPage to secondLovePage
        pageState = 3;
        finalPage.style.display = "none";
        secondLovePage.style.display = "block";
        if (cardTitle) cardTitle.style.display = "none";
    }
    
    updateBackButton();
});

/* CLICK CARD TO REVEAL CONTENT */
card.addEventListener("click", (e) => {
    e.stopPropagation();
    
    if (!flipped) {
        // First click: flip to question page
        card.classList.add("flipped");
        flipped = true;
        pageState = 1;
        
        questionPage.style.display = "flex";
        lovePage.style.display = "none";
        secondLovePage.style.display = "none";
        finalPage.style.display = "none";
        if (cardTitle) cardTitle.style.display = "block";
        
        // reset button scales/positions
        noScale = 1;
        yesScale = 1;
        noBtn.style.display = '';
        noBtn.style.opacity = '1';
        noBtn.style.transform = 'scale(1)';
        yesBtn.style.transform = 'scale(1)';
        yesBtn.style.left = '';
        yesBtn.style.top = '';
        yesBtn.style.position = '';
        noBtn.style.left = '';
        noBtn.style.top = '';
        noBtn.style.position = '';
        
        updateBackButton();
    } else if (pageState === 2) {
        // Click from lovePage: go to secondLovePage
        pageState = 3;
        lovePage.style.display = "none";
        secondLovePage.style.display = "block";
        updateBackButton();
    } else if (pageState === 3) {
        // Click from secondLovePage: go to finalPage
        pageState = 4;
        secondLovePage.style.display = "none";
        finalPage.style.display = "block";
        updateBackButton();
    } else if (pageState === 4) {
        // Click from finalPage: go back to front
        card.classList.remove("flipped");
        flipped = false;
        pageState = 0;
        finalPage.style.display = "none";
        updateBackButton();
    } else {
        // Any other state: flip back to front
        card.classList.remove("flipped");
        flipped = false;
        pageState = 0;
        updateBackButton();
    }
});

/* RUNAWAY NO */
let noScale = 1; // initial size
let yesScale = 1;

noBtn.addEventListener("mouseover", () => {
    const cardRect = card.getBoundingClientRect();
    const face = noBtn.closest('.card-face');

    // make No absolute positioned if it isn't already
    if (getComputedStyle(noBtn).position === 'static') {
        noBtn.style.position = 'absolute';
    }

    // calculate max X/Y inside the card face
    const maxX = face.clientWidth - noBtn.offsetWidth;
    const maxY = face.clientHeight - noBtn.offsetHeight;

    // move button randomly inside the card, avoiding the center
    const centerX = maxX / 2;
    const centerY = maxY / 2;
    const minDistance = Math.min(face.clientWidth, face.clientHeight) * 0.35; // exclusion radius
    
    let x, y, attempts = 0;
    do {
        x = Math.random() * maxX;
        y = Math.random() * maxY;
        attempts++;
    } while (Math.hypot(x - centerX, y - centerY) < minDistance && attempts < 30);

    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";

    // Shrink No button
    noScale -= 0.075;
    noBtn.style.transform = `scale(${noScale})`;

    // if No becomes very small, fade it out and remove it
    if (noScale <= 0.45) {
        noBtn.style.transition = 'opacity 0.25s ease';
        noBtn.style.opacity = '0';
        setTimeout(() => {
            noBtn.style.display = 'none';
            // center Yes when No is gone
            centerYes();
        }, 250);
    }

    // Grow Yes button
    yesScale += 0.1;
    yesBtn.style.transform = `scale(${yesScale})`;

    // move Yes slightly toward the card center on each mouseover
    try {
        // ensure yes can be offset
        if (getComputedStyle(yesBtn).position === 'static') yesBtn.style.position = 'relative';

        const yesRect = yesBtn.getBoundingClientRect();
        const yesCenterX = yesRect.left + yesRect.width / 2 - cardRect.left;
        const cardCenterX = cardRect.width / 2;
        const dx = cardCenterX - yesCenterX;

        // move a fraction of the distance (15%) toward center
        const move = dx * 0.15;
        
        const yesW = yesBtn.offsetWidth;
        let currentLeft = parseFloat(yesBtn.style.left);
        if (isNaN(currentLeft)) {
            currentLeft = (face.clientWidth - yesW) / 2;
            yesBtn.style.position = 'absolute';
            yesBtn.style.top = Math.round((face.clientHeight - yesBtn.offsetHeight) / 2) + 'px';
        }
        yesBtn.style.left = Math.round(currentLeft + move) + 'px';
    } catch (err) {
        // ignore layout errors
    }
});

// prevent clicking the No button from bubbling up and flipping the card
noBtn.addEventListener("click", (e) => {
    e.stopPropagation();
});

/* YES */
yesBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    questionPage.style.display = "none";
    lovePage.style.display = "block";
    pageState = 2; // Now on lovePage

    // hide the small title when showing the love page
    if (cardTitle) cardTitle.style.display = "none";

    message.innerHTML = `Duuuh as you should!!`;
    message.innerHTML += `<br><span style="font-size: 14px; color: #a57780;">As if you had a choice</span>`;

    // Set src first, then handle loading
    gif.src = "sz.png";
    gif.style.display = "block";
    
    gif.onload = () => {
        console.log("Image loaded successfully!");
    };
    gif.onerror = () => {
        console.error("Failed to load image:", gif.src);
        gif.style.display = "none";
    };

    music.play();

    spellName("ZEID", 10); // HEART CONFETTI
    updateBackButton();
});

/* HEART CONFETTI */
function createHeart(letter = "") {
    const heart = document.createElement("div");
    heart.classList.add("confetti-heart"); // renamed class

    // Spawn from top-left OR top-right of the screen
    const fromLeft = Math.random() < 0.5;

    if (fromLeft) {
        heart.style.left = Math.random() * (window.innerWidth * 0.3) + "px";
    } else {
        heart.style.left =
            window.innerWidth * 0.7 +
            Math.random() * (window.innerWidth * 0.3) + "px";
    }

    heart.style.top = "-30px";
    heart.style.animationDuration =
        Math.random() * 1.5 + 2.5 + "s";

    if (letter) {
        const span = document.createElement("span");
        span.textContent = letter;
        span.style.position = "absolute";
        span.style.top = "10%";
        span.style.left = "30%";
        span.style.transform = "rotate(-45deg)";
        span.style.color = "white";
        span.style.fontSize = "12px";
        span.style.fontFamily = "times new roman";
        span.style.fontWeight = "bold";
        heart.appendChild(span);
    }

    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 10000);
}


/* SPELL NAME WITH HEARTS */
function spellName(name, repeat, gap = 1000) {
    const cardRect = card.getBoundingClientRect();

    for (let r = 0; r < repeat; r++) {
        [...name].forEach((char, i) => {
            // stagger letters within a single repetition
            setTimeout(() => {
                // spread letters across width and height
                const x = Math.random() * cardRect.width;
                const y = Math.random() * cardRect.height / 2; // top half
                createHeart(char, x, y);
            }, i * 150 + r * gap);
        });
    }

    // extra random hearts for confetti
    for (let i = 0; i < 100; i++) {
        setTimeout(() => createHeart(), i * 200);
    }
}

