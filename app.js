/**
 * ========================================================================
 *   PORTFOLIO INTERACTIVITY LOGIC - BEZAWIT GASHAW
 * ========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize functions
    initTheme();
    initMobileNav();
    initScrollHeader();
    initScrollReveal();
    initActiveNavLink();
    initProjectFilter();
    initContactForm();
    initAdminPortal();
});

/* ---------------------------------------------------------------------
   1. THEME MANAGEMENT (LIGHT/DARK MODE)
   --------------------------------------------------------------------- */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // 1. Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', initialTheme);
        localStorage.setItem('theme', initialTheme);
    }

    // 2. Event listener for toggle button
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Brief rotation animation logic
        themeToggleBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 300);
    });
}

/* ---------------------------------------------------------------------
   2. MOBILE NAVIGATION OVERLAY
   --------------------------------------------------------------------- */
function initMobileNav() {
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu
    mobileToggleBtn.addEventListener('click', () => {
        mobileToggleBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggleBtn.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileToggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
            mobileToggleBtn.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

/* ---------------------------------------------------------------------
   3. SCROLL HEADER SCALING
   --------------------------------------------------------------------- */
function initScrollHeader() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

/* ---------------------------------------------------------------------
   4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   --------------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/* ---------------------------------------------------------------------
   5. DYNAMIC ACTIVE NAV LINK TRACKING
   --------------------------------------------------------------------- */
function initActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-80px 0px -20% 0px' // Offset header height
    });
    
    sections.forEach(section => {
        activeObserver.observe(section);
    });
}

/* ---------------------------------------------------------------------
   6. PROJECTS FILTERING SYSTEM
   --------------------------------------------------------------------- */
function initProjectFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsContainer = document.getElementById('projects-container');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Set active class
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Apply fade-out scale animation first
            projectCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            });

            setTimeout(() => {
                projectCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');

                    if (filterValue === 'all' || cardCategory === filterValue) {
                        card.style.display = 'flex';
                        // Force layout reflow before triggering transition
                        void card.offsetHeight; 
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }, 250);
        });
    });
}

/* ---------------------------------------------------------------------
   7. CONTACT FORM SUBMISSION & LOCALSTORAGE
   --------------------------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success');
    const submitBtn = document.getElementById('btn-submit-contact');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Get Form Values
        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const subject = document.getElementById('form-subject').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !subject || !message) return;

        // 2. Show loading spinner and disable submit
        submitBtn.disabled = true;
        btnText.style.opacity = '0.5';
        btnLoader.classList.remove('hidden');

        // 3. Simulate API Request
        setTimeout(() => {
            // Save to localStorage
            const newMessage = {
                id: Date.now().toString(),
                name,
                email,
                subject,
                message,
                date: new Date().toLocaleString()
            };

            const existingMessages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
            existingMessages.unshift(newMessage);
            localStorage.setItem('portfolio_messages', JSON.stringify(existingMessages));

            // Hide loading, clear form
            submitBtn.disabled = false;
            btnText.style.opacity = '1';
            btnLoader.classList.add('hidden');
            contactForm.reset();

            // Transition: Hide form and show success message
            contactForm.style.transition = 'opacity 0.3s ease';
            contactForm.style.opacity = '0';
            
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccessMessage.classList.remove('hidden');
            }, 300);

            // Reload inbox messages if the admin view is opened later
            renderMessages();

        }, 1500);
    });
}

/* ---------------------------------------------------------------------
   8. CLIENT-SIDE ADMIN PORTAL (WOW FACTOR INBOX)
   --------------------------------------------------------------------- */
function initAdminPortal() {
    const trigger = document.getElementById('admin-portal-trigger');
    const modal = document.getElementById('admin-modal');
    const closeModal = document.getElementById('close-admin-modal');
    const clearAllBtn = document.getElementById('clear-all-messages');

    // Open Modal
    trigger.addEventListener('click', () => {
        modal.classList.remove('hidden');
        renderMessages();
    });

    // Close Modal
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close Modal by clicking overlay
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });

    // Clear All Messages
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all local messages?')) {
            localStorage.removeItem('portfolio_messages');
            renderMessages();
        }
    });
}

// Global functions for rendering admin inbox (accessible to form submit and setup)
function renderMessages() {
    const inboxList = document.getElementById('inbox-list-view');
    const inboxEmpty = document.getElementById('inbox-empty-view');
    const totalCountSpan = document.getElementById('total-msgs-count');
    
    const messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
    
    // Update count
    totalCountSpan.textContent = messages.length;

    if (messages.length === 0) {
        inboxList.classList.add('hidden');
        inboxEmpty.classList.remove('hidden');
        return;
    }

    inboxEmpty.classList.add('hidden');
    inboxList.classList.remove('hidden');

    inboxList.innerHTML = '';
    
    messages.forEach(msg => {
        const msgCard = document.createElement('div');
        msgCard.className = 'message-card';
        msgCard.innerHTML = `
            <button class="delete-msg-btn" data-id="${msg.id}" aria-label="Delete message">
                <i class="fa-solid fa-trash-can"></i>
            </button>
            <div class="msg-header-row">
                <span class="msg-sender">${escapeHTML(msg.name)} (${escapeHTML(msg.email)})</span>
                <span class="msg-date">${msg.date}</span>
            </div>
            <div class="msg-subject">Subject: ${escapeHTML(msg.subject)}</div>
            <div class="msg-content">${escapeHTML(msg.message)}</div>
        `;
        inboxList.appendChild(msgCard);
    });

    // Attach individual delete event listeners
    const deleteButtons = inboxList.querySelectorAll('.delete-msg-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const messageId = btn.getAttribute('data-id');
            deleteMessage(messageId);
        });
    });
}

function deleteMessage(id) {
    let messages = JSON.parse(localStorage.getItem('portfolio_messages')) || [];
    messages = messages.filter(msg => msg.id !== id);
    localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    renderMessages();
}

// Utility to escape HTML and prevent basic script injections
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
