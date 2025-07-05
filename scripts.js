document.addEventListener('DOMContentLoaded', function() {
    // Copy referral code
    const copyBtn = document.querySelector('.copy-btn');
    copyBtn.addEventListener('click', function() {
        // In a real app, this would copy to clipboard
        alert("Referral code ONAY-PURCH-3 copied to clipboard!");
        
        // Animation effect
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Referral Code';
        }, 2000);
    });
    
    // Create account button
    const createAccountBtn = document.querySelector('.btn');
    createAccountBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert("Account created! You can now complete 3 purchases. Start bidding now!");
    });
    
    // Purchase simulation
    const purchaseBadges = document.querySelectorAll('.purchase-badge:not(.completed)');
    purchaseBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            if (!this.classList.contains('completed')) {
                this.classList.add('completed');
                alert("Purchase completed! You can bid on your next item.");
            }
        });
    });
    
    // Initialize backend system
    console.log("Purchase System Initialized");
    console.log("New Accounts: 3 Purchases Enabled");
    console.log("Referral Program: ACTIVE");
    
    // Force HTTPS redirect
    if(location.protocol !== 'https:') {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
    }
});
