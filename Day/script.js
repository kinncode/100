// 等待 DOM 加載完成
document.addEventListener('DOMContentLoaded', function() {
    // 獲取元素
    const welcomeScreen = document.querySelector('.welcome-screen');
    const container = document.querySelector('.container');
    const content = document.querySelector('.content');
    const startBtn = document.getElementById('start-btn');
    const musicBtn = document.getElementById('music-btn');
    const musicText = document.getElementById('music-text');
    const surpriseBtn = document.getElementById('surprise-btn');
    const memoryBtn = document.getElementById('memory-btn');
    const loveLetterBtn = document.getElementById('love-letter-btn');
    const typedText = document.getElementById('typed-text');
    const backgroundMusic = document.getElementById('background-music');
    const starsContainer = document.getElementById('stars-container');
    const shootingStarsContainer = document.getElementById('shooting-stars-container');
    const firefliesContainer = document.getElementById('fireflies-container');
    const heartsContainer = document.querySelector('.hearts-container');
    const rosePetalsContainer = document.querySelector('.rose-petals-container');
    const diaryBtn = document.getElementById('diary-btn');
    const diaryModal = document.getElementById('diary-modal');
    
    // 創建模態框元素
    const loveLetterModal = document.createElement('div');
    loveLetterModal.className = 'love-letter-modal';
    document.body.appendChild(loveLetterModal);
    
    const memoryTimelineModal = document.createElement('div');
    memoryTimelineModal.className = 'memory-timeline-modal';
    document.body.appendChild(memoryTimelineModal);
    
    const surpriseModal = document.createElement('div');
    surpriseModal.className = 'surprise-modal';
    document.body.appendChild(surpriseModal);


    const diaryEntries = [
        { date: "2025-12-25",title: "等待一個告白", text: "得知你已明確暗示想在一起的訊息，但我未準備好對你告白", image: "images/1735801923592.jpg" },
        { date: "2025-12-26", title: "下定決心",text: "這天你說了很多，也努力暗示你對我的情感～我心裡其實明白，但又害怕那只是我的錯覺。我總是預想兩種結局。謝謝寶接納我，為我們選擇了最美的結局！", image: "images/20241226_201210.jpg" },
        { date: "2025-01-01", title: "告白的我",text: "我們正式在一起的第一天，謝謝你讓等待變得值得～那天晚上說完告白後看到你哭，我真的很心疼。我愛你。", image: "images/IMG_20250101_002149_689.webp" },
        { date: "2025-01-06", title: "慢慢地愛上你",text: "在一起後還是有些不習慣～不敢牽手、不敢抱抱，一切都很害羞。後來，我終於牽起寶寶那雙小小的手。", image: "images/20250106_223201.jpg" },
        { date: "2025-01-09", title: "接收分開",text: "剛好學期快結束~我們只好分開一段時間。", image: "images/20250109_214440.jpg" },
        { date: "2025-01-23", title: "一起去遊樂園",text: "我們一起去了劍湖山～真的很開心、很好玩！時間過得太快，又到了要分開的時候。可惜當天沒見到寶的媽媽。", image: "images/20250123_120034.jpg" },
        { date: "2025-02-14", title: "情人節之日",text: "情人節那天我們一樣在雲林到處逛～我也準備了禮物送給寶。回家後收到寶傳來的訊息，是交往以來他寫給我最長的一段話！那天她很體貼，即使腳有舊傷，還是陪我逛到最後～這些表現，讓我更想好好疼惜這個女孩。", image: "images/20250214_144011.jpg" },
        { date: "2025-02-20", title: "寶寶新髮型",text: "寶換了新髮型～根本就像日本女孩一樣可愛！",  image: "images/IMG_20250223_184800_029.webp" },
        { date: "2025-02-23", title: "可愛寶日常",text: "寶最近裝可愛！模仿很多怪怪聲音😅 我拍照時也會擺姿勢來照片超可愛啦～會療我！真的會害羞。",image: "images/20250220_212159.jpg"  },       
        { date: "2025-03-03",title: "為他準備第一套衣服", text: "子薰這陣子比平常多了點小女生的模樣😆 像是有點小脾氣、撒嬌、或是指著哪裡痛痛的小動作，超可愛！我給他穿上我準備的夏天衣服，雖然有點oversize，但真的很可愛。", image: "images/20250303_222830.jpg" },
        { date: "2025-03-14",title: "白色情人節", text: "白色情人節晚上，他悄悄傳來一張小卡片，老實說我真的驚喜到不行！超感動也超幸福，這是寶第一次寫卡片給我，我真的好愛🥴 那天放學後我們還一起待在圖書館討論英文、聊天，肚子餓了就一起去吃飯，還陪我看他喜歡的偶像節目～她的開朗笑容真的讓我心裡暖暖的。回去的路上，她還牽著我，一起開心地鬧著玩😆💖 謝謝你陪我到第73天！", image: "images/IMG_20250314_004829_089.jpg" }
    ];
    
    let currentPage = 0;
    
    // 顯示日記模態框
    function showDiaryModal() {
        diaryModal.classList.add('active');
        updateDiaryPage();
    }
    
    // 更新日記頁面
    function updateDiaryPage() {
        const leftPage = diaryModal.querySelector('.left-page');
        const rightPage = diaryModal.querySelector('.right-page');
        leftPage.innerHTML = '';
        rightPage.innerHTML = '';
    
        const entriesPerPage = 2;
        const startIndex = currentPage * entriesPerPage;
        const pageEntries = diaryEntries.slice(startIndex, startIndex + entriesPerPage);
    
        pageEntries.forEach((entry, index) => {
            // 依據索引決定放置在左頁或右頁
            const pageContainer = index === 0 ? leftPage : rightPage;
            pageContainer.innerHTML += `
                <article class="diary-entry">
                    <header class="diary-header">
                        <div class="diary-date">${entry.date}</div>
                        <p class="diary-title">${entry.title}</p>
                    </header>
                    <section class="diary-content">
                        <p class="diary-text">${entry.text}</p>
                        <img src="${entry.image}" alt="日記照片" class="diary-image">
                    </section>
                </article>
            `;
        });
    }
    
    // 翻頁事件
    diaryModal.querySelector('.prev-page').addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateDiaryPage();
        }
    });
    
    diaryModal.querySelector('.next-page').addEventListener('click', () => {
        const maxPage = Math.ceil(diaryEntries.length / 2) - 1;
        if (currentPage < maxPage) {
            currentPage++;
            updateDiaryPage();
        }
    });
    
    // 關閉模態框
    diaryModal.querySelector('.close-diary').addEventListener('click', () => {
        diaryModal.classList.remove('active');
        currentPage = 0;
    });
    

    // 綁定按鈕
    diaryBtn.addEventListener('click', showDiaryModal);

    // 浪漫文字消息數組
    const messages = [
        "每一天有你的陪伴，都是我生命中最美好的禮物。",
        "你的笑容是我每天醒來的動力。",
        "那時候我應該要察覺到的，你的心正經歷著哪一個季節。<<善意的競爭>>",
        "그때 알았어야 했는데, 너의 마음이 어느 계절을 지나고 있는지<<善意的競爭>>",
        "你是我唯一的朋友，我不允許任何人搶走你。<<善意的競爭>>",
        "劉在伊：「但我放了更強的藥只是維他命」<<善意的競爭>>",
        "劉在伊：「抓我的手別迷路了」<<善意的競爭>>​。",
        "劉在伊：「我從來不說假話，我只是把真香包裝成你想要的樣子。<<善意的競爭>>",
        "惠利：「別站在那裡讓我看看你的臉」<<善意的競爭>>"

    ];
    
    // 回憶時光數據
    const memories = [
        {
            title: '我們的第一次見面',
            image: 'images/retouch_2025031223250064.jpg'
        },
        {
            title: '可愛的你',
            image: 'images/20250223_184149.jpg'
        },
        {
            title: '第一次旅行',
            image: 'images/20250319_175618.jpg'
        },
        {
            title: '一起度過的生日',
            image: 'images/20250323_143615.jpg'
        },
        {
            title: '一起看星星',
            image: 'images/IMG_20250226_201601_022.webp'
        }
    ];

    // 添加打字聲音
    const typingSound = new Audio('typing-sound.mp3');
    
    // 開始按鈕點擊事件
    startBtn.addEventListener('click', function() {
        welcomeScreen.classList.add('fade-out');
        setTimeout(function() {
            welcomeScreen.style.display = 'none';
            container.classList.remove('hidden');
            content.classList.add('scale-in');
            
            // 嘗試播放背景音樂
            playBackgroundMusic();
            
            // 初始化所有效果
            initializeEffects();
            
            // 開始打字效果
            startTypingEffect();
        }, 1000);
    });
    // 設定起始日期為2025年1月1日
    const startDate = new Date('2025-01-01T00:00:00').getTime();

