// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const header = document.querySelector('header');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    hamburger.classList.toggle('active');
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Dark Mode Toggle
// Initialize theme immediately
(function initTheme() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
})();

// Wait for DOM to be ready before accessing elements
function initDarkMode() {
    const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
    
    // Ensure theme is set
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);

// Update icon based on theme
function updateThemeIcon() {
        if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
        if (!icon) return;
    if (html.getAttribute('data-theme') === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

    // Update icon immediately
updateThemeIcon();

// Toggle theme
    if (themeToggle) {
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    
    // Add animation
    themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDarkMode);
} else {
    initDarkMode();
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active Navigation on Scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Add shadow to navbar on scroll
    const navbar = document.querySelector('header');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.product-card, .service-card, .feature-box').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add Share Buttons to Product Cards dynamically
function addShareButtonsToProducts() {
    document.querySelectorAll('.product-card').forEach(card => {
        const productInfo = card.querySelector('.product-info');
        if (!productInfo) return;
        
        // Check if share buttons already exist
        if (productInfo.querySelector('.product-share')) return;
        
        const productTitle = card.querySelector('h3')?.textContent || 'منتج';
        const sectionId = card.closest('section')?.id || '';
        const productUrl = `https://globalsmartsecurity.com/${sectionId ? '#' + sectionId : ''}`;
        
        const shareDiv = document.createElement('div');
        shareDiv.className = 'product-share';
        shareDiv.innerHTML = `
            <span>مشاركة:</span>
            <button class="share-btn" onclick="shareProduct('${productTitle}', '${productUrl}')" title="مشاركة عبر واتساب">
                <i class="fab fa-whatsapp"></i>
            </button>
            <button class="share-btn" onclick="shareProduct('${productTitle}', '${productUrl}', 'facebook')" title="مشاركة على فيسبوك">
                <i class="fab fa-facebook-f"></i>
            </button>
            <button class="share-btn" onclick="copyProductLink('${productUrl}')" title="نسخ الرابط">
                <i class="fas fa-link"></i>
            </button>
        `;
        
        productInfo.appendChild(shareDiv);
    });
}

// Initialize share buttons when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addShareButtonsToProducts);
} else {
    addShareButtonsToProducts();
}

// Copy to Clipboard Function
function copyToClipboard(text, button) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i>';
            showToast('تم النسخ!', 'تم نسخ ' + text + ' إلى الحافظة', 'success', 2000);
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = originalHTML;
            }, 2000);
        }).catch(() => {
            showToast('خطأ!', 'فشل نسخ النص', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            const originalHTML = button.innerHTML;
            button.classList.add('copied');
            button.innerHTML = '<i class="fas fa-check"></i>';
            showToast('تم النسخ!', 'تم نسخ ' + text + ' إلى الحافظة', 'success', 2000);
            
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            showToast('خطأ!', 'فشل نسخ النص', 'error');
        }
        document.body.removeChild(textArea);
    }
}

// Smooth Scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Contact Form Handling with Validation
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

// Character counter for message
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');
const charCounter = document.querySelector('.char-counter');

if (messageTextarea && charCount) {
    messageTextarea.addEventListener('input', () => {
        const length = messageTextarea.value.length;
        charCount.textContent = length;
        
        // Update counter color
        charCounter.classList.remove('warning', 'error');
        if (length > 450) {
            charCounter.classList.add('error');
        } else if (length > 400) {
            charCounter.classList.add('warning');
        }
    });
}

