// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // 1. Referral code copy functionality
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            alert("Referral code ONAY-PURCH-3 copied to clipboard!");
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Referral Code';
            }, 2000);
        });
    }
    
    // 2. Account creation simulation
    const accountButtons = document.querySelectorAll('.btn:not(.purchase-btn)');
    accountButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert("Account created! You can now complete 3 purchases. Start bidding now!");
        });
    });
    
    // 3. Purchase completion simulation
    const purchaseBadges = document.querySelectorAll('.purchase-badge:not(.completed)');
    purchaseBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            if (!this.classList.contains('completed')) {
                this.classList.add('completed');
                alert("Purchase completed! You can bid on your next item.");
            }
        });
    });
    
    // 4. HTTPS enforcement
    if(location.protocol !== 'https:') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
    
    // 5. Search functionality
    const imageSearchBtn = document.getElementById('image-search-btn');
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    
    if (imageSearchBtn) {
        imageSearchBtn.addEventListener('click', function() {
            alert('Image search activated! Upload an image to find similar products.');
        });
    }
    
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', function() {
            alert('Voice search activated! Start speaking now...');
        });
    }
    
    // 6. Night Mode Toggle
    const nightModeToggle = document.getElementById('night-mode-toggle');
    if (nightModeToggle) {
        nightModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('night-mode', this.checked);
            // Save preference to localStorage
            localStorage.setItem('nightMode', this.checked);
        });
        
        // Check for saved preference
        if (localStorage.getItem('nightMode') === 'true') {
            nightModeToggle.checked = true;
            document.body.classList.add('night-mode');
        }
    }
    
    // 7. Google Translate
    function googleTranslateElementInit() {
        new google.translate.TranslateElement(
            { pageLanguage: 'en', includedLanguages: 'en,es,fr,zh-CN,de,ru,ja,ar', layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
            'google_translate_element'
        );
    }
    
    // Load Google Translate script
    function loadGoogleTranslate() {
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(script);
    }
    
    // Only load if element exists
    if (document.getElementById('google_translate_element')) {
        loadGoogleTranslate();
    }
    
    // 8. Seller Commission Calculator
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', function() {
            const sales = parseFloat(document.getElementById('sale-amount').value) || 0;
            const commissionRate = parseFloat(document.getElementById('commission-rate').value) || 15;
            const commission = sales * (commissionRate / 100);
            const earnings = sales - commission;
            const profit = earnings * 10;
            
            document.getElementById('commission-amount').textContent = `$${commission.toFixed(2)}`;
            document.getElementById('earnings-amount').textContent = `$${earnings.toFixed(2)}`;
            document.getElementById('profit-amount').textContent = `$${profit.toFixed(2)}`;
        });
        
        // Trigger initial calculation
        if (document.getElementById('sale-amount')) {
            calcBtn.click();
        }
    }
    
    // 9. Electronics page specific functionality
    const countdownElements = document.querySelectorAll('.time-remaining');
    countdownElements.forEach(element => {
        const endTime = new Date(element.dataset.end).getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
                element.innerHTML = '<i class="fas fa-clock"></i> Auction Ended';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            element.querySelector('.countdown').textContent = `${days}d ${hours}h ${minutes}m`;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 60000);
    });
    
    // Bid placement functionality
    const bidButtons = document.querySelectorAll('.place-bid-btn');
    const bidModal = document.getElementById('bid-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmBid = document.querySelector('.confirm-bid');
    
    if (bidButtons.length) {
        bidButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                document.getElementById('bid-item-name').textContent = productName;
                bidModal.style.display = 'block';
            });
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            bidModal.style.display = 'none';
        });
    }
    
    if (confirmBid) {
        confirmBid.addEventListener('click', function() {
            const bidAmount = document.getElementById('bid-amount').value;
            alert(`Bid of $${bidAmount} placed successfully!`);
            bidModal.style.display = 'none';
        });
    }
    
    // Watchlist functionality
    const watchlistButtons = document.querySelectorAll('.watchlist-btn');
    watchlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = 'var(--primary-red)';
                alert('Added to watchlist!');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
            }
        });
    });
    
    // Initialize backend system
    console.log("Marketplace System Initialized");
});