// 更新計時器的函數
    function updateTogetherTime() {
    const now = new Date().getTime();
    const distance = now - startDate;

    if (distance >= 0) {
        // 計算天、小時、分鐘和秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // 更新顯示內容
        document.getElementById('countdown-days').textContent = days;
        document.getElementById('countdown-hours').textContent = hours;
        document.getElementById('countdown-minutes').textContent = minutes;
        document.getElementById('countdown-seconds').textContent = seconds;
    } else {
        // 如果當前時間早於起始日期，顯示0
        document.getElementById('countdown-days').textContent = 0;
        document.getElementById('countdown-hours').textContent = 0;
        document.getElementById('countdown-minutes').textContent = 0;
        document.getElementById('countdown-seconds').textContent = 0;
    }
}

// 每秒更新計時器
setInterval(updateTogetherTime, 1000);
// 頁面載入時立即執行一次
updateTogetherTime();
    // 音樂按鈕點擊事件
    musicBtn.addEventListener('click', function() {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicText.textContent = '暫停音樂';
        } else {
            backgroundMusic.pause();
            musicText.textContent = '播放音樂';
        }
    });
    
    // 特別驚喜按鈕點擊事件
    surpriseBtn.addEventListener('click', function() {
        showSurpriseModal();
    });
    
    // 回憶時光按鈕點擊事件
    memoryBtn.addEventListener('click', function() {
        showMemoryTimeline();
    });
    
    // 愛的告白按鈕點擊事件
    loveLetterBtn.addEventListener('click', function() {
        showLoveLetter();
    });
    
    // 播放背景音樂
    function playBackgroundMusic() {
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // 自動播放成功
                musicText.textContent = '暫停音樂';
            }).catch(error => {
                // 自動播放失敗
                musicText.textContent = '播放音樂';
                console.log('自動播放受到瀏覽器限制，請點擊播放按鈕手動播放。');
            });
        }
    }
    
    // 初始化所有視覺效果
    function initializeEffects() {
        createStars();
        setInterval(createShootingStar, 8000);
        createFireflies();
        createFloatingHearts();
        createRosePetals();
    }
    
    // 創建星空背景
    function createStars() {
        for (let i = 0; i < 200; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // 隨機大小和位置
            const size = Math.random() * 3;
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            
            // 設置樣式
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${posX}px`;
            star.style.top = `${posY}px`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    // 創建流星效果
    function createShootingStar() {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // 隨機位置
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * (window.innerHeight / 2);
        
        // 設置樣式
        shootingStar.style.left = `${posX}px`;
        shootingStar.style.top = `${posY}px`;
        
        shootingStarsContainer.appendChild(shootingStar);
        
        // 動畫結束後移除元素
        setTimeout(() => {
            shootingStar.remove();
        }, 3000);
    }
    
    // 創建螢火蟲效果
    function createFireflies() {
        for (let i = 0; i < 50; i++) {
            const firefly = document.createElement('div');
            firefly.className = 'firefly';
            
            // 隨機位置和移動距離
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            const moveX = (Math.random() - 0.5) * 200;
            const moveY = (Math.random() - 0.5) * 200;
            
            // 設置樣式和自定義屬性
            firefly.style.left = `${posX}px`;
            firefly.style.top = `${posY}px`;
            firefly.style.setProperty('--move-x', `${moveX}px`);
            firefly.style.setProperty('--move-y', `${moveY}px`);
            firefly.style.animationDelay = `${Math.random() * 20}s`;
            
            firefliesContainer.appendChild(firefly);
        }
    }
    
    // 創建漂浮的心形
    function createFloatingHearts() {
        for (let i = 0; i < 20; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '<i class="fas fa-heart"></i>';
            
            // 隨機位置和移動距離
            const posX = Math.random() * window.innerWidth;
            const posY = Math.random() * window.innerHeight;
            const moveX = (Math.random() - 0.5) * 200;
            const moveY = -(Math.random() * 200 + 100);
            const rotate = (Math.random() - 0.5) * 360;
            
            // 設置樣式和自定義屬性
            heart.style.left = `${posX}px`;
            heart.style.top = `${posY}px`;
            heart.style.setProperty('--move-x', `${moveX}px`);
            heart.style.setProperty('--move-y', `${moveY}px`);
            heart.style.setProperty('--rotate', `${rotate}deg`);
            heart.style.animationDelay = `${Math.random() * 15}s`;
            
            heartsContainer.appendChild(heart);
        }
    }
    
    // 創建玫瑰花瓣飄落效果
    function createRosePetals() {
        setInterval(() => {
            const petal = document.createElement('div');
            petal.className = 'petal';
            
            // 隨機位置和移動距離
            const posX = Math.random() * window.innerWidth;
            const moveX = (Math.random() - 0.5) * 200;
            const rotate = Math.random() * 360;
            
            // 設置樣式和自定義屬性
            petal.style.left = `${posX}px`;
            petal.style.setProperty('--move-x', `${moveX}px`);
            petal.style.setProperty('--rotate', `${rotate}deg`);
            
            rosePetalsContainer.appendChild(petal);
            
            // 動畫結束後移除元素
            setTimeout(() => {
                petal.remove();
            }, 10000);
        }, 1000);
    }
    
    // 打字效果
    function startTypingEffect() {
        let currentMessageIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentMessage = messages[currentMessageIndex];
            
            if (isDeleting) {
                // 刪除文字
                typedText.textContent = currentMessage.substring(0, currentCharIndex - 1);
                currentCharIndex--;
                typingSpeed = 50;
            } else {
                // 添加文字
                typedText.textContent = currentMessage.substring(0, currentCharIndex + 1);
                currentCharIndex++;
                typingSpeed = 100;

            }
            
            // 判斷是否完成打字或刪除
            if (!isDeleting && currentCharIndex === currentMessage.length) {
                // 完成打字，等待一段時間後開始刪除
                isDeleting = true;
                typingSpeed = 3000;
            } else if (isDeleting && currentCharIndex === 0) {
                // 完成刪除，切換到下一條消息
                isDeleting = false;
                currentMessageIndex = (currentMessageIndex + 1) % messages.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // 開始打字效果
        setTimeout(type, 1000);
    }
    
    // 顯示愛的告白信
    function showLoveLetter() {
        loveLetterModal.innerHTML = `
            <div class="love-letter-content">
                <button class="close-letter"><i class="fas fa-times"></i></button>
                <div class="love-letter-text">
                    <h2>致我最愛的子薰</h2> 
                    <p>很快~我們已100天在一起了!。</p>
                    <p>在這100天發生好多事~我生活圈裡都有你的身影，這100天也讓我更了解到你不同層!</p>
                    <p>每一個有你的日子都如此美好。每天能和你一起努力，天天看到你可愛的互動、感受到你溫暖的照顧，還有你撒嬌的小孩子氣，讓我的生活多了許多樂趣與幸福 😊</p>
                    <p>我知道自己給你的愛，可能還不夠，讓你受了些委屈、也曾生氣…但我願用我全部的愛，一點一滴地補償你，只希望你感受到我的心意。</p>
                    <p>最後!!!我想告訴你，我愛你，不僅僅是現在，還有未來的每一天。無論生活如何變化，我都願意與你一同面對，一同成長，一同創造屬於我們的美好回憶。</p>
                    <div class="love-letter-signature">永遠愛你子薰 ❤️</div>
                </div>
            </div>
        `;
        
        loveLetterModal.classList.add('active');
        
        // 關閉按鈕事件
        const closeBtn = loveLetterModal.querySelector('.close-letter');
        closeBtn.addEventListener('click', function() {
            loveLetterModal.classList.remove('active');
        });
        
        // 點擊模態框背景區域也可以關閉
        loveLetterModal.addEventListener('click', function(e) {
            if (e.target === loveLetterModal) {
                loveLetterModal.classList.remove('active');
            }
        });
    }
    

    function showMemoryTimeline() {
        // 建立回憶時光線內容
        let memoryContent = `
            <button class="close-memory"><i class="fas fa-times"></i></button>
            <div class="memory-container">
        `;
        
        const totalMemories = memories.length;
        const radius = 350; // 圓形半徑
        
        memories.forEach((memory, index) => {
            const angle = (index / totalMemories) * 360;
            const radians = angle * Math.PI / 180;
            const x = radius * Math.sin(radians);
            const z = radius * Math.cos(radians);
            
            memoryContent += `
                <div class="memory-card" style="transform: translateX(${x}px) translateZ(${z}px) rotateY(${angle}deg)">
                    <img src="${memory.image}" alt="${memory.title}">
                    <div class="memory-card-content">
                    </div>
                </div>
            `;
        });
        
        memoryContent += `</div>`;
        
        memoryTimelineModal.innerHTML = memoryContent;
        memoryTimelineModal.classList.add('active');
        
        const memoryContainer = memoryTimelineModal.querySelector('.memory-container');
        let targetRotateY = 0;   // 累積目標旋轉角度
        let currentRotateY = 0;  // 當前實際顯示的旋轉角度
        let rotationSpeed = 0.2; // 每幀增量
        
        // 使用插值平滑旋轉
        function rotateMemories() {
            targetRotateY += rotationSpeed;
            // 每幀讓 currentRotateY 慢慢接近 targetRotateY
            currentRotateY += (targetRotateY - currentRotateY) * 0.1;
            memoryContainer.style.transform = `rotateY(${currentRotateY}deg)`;
            
            if (memoryTimelineModal.classList.contains('active')) {
                requestAnimationFrame(rotateMemories);
            }
        }
        
        rotateMemories();
        
        // 關閉按鈕事件
        const closeBtn = memoryTimelineModal.querySelector('.close-memory');
        closeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            memoryTimelineModal.classList.remove('active');
        });
        
        // 點擊背景關閉
        memoryTimelineModal.addEventListener('click', function(e) {
            if (e.target === memoryTimelineModal) {
                memoryTimelineModal.classList.remove('active');
            }
        });
        
        // 鍵盤 ESC 鍵關閉
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && memoryTimelineModal.classList.contains('active')) {
                memoryTimelineModal.classList.remove('active');
            }
        });
    }
    
    


    document.getElementById('surprise-btn').addEventListener('click', showSurpriseModal);
    
    function showSurpriseModal() {
        // 停止背景音樂
        const backgroundMusic = document.getElementById('background-music');
        if (!backgroundMusic.paused) {
            backgroundMusic.pause();
        }
    
        const surpriseModal = document.getElementById('surprise-modal');
        const warnings = [
            "你確定要看嗎？真的很閃喔！😳",
            "還想繼續？這影片會讓你甜到蛀牙！🍬",
            "最後警告！看了可能會戀愛上我喔！❤️"
        ];
        let step = 0;
    
        function renderWarning() {
            surpriseModal.innerHTML = `
                <div class="surprise-box">
                    <p>${warnings[step]}</p>
                    <button id="next-warning" class="btn-warning">我要看！</button>
                </div>
            `;
            surpriseModal.classList.add('active');
    
            document.getElementById('next-warning').addEventListener('click', () => {
                step++;
                if (step < warnings.length) {
                    renderWarning();
                } else {
                    showFinalSurprise();
                }
            });
        }
    
        renderWarning();
    
        function showFinalSurprise() {
            surpriseModal.innerHTML = `
                <div class="surprise-content">
                    <button class="close-surprise"><i class="fas fa-times"></i></button>
           
                    <div class="video-wrapper">
                        <video class="surprise-video" controls autoplay>
                            <source src="sss.mp4" type="video/mp4">
                            您的瀏覽器不支援播放此影片。
                        </video>
                    </div>
                    <div class="heart-rain"></div>
                </div>
            `;
    
            // 播放影片後關閉背景音樂（再次保險）
            const video = surpriseModal.querySelector('video');
            video.addEventListener('play', () => {
                if (!backgroundMusic.paused) {
                    backgroundMusic.pause();
                }
            });
            let popupTriggered = false;

            // 建立可愛彈出元素
            const cutePopup = document.createElement('div');
            cutePopup.className = 'cute-popup hidden';
            cutePopup.innerHTML = `
                <img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExazFvbG1uZmR0b3M0czBnazVxeGZiMGlmMDBxcGZ1NHd1djZvNXE4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/jUKgHmzGqEo37AxKmq/giphy.gif" alt="害羞小愛心" />
                <p>流口水了～///</p>
            `;
            surpriseModal.querySelector('.surprise-content').appendChild(cutePopup);
            
            // 監聽播放進度，10 秒時出現彈出動畫
            video.addEventListener('timeupdate', () => {
                if (video.currentTime >= 10 && !popupTriggered) {
                    cutePopup.classList.remove('hidden');
                    popupTriggered = true;
            
                    setTimeout(() => {
                        cutePopup.classList.add('hidden');
                    }, 4000); // 顯示 4 秒後自動關閉
                }
            });
            const heartRain = surpriseModal.querySelector('.heart-rain');
            function createHeartRain() {
                for (let i = 0; i < 50; i++) {
                    setTimeout(() => {
                        const heart = document.createElement('div');
                        heart.className = 'rain-heart';
                        heart.innerHTML = '<i class="fas fa-heart"></i>';
                        const posX = Math.random() * window.innerWidth;
                        const moveX = (Math.random() - 0.5) * 100;
                        const rotate = Math.random() * 360;
                        heart.style.left = `${posX}px`;
                        heart.style.setProperty('--move-x', `${moveX}px`);
                        heart.style.setProperty('--rotate', `${rotate}deg`);
                        heart.style.animationDelay = `${Math.random() * 2}s`;
                        heartRain.appendChild(heart);
                        setTimeout(() => heart.remove(), 3000);
                    }, i * 100);
                }
            }
    
            createHeartRain();
            const heartRainInterval = setInterval(createHeartRain, 3000);
    
            surpriseModal.querySelector('.close-surprise').addEventListener('click', () => {
                surpriseModal.classList.remove('active');
                clearInterval(heartRainInterval);
                video.pause();
                video.currentTime = 0;
            });
        }
    }
    

    
    
    
    // 窗口大小變化時重新調整效果
    window.addEventListener('resize', function() {
        // 清空容器
        starsContainer.innerHTML = '';
        firefliesContainer.innerHTML = '';
        heartsContainer.innerHTML = '';
        
        // 重新創建效果
        createStars();
        createFireflies();
        createFloatingHearts();
    });
});