// Form validation
function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(error => {
        error.classList.remove('show');
        error.textContent = '';
    });
    
    // Validate name
    if (!name.value.trim() || name.value.trim().length < 2) {
        showFieldError('nameError', 'الاسم يجب أن يكون على الأقل حرفين');
        isValid = false;
    }
    
    // Validate phone
    const phoneRegex = /^(\+20|0)?1[0-9]{9}$/;
    const cleanPhone = phone.value.replace(/[\s-]/g, '');
    if (!phone.value.trim() || !phoneRegex.test(cleanPhone)) {
        showFieldError('phoneError', 'يرجى إدخال رقم هاتف مصري صحيح (مثال: 01123456789)');
        isValid = false;
    }
    
    // Validate email (if provided)
    if (email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showFieldError('emailError', 'يرجى إدخال بريد إلكتروني صحيح');
            isValid = false;
        }
    }
    
    // Validate message
    if (!message.value.trim() || message.value.trim().length < 10) {
        showFieldError('messageError', 'الرسالة يجب أن تكون على الأقل 10 أحرف');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

if (contactForm) {
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
        // Validate form
        if (!validateForm()) {
            showToast('خطأ في التحقق', 'يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
    // Create WhatsApp message
    const whatsappMessage = `مرحباً، أنا ${name}%0A` +
                           `رقم الهاتف: ${phone}%0A` +
                           `${email ? `البريد الإلكتروني: ${email}%0A` : ''}` +
                           `الرسالة: ${message}`;
    
    // Open WhatsApp
    window.open(`https://wa.me/201121153344?text=${whatsappMessage}`, '_blank');
    
    // Show success message
            showToast('نجح!', 'شكراً لتواصلك معنا! سيتم فتح واتساب لإرسال رسالتك.', 'success');
    
    // Reset form
    contactForm.reset();
            charCount.textContent = '0';
            charCounter.classList.remove('warning', 'error');
            document.querySelectorAll('.error-message').forEach(error => {
                error.classList.remove('show');
            });
            
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 1000);
    });
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim()) {
                validateForm();
            }
        });
        
        input.addEventListener('input', () => {
            const errorId = input.id + 'Error';
            const errorElement = document.getElementById(errorId);
            if (errorElement && input.validity.valid) {
                errorElement.classList.remove('show');
            }
        });
    });
}

