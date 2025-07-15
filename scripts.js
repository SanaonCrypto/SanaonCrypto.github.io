// scripts.js - Recompiled with all features
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,zh-CN,ja,ru,ar,ur',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Translate
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

    // Initialize user data
    let user = JSON.parse(localStorage.getItem('userData')) || {
        name: "Guest",
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        bids: 0,
        optBalance: 0,
        purchases: {
            available: 0,
            completed: 0,
            bonus: 0
        },
        referralCode: 'ONAY-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        transactions: []
    };
    
    // Update UI display
    function updateUI() {
        // Update header purchase tracker
        const headerPurchaseElement = document.getElementById('header-purchase-count');
        if (headerPurchaseElement) {
            headerPurchaseElement.textContent = user.purchases.available;
        }
        
        // Update account link
        const signInLink = document.getElementById('sign-in-link');
        const accountLink = document.getElementById('account-link');
        if (signInLink && accountLink) {
            if (user.purchases.available > 0 || user.bids > 0) {
                signInLink.style.display = 'none';
                accountLink.style.display = 'inline-flex';
            } else {
                signInLink.style.display = 'inline-flex';
                accountLink.style.display = 'none';
            }
        }
        
        // Update dashboard if on account page
        if (window.location.pathname.includes('account.html')) {
            updateDashboard();
        }
    }
    
    // Update dashboard display
    function updateDashboard() {
        // Update user info
        const userName = document.getElementById('user-name');
        const joinDate = document.getElementById('join-date');
        if (userName) userName.textContent = user.name;
        if (joinDate) joinDate.textContent = user.joinDate;
        
        // Update OPT balance
        const optBalance = document.getElementById('opt-balance');
        if (optBalance) optBalance.textContent = user.optBalance;
        
        // Update bid count
        const bidCount = document.getElementById('bid-count');
        if (bidCount) bidCount.textContent = user.bids;
        
        // Update purchase count
        const purchaseCount = document.getElementById('purchase-count');
        if (purchaseCount) purchaseCount.textContent = user.purchases.available;
        
        // Update referral code
        const referralCode = document.getElementById('referral-code');
        if (referralCode) referralCode.textContent = user.referralCode;
        
        // Update purchase badges
        const purchaseBadges = document.querySelectorAll('.purchase-badge');
        purchaseBadges.forEach((badge, index) => {
            if (index < user.purchases.completed) {
                badge.classList.add('completed');
            } else {
                badge.classList.remove('completed');
            }
            
            if (index >= 3) {
                badge.textContent = "+";
                badge.style.display = user.purchases.bonus > 0 ? 'flex' : 'none';
            }
        });
        
        // Update transaction history
        const transactionList = document.getElementById('transaction-list');
        if (transactionList) {
            transactionList.innerHTML = '';
            
            user.transactions.slice(0, 5).forEach(transaction => {
                const transactionItem = document.createElement('div');
                transactionItem.className = 'transaction-item';
                
                const amountClass = transaction.type === 'credit' ? 'credit' : 'debit';
                const amountSign = transaction.type === 'credit' ? '+' : '-';
                const amountValue = transaction.amount > 0 ? 
                    `${amountSign}${transaction.amount}` : 
                    (transaction.type === 'credit' ? '+' : '-');
                
                transactionItem.innerHTML = `
                    <div class="transaction-details">
                        <div class="transaction-description">${transaction.description}</div>
                        <div class="transaction-date">${formatDate(transaction.timestamp)}</div>
                    </div>
                    <div class="transaction-amount ${amountClass}">${amountValue}</div>
                `;
                
                transactionList.appendChild(transactionItem);
            });
        }
        
        // Save to localStorage
        localStorage.setItem('userData', JSON.stringify(user));
    }
    
    // Format date for display
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today, ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday, ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        } else {
            return date.toLocaleDateString() + ', ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
    }
    
    // Handle Google signup simulation
    const googleSignupButtons = document.querySelectorAll('.google-signup');
    googleSignupButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create new user
            user = {
                name: "New User",
                joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                bids: 0,
                optBalance: 0,
                purchases: {
                    available: 3,
                    completed: 0,
                    bonus: 0
                },
                referralCode: 'ONAY-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                transactions: [
                    { 
                        type: 'credit', 
                        amount: 0, 
                        description: 'Account created with 3 purchase rights', 
                        timestamp: new Date().toISOString() 
                    }
                ]
            };
            
            // Save user and redirect
            localStorage.setItem('userData', JSON.stringify(user));
            window.location.href = 'account.html';
        });
    });
    
    // Handle bid purchase
    const buyBidButtons = document.querySelectorAll('.buy-bids-btn');
    buyBidButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bidAmount = parseInt(this.dataset.amount) || 10;
            const optCost = bidAmount; // 1 OPT = 1 bid
            
            if (user.optBalance < optCost) {
                alert(`Insufficient OPT! You need ${optCost} OPT to purchase ${bidAmount} bids.`);
                return;
            }
            
            user.optBalance -= opt极速快递
            user.bids += bidAmount;
            
            // Add transaction
            user.transactions.unshift({
                type: 'debit',
                amount: optCost,
                description: `Purchased ${bidAmount} bids`,
                timestamp: new Date().toISOString()
            });
            
            updateDashboard();
            updateUI();
            alert(`${bidAmount} bids purchased with OPT!`);
        });
    });
    
    // Handle OPT purchase
    const buyOptButton = document.getElementById('buy-opt-btn');
    if (buyOptButton) {
        buyOptButton.addEventListener('click', function() {
            const optAmount = 100; // Default purchase amount
            
            user.optBalance += optAmount;
            
            // Add transaction
            user.transactions.unshift({
                type: 'credit',
                amount: optAmount,
                description: `Purchased ${optAmount} OPT`,
                timestamp: new Date().toISOString()
            });
            
            updateDashboard();
            updateUI();
            alert(`${optAmount} OPT purchased!`);
        });
    }
    
    // Handle referral code copy
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            navigator.clipboard.writeText(user.referralCode);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Referral Code';
            }, 2000);
        });
    }
    
    // Handle purchase simulation
    const purchaseBadges = document.querySelectorAll('.purchase-badge');
    purchaseBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            if (!this.classList.contains('completed') && user.purchases.available > 0) {
                user.purchases.completed++;
                user.purchases.available--;
                
                // Add transaction
                user.transactions.unshift({
                    type: 'debit',
                    amount: 0,
                    description: 'Completed purchase',
                    timestamp: new Date().toISOString()
                });
                
                updateDashboard();
                updateUI();
                alert("Purchase completed! You can bid on your next item.");
            }
        });
    });
    
    // Handle referral simulation
    const simulateReferralBtn = document.getElementById('simulate-referral');
    if (simulateReferralBtn) {
        simulateReferralBtn.addEventListener('click', function() {
            user.purchases.available++;
            user.purchases.bonus++;
            user.optBalance += 10;
            
            // Add transactions
            user.transactions.unshift({
                type: 'credit',
                amount: 0,
                description: 'Referral bonus purchase right',
                timestamp: new Date().toISOString()
            });
            
            user.transactions.unshift({
                type: 'credit',
                amount: 10,
                description: 'Referral bonus OPT',
                timestamp: new Date().toISOString()
            });
            
            updateDashboard();
            updateUI();
            alert("Referral successful! You received 10 OPT and an extra purchase right.");
        });
    }
    
    // Night Mode Toggle
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
    
    // Initial UI update
    updateUI();
    if (window.location.pathname.includes('account.html')) {
        updateDashboard();
    }
});
