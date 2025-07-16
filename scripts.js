// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user state
    let currentUser = {
        isLoggedIn: false,
        userType: null, // 'buyer' or 'seller'
        purchases: {
            available: 0,
            completed: 0,
            earned: 0
        },
        referralCode: '',
        referrals: 0,
        optBalance: 0
    };
    
    // DOM Elements
    const signupBtn = document.getElementById('signup-btn');
    const googleSignupBtn = document.getElementById('google-signup-btn');
    const baiduSignupBtn = document.getElementById('baidu-signup-btn');
    const vkSignupBtn = document.getElementById('vk-signup-btn');
    const copyReferralBtn = document.getElementById('copy-referral-btn');
    const buyOptBtn = document.getElementById('buy-opt-btn');
    const bidModal = document.getElementById('bid-modal');
    const optModal = document.getElementById('opt-modal');
    const signinModal = document.getElementById('signin-modal');
    const signinLink = document.getElementById('sign-in-link');
    const closeModals = document.querySelectorAll('.close-modal');
    const confirmBidBtn = document.querySelector('.confirm-bid');
    const confirmOptPurchaseBtn = document.getElementById('confirm-opt-purchase');
    const optAmountInput = document.getElementById('opt-amount');
    const usdAmountInput = document.getElementById('usd-amount');
    const bidEquivalentInput = document.getElementById('bid-equivalent');
    
    // Sign In Modal Elements
    const userTypes = document.querySelectorAll('.user-type');
    const signinOptions = document.querySelectorAll('.signin-option');
    
    // Initialize Google Translate
    function googleTranslateElementInit() {
        if (typeof google !== 'undefined' && google.translate) {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,es,fr,de,zh-CN,ja,ru,ar,ur',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        }
    }
    
    // Load Google Translate API
    function loadGoogleTranslate() {
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
    }
    
    // Initialize Google Translate
    function initGoogleTranslate() {
        if (document.getElementById('google_translate_element')) {
            window.googleTranslateElementInit = googleTranslateElementInit;
            loadGoogleTranslate();
        }
    }
    
    // Night Mode Toggle
    const nightModeToggle = document.getElementById('night-mode-toggle');
    if (nightModeToggle) {
        // Initialize from localStorage
        if (localStorage.getItem('nightMode') === 'true') {
            nightModeToggle.checked = true;
            document.body.classList.add('night-mode');
        }
        
        nightModeToggle.addEventListener('change', function() {
            document.body.classList.toggle('night-mode', this.checked);
            localStorage.setItem('nightMode', this.checked);
        });
    }
    
    // User Authentication
    function signUpWithProvider(provider, userType) {
        // Simulated signup
        currentUser = {
            isLoggedIn: true,
            userType: userType,
            purchases: {
                available: 3, // Initial 3 free purchases
                completed: 0,
                earned: 0
            },
            referralCode: 'ONAY-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            referrals: 0,
            optBalance: 0
        };
        
        // Update UI
        document.getElementById('referral-code-display').textContent = currentUser.referralCode;
        document.getElementById('referral-count').textContent = currentUser.referrals;
        document.getElementById('bonus-purchases').textContent = currentUser.purchases.earned;
        
        // Redirect based on user type
        if (userType === 'buyer') {
            alert(`Welcome buyer! Account created with ${provider}. You have 3 free purchases.`);
            // In a real app, redirect to buyer dashboard
        } else {
            alert(`Welcome seller! Account created with ${provider}. You have 3 free purchases.`);
            // In a real app, redirect to seller dashboard
        }
    }
    
    // Referral Program
    function applyReferralCode(code) {
        if (!currentUser.isLoggedIn) {
            alert('Please sign in first');
            return;
        }
        
        if (code === currentUser.referralCode) {
            alert('You cannot use your own referral code');
            return;
        }
        
        // In a real system, we'd validate against the database
        currentUser.purchases.available += 1;
        currentUser.purchases.earned += 1;
        
        // Update UI
        document.getElementById('bonus-purchases').textContent = currentUser.purchases.earned;
        alert('Referral applied! You have received +1 free purchase.');
    }
    
    // Purchase System
    function completePurchase() {
        if (!currentUser.isLoggedIn) {
            alert('Please sign in first');
            return false;
        }
        
        if (currentUser.purchases.available > 0) {
            currentUser.purchases.available -= 1;
            currentUser.purchases.completed += 1;
            
            if (currentUser.purchases.available === 0) {
                alert('You have used all your purchases. Refer friends or buy OPT tokens for more bids!');
            }
            
            return true;
        }
        
        alert('No available purchases. Refer friends or buy OPT tokens for more bids!');
        return false;
    }
    
    // OPT Token System
    function buyOptTokens(amount) {
        const usdAmount = amount * 0.02;
        currentUser.optBalance += amount;
        alert(`Successfully purchased ${amount} OPT for $${usdAmount.toFixed(2)}!`);
    }
    
    function useOptForBids(amount) {
        if (currentUser.optBalance >= amount) {
            currentUser.optBalance -= amount;
            const bids = Math.floor(amount / 50);
            return bids;
        }
        return 0;
    }
    
    // Smart Contracts & Escrow
    function createEscrow(transactionValue) {
        const requiredOpt = Math.ceil(transactionValue * 0.015 / 0.02); // 1.5% fee in OPT
        
        if (currentUser.optBalance < requiredOpt) {
            alert(`You need ${requiredOpt} OPT for this escrow. You have ${currentUser.optBalance} OPT.`);
            return false;
        }
        
        currentUser.optBalance -= requiredOpt;
        return true;
    }
    
    // ====== SIGN IN MODAL FUNCTIONALITY ======
    // Show modal when sign-in link is clicked
    signinLink.addEventListener('click', function(e) {
        e.preventDefault();
        signinModal.style.display = 'flex';
    });
    
    // Close modal when X is clicked
    document.querySelector('.close-modal').addEventListener('click', function() {
        signinModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === signinModal) {
            signinModal.style.display = 'none';
        }
    });
    
    // User type selection
    userTypes.forEach(type => {
        type.addEventListener('click', function() {
            userTypes.forEach(t => t.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // Set buyer as default selection
    document.querySelector('.user-type.buyer').classList.add('selected');
    
    // Sign-in option functionality
    signinOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedType = document.querySelector('.user-type.selected');
            const userType = selectedType.classList.contains('buyer') ? 'buyer' : 'seller';
            const provider = this.classList.contains('google') ? 'Google' : 
                          this.classList.contains('baidu') ? 'Baidu' : 'VK';
            
            signUpWithProvider(provider, userType);
            signinModal.style.display = 'none';
        });
    });
    
    // ====== EVENT LISTENERS ======
    googleSignupBtn.addEventListener('click', () => signUpWithProvider('Google', 'buyer'));
    baiduSignupBtn.addEventListener('click', () => signUpWithProvider('Baidu', 'buyer'));
    vkSignupBtn.addEventListener('click', () => signUpWithProvider('VK', 'buyer'));
    
    copyReferralBtn.addEventListener('click', function() {
        if (!currentUser.isLoggedIn) {
            alert('Please sign in first');
            return;
        }
        
        navigator.clipboard.writeText(currentUser.referralCode);
        const originalHTML = copyReferralBtn.innerHTML;
        copyReferralBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyReferralBtn.innerHTML = originalHTML;
        }, 2000);
    });
    
    buyOptBtn.addEventListener('click', function() {
        optModal.style.display = 'block';
    });
    
    // Bid Modal
    document.querySelectorAll('.place-bid-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (!currentUser.isLoggedIn) {
                signinModal.style.display = 'flex';
                return;
            }
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const currentBid = parseFloat(productCard.querySelector('.bid-amount').textContent.replace('$', ''));
            
            document.getElementById('bid-item-name').textContent = productName;
            document.getElementById('min-bid').textContent = (currentBid + 1).toFixed(2);
            document.getElementById('bid-amount').min = currentBid + 1;
            bidModal.style.display = 'block';
        });
    });
    
    // OPT Modal Calculations
    optAmountInput.addEventListener('input', function() {
        const optAmount = parseInt(this.value) || 0;
        const usdAmount = optAmount * 0.02;
        const bids = Math.floor(optAmount / 50);
        
        usdAmountInput.value = `$${usdAmount.toFixed(2)}`;
        bidEquivalentInput.value = `${bids} ${bids === 1 ? 'bid' : 'bids'}`;
    });
    
    // Confirm OPT Purchase
    confirmOptPurchaseBtn.addEventListener('click', function() {
        const optAmount = parseInt(optAmountInput.value) || 0;
        if (optAmount >= 50) {
            buyOptTokens(optAmount);
            optModal.style.display = 'none';
        } else {
            alert('Minimum purchase is 50 OPT ($1.00)');
        }
    });
    
    // Confirm Bid
    confirmBidBtn.addEventListener('click', function() {
        if (!document.getElementById('terms-agree').checked) {
            alert('You must agree to the bidding terms');
            return;
        }
        
        if (completePurchase()) {
            alert('Bid placed successfully!');
            bidModal.style.display = 'none';
        }
    });
    
    // Close Modals
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            bidModal.style.display = 'none';
            optModal.style.display = 'none';
            signinModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === bidModal) {
            bidModal.style.display = 'none';
        }
        if (event.target === optModal) {
            optModal.style.display = 'none';
        }
        if (event.target === signinModal) {
            signinModal.style.display = 'none';
        }
    });
    
    // Initialize
    initGoogleTranslate();
    
    // Apply referral code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
        applyReferralCode(referralCode);
    }
    
    console.log("Marketplace System Initialized");
});
