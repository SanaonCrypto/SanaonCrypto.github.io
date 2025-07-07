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
    
    // Search functionality
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
    
    // Initialize backend system
    console.log("Purchase System Initialized");
    console.log("New Accounts: 3 Purchases Enabled");
    console.log("Referral Program: ACTIVE");
});