// Share Product Function
function shareProduct(productName, url, platform = 'whatsapp') {
    const shareText = `شاهد ${productName} من Global Smart Security: ${url}`;
    
    if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`, '_blank');
    }
    
    showToast('تم المشاركة!', `جاري فتح ${platform === 'whatsapp' ? 'واتساب' : platform === 'facebook' ? 'فيسبوك' : 'تويتر'}...`, 'info');
}

// Copy Product Link
function copyProductLink(url) {
    const button = event.target.closest('.share-btn');
    copyToClipboard(url, button);
}

// Chatbot Functionality
function initChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotBadge = document.querySelector('.chatbot-badge');
    const chatbotContainer = document.getElementById('chatbotContainer');
    
    // Ensure chatbot is visible
    if (chatbotContainer) {
        chatbotContainer.style.display = 'block';
        chatbotContainer.style.visibility = 'visible';
        chatbotContainer.style.opacity = '1';
    }
    
    if (chatbotToggle) {
        chatbotToggle.style.display = 'flex';
        chatbotToggle.style.visibility = 'visible';
        chatbotToggle.style.opacity = '1';
    }
    
    // Toggle chatbot window
    if (chatbotToggle && chatbotWindow) {
        chatbotToggle.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            if (chatbotWindow.classList.contains('active')) {
                if (chatbotBadge) chatbotBadge.style.display = 'none';
                if (chatbotInput) chatbotInput.focus();
            }
        });
    }
    
    return { chatbotToggle, chatbotWindow, chatbotClose, chatbotInput, chatbotSend, chatbotMessages, chatbotBadge };
}

// Initialize chatbot when DOM is ready
let chatbotElements = {};
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatbotElements = initChatbot();
    });
} else {
    chatbotElements = initChatbot();
}

// Close chatbot
if (chatbotElements.chatbotClose && chatbotElements.chatbotWindow) {
    chatbotElements.chatbotClose.addEventListener('click', () => {
        chatbotElements.chatbotWindow.classList.remove('active');
    });
}

// Chatbot responses
const chatbotResponses = {
    'خدمات': 'نقدم مجموعة شاملة من الخدمات الأمنية:\n\n📹 كاميرات المراقبة (PTZ، داخلية، خارجية)\n💾 أجهزة DVR & NVR للتسجيل\n💰 أنظمة نقاط البيع (POS)\n📊 أنظمة الحسابات\n🎨 خدمات التصميم الجرافيكي\n\nأي خدمة تريد معرفة المزيد عنها؟',
    'سعر': 'أسعارنا تنافسية وتختلف حسب المتطلبات. للحصول على عرض سعر دقيق، يرجى التواصل معنا:\n\n📞 الهاتف: +20 112 1153 344\n📧 البريد: info@globalsmartsecurity.com\n💬 واتساب: متاح 24/7\n\nنوفر استشارة مجانية لتقييم احتياجاتك!',
    'كاميرا': 'نوفر أنواع مختلفة من الكاميرات:\n\n🎥 كاميرات PTZ المتحركة - للمساحات الواسعة\n🏠 كاميرات داخلية - للمحلات والمكاتب\n🛡️ كاميرات خارجية - مقاومة للعوامل الجوية\n\nجميع الكاميرات بجودة عالية ودعم رؤية ليلية!',
    'تواصل': 'يمكنك التواصل معنا عبر:\n\n📞 الهاتف: +20 112 1153 344\n📧 البريد: info@globalsmartsecurity.com\n💬 واتساب: اضغط على زر واتساب في الموقع\n🌐 فيسبوك: متاح على صفحتنا\n\nنرد خلال 24 ساعة!',
    'موقع': 'نحن متواجدون في مصر ونساعد عملاءنا في جميع أنحاء البلاد. يمكننا زيارة موقعك لتقييم احتياجاتك وتقديم الحلول المناسبة.',
    'default': 'شكراً لسؤالك! يمكنني مساعدتك في:\n\n✅ معلومات عن خدماتنا\n💰 الأسعار والعروض\n📞 طرق التواصل\n📹 أنواع الكاميرات\n💾 أجهزة التسجيل\n\nاكتب سؤالك أو اختر من الأزرار السريعة!'
};

// Get bot response
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('خدمات') || message.includes('خدمة') || message.includes('ماذا تقدم')) {
        return chatbotResponses['خدمات'];
    } else if (message.includes('سعر') || message.includes('ثمن') || message.includes('تكلفة') || message.includes('كم')) {
        return chatbotResponses['سعر'];
    } else if (message.includes('كاميرا') || message.includes('كاميرات') || message.includes('مراقبة')) {
        return chatbotResponses['كاميرا'];
    } else if (message.includes('تواصل') || message.includes('اتصل') || message.includes('راسل') || message.includes('كيف')) {
        return chatbotResponses['تواصل'];
    } else if (message.includes('موقع') || message.includes('عنوان') || message.includes('مكان')) {
        return chatbotResponses['موقع'];
    } else {
        return chatbotResponses['default'];
    }
}

// Add message to chat
function addMessage(text, isUser = false) {
    const messagesContainer = chatbotElements.chatbotMessages || document.getElementById('chatbotMessages');
    if (!messagesContainer) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = `<i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>`;
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const textP = document.createElement('p');
    textP.textContent = text;
    content.appendChild(textP);
    
    const time = document.createElement('span');
    time.className = 'message-time';
    const now = new Date();
    time.textContent = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    content.appendChild(time);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

// Send message
function sendMessage() {
    const input = chatbotElements.chatbotInput || document.getElementById('chatbotInput');
    const sendBtn = chatbotElements.chatbotSend || document.getElementById('chatbotSend');
    const messagesContainer = chatbotElements.chatbotMessages || document.getElementById('chatbotMessages');
    
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    // Add user message
    addMessage(message, true);
    input.value = '';
    
    // Disable send button
    if (sendBtn) sendBtn.disabled = true;
    
    // Show typing indicator
    const typingIndicator = addMessage('يكتب...', false);
    
    // Simulate bot thinking
    setTimeout(() => {
        if (typingIndicator) typingIndicator.remove();
        
        // Get bot response
        const botResponse = getBotResponse(message);
        
        // Add bot response with typing effect
        const botMessage = addMessage('', false);
        if (!botMessage) return;
        
        const botText = botMessage.querySelector('p');
        if (!botText) return;
        
        let index = 0;
        const typingInterval = setInterval(() => {
            if (index < botResponse.length) {
                botText.textContent = botResponse.substring(0, index + 1);
                index++;
                if (messagesContainer) {
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                }
            } else {
                clearInterval(typingInterval);
                if (sendBtn) sendBtn.disabled = false;
                if (input) input.focus();
            }
        }, 30);
    }, 1000);
}

// Send quick message
function sendQuickMessage(message) {
    const input = chatbotElements.chatbotInput || document.getElementById('chatbotInput');
    if (input) {
        input.value = message;
        sendMessage();
    }
}

// Setup event listeners
function setupChatbotListeners() {
    const sendBtn = chatbotElements.chatbotSend || document.getElementById('chatbotSend');
    const input = chatbotElements.chatbotInput || document.getElementById('chatbotInput');
    const messagesContainer = chatbotElements.chatbotMessages || document.getElementById('chatbotMessages');
    const badge = chatbotElements.chatbotBadge || document.querySelector('.chatbot-badge');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        input.addEventListener('input', () => {
            if (sendBtn) {
                sendBtn.disabled = !input.value.trim();
            }
        });
    }
    
    // Hide badge after first interaction
    let badgeHidden = false;
    if (messagesContainer) {
        const observer = new MutationObserver(() => {
            if (!badgeHidden && messagesContainer.children.length > 1) {
                badgeHidden = true;
                if (badge) {
                    badge.style.display = 'none';
                }
            }
        });
        observer.observe(messagesContainer, { childList: true });
    }
}

// Initialize listeners when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupChatbotListeners);
} else {
    setupChatbotListeners();
}

// Toast Notification System
function showToast(title, message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type] || icons.success} toast-icon"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after duration
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }, duration);
}

// Prevent browser from restoring scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Scroll to top immediately on page load/refresh (before everything loads)
window.scrollTo(0, 0);
document.documentElement.scrollTop = 0;
document.body.scrollTop = 0;

// Scroll to top on page load/refresh
window.addEventListener('load', () => {
    // Force scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Also scroll to top when page is shown (for browser back/forward and refresh)
window.addEventListener('pageshow', (event) => {
    // Always scroll to top, whether from cache or not
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // If page was loaded from cache (back/forward navigation)
    if (event.persisted) {
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        }, 0);
    }
});

// Additional scroll to top on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Search Toggle
const searchToggle = document.getElementById('searchToggle');
const searchBox = document.getElementById('searchBox');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchToggle.addEventListener('click', () => {
    searchBox.classList.add('active');
    setTimeout(() => {
        searchInput.focus();
    }, 100);
});

searchClose.addEventListener('click', () => {
    searchBox.classList.remove('active');
    searchInput.value = '';
});

// Close search on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchBox.classList.contains('active')) {
        searchBox.classList.remove('active');
        searchInput.value = '';
    }
});

// Search functionality
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            // Simple search - scroll to matching section
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const sectionText = section.textContent.toLowerCase();
                if (sectionText.includes(searchTerm)) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    searchBox.classList.remove('active');
                }
            });
        }
    }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Statistics Counter Animation
function animateCounter() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 50;
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + (target >= 24 ? '' : '+');
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Initialize counter animation
animateCounter();

// Back to Top Button
const backToTopButton = document.getElementById('backToTop');

// Show/hide button based on scroll position
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

// Smooth scroll to top when button is clicked
backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Add animation effect
    backToTopButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
        backToTopButton.style.transform = '';
    }, 200);
});

// Counter animation for statistics (if you want to add later)
function animateCounter(element, target, duration) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Lazy loading for images (if you add real images later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
