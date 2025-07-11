// scripts.js
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,zh-CN,ja,ru,ar,ur',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. Referral code copy functionality
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText("ONAY-PURCH-3");
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
    
    // 4. HTTPS enforcement (only in production)
    if(location.protocol !== 'https:' && location.hostname !== 'localhost') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
    
    // 5. Search functionality
    const imageSearchBtn = document.getElementById('image-search-btn');
    const voiceSearchBtn = document.getElementById('voice-search-btn');
    const searchInput = document.getElementById('search-input');
    
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
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                alert(`Searching for: ${this.value}`);
            }
        });
    }
    
    // 6. Night Mode Toggle
    const nightModeToggle = document.getElementById('night-mode-toggle');
    if (nightModeToggle) {
        nightModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('night-mode', this.checked);
            localStorage.setItem('nightMode', this.checked ? 'true' : 'false');
        });
        
        // Initialize night mode from saved preference
        if (localStorage.getItem('nightMode') === 'true') {
            nightModeToggle.checked = true;
            document.body.classList.add('night-mode');
        }
    }
    
    // 7. Google Translate Initialization
    function initGoogleTranslate() {
        if (document.getElementById('google_translate_element')) {
            if (typeof google !== 'undefined' && google.translate) {
                googleTranslateElementInit();
            } else {
                const script = document.createElement('script');
                script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                script.async = true;
                document.head.appendChild(script);
            }
        }
    }
    initGoogleTranslate();
    
    // 8. Seller Commission Calculator
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', function() {
            const sales = parseFloat(document.getElementById('sale-amount').value) || 0;
            const commissionRate = parseFloat(document.getElementById('commission-rate').value) || 15;
            const commission = sales * (commissionRate / 100);
            const earnings = sales - commission;
            
            document.getElementById('commission-amount').textContent = `$${commission.toFixed(2)}`;
            document.getElementById('earnings-amount').textContent = `$${earnings.toFixed(2)}`;
        });
        
        // Initial calculation
        if (document.getElementById('sale-amount')) {
            calcBtn.click();
        }
    }
    
    // 9. Auction countdown timers
    const countdownElements = document.querySelectorAll('.time-remaining');
    countdownElements.forEach(element => {
        // Set default end time (48 hours from now)
        if (!element.dataset.end) {
            const endDate = new Date();
            endDate.setHours(endDate.getHours() + 48);
            element.dataset.end = endDate.toISOString();
        }
        
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
            
            let countdownSpan = element.querySelector('.countdown');
            if (!countdownSpan) {
                countdownSpan = document.createElement('span');
                countdownSpan.className = 'countdown';
                element.appendChild(countdownSpan);
            }
            
            countdownSpan.textContent = `${days}d ${hours}h ${minutes}m`;
        }
        
        updateCountdown();
        setInterval(updateCountdown, 60000);
    });
    
    // 10. Bid placement functionality
    const bidButtons = document.querySelectorAll('.place-bid-btn');
    const bidModal = document.getElementById('bid-modal');
    const closeModal = document.querySelector('.close-modal');
    const confirmBid = document.querySelector('.confirm-bid');
    
    if (bidButtons.length && bidModal) {
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
            if (!bidAmount) {
                alert('Please enter a bid amount');
                return;
            }
            alert(`Bid of $${bidAmount} placed successfully!`);
            bidModal.style.display = 'none';
        });
    }
    
    // 11. Watchlist functionality
    const watchlistButtons = document.querySelectorAll('.watchlist-btn');
    watchlistButtons.forEach(button => {
        // Initialize icon
        if (!button.querySelector('i')) {
            button.innerHTML = '<i class="far fa-heart"></i>';
        }
        
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                this.style.color = 'var(--primary-red)';
                alert('Added to watchlist!');
            } else {
                icon.classList.replace('fas', 'far');
                this.style.color = '';
            }
        });
    });
    
    // 12. Subcategory navigation active state
    const subcategoryLinks = document.querySelectorAll('.subcategory-links a');
    if (subcategoryLinks.length > 0) {
        const currentPage = window.location.pathname.split('/').pop();
        
        subcategoryLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                subcategoryLinks.forEach(otherLink => {
                    otherLink.classList.remove('active');
                });
                this.classList.add('active');
                console.log(`Navigating to: ${this.getAttribute('href')}`);
            });
        });
    }
    
    console.log("Marketplace System Initialized");
});
