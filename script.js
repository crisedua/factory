document.addEventListener('DOMContentLoaded', () => {
    // --- Supabase Config ---
    const SUPABASE_URL = 'https://qbxfvbzavcpxduyrgczc.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieGZ2YnphdmNweGR1eXJnY3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDI5NzIsImV4cCI6MjA4MTQxODk3Mn0.kGSb6qKj9gvwYYwlZ00JUImfQp_Z9WSHaHVdEU3zPDw';

    // Initialize Supabase Client
    let supabase;
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (error) {
        console.error("Error initializing Supabase:", error);
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== "#") {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.card, .feature-item, .pillar-card, .timeline-item, .hero-content, .section-title');

    animatedElements.forEach(el => {
        el.classList.add('fade-up-hidden');
        observer.observe(el);
    });

    // Add Dynamic Styles for Animations
    if (!document.getElementById('anim-styles')) {
        const style = document.createElement('style');
        style.id = 'anim-styles';
        style.textContent = `
            .fade-up-hidden {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            }
            .visible {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // --- Waitlist Form Handling ---
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.getElementById('submit-btn');
    const feedback = document.getElementById('form-feedback');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!supabase) {
                showFeedback('Error de configuración. Intenta más tarde.', 'error');
                return;
            }

            const email = emailInput.value.trim();
            if (!email) return;

            // UI Loading State
            const originalBtnText = submitBtn.innerText;
            submitBtn.disabled = true;
            submitBtn.innerText = "Enviando... 🚀";
            feedback.innerText = "";
            feedback.className = "form-message";

            try {
                // Insert into 'waitlist' table
                const { data, error } = await supabase
                    .from('waitlist')
                    .insert([{ email: email }]);

                if (error) {
                    console.error('Supabase error:', error);
                    // Handle duplicate key error specially if possible, usually code 23505
                    if (error.code === '23505') {
                        showFeedback('¡Ya estás en la lista! 🤘', 'success');
                    } else {
                        throw error;
                    }
                } else {
                    showFeedback('¡Te has unido con éxito! Estás en la lista de espera, te contactaremos. Bienvenid@ a FabricaStartup. 🚀', 'success');
                    form.reset();
                }
            } catch (err) {
                console.error(err);
                if (err.message && err.message.includes("relation \"waitlist\" does not exist")) {
                    showFeedback("Error: La tabla 'waitlist' no existe aún.", "error");
                } else {
                    showFeedback('Hubo un error. Inténtalo de nuevo.', 'error');
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    function showFeedback(message, type) {
        feedback.innerText = message;
        feedback.className = `form-message ${type}`;
        // Auto clear error after 5s
        if (type === 'error') {
            setTimeout(() => {
                feedback.innerText = "";
                feedback.className = "form-message";
            }, 5000);
        }
    }

    // --- Countdown Timer ---
    const countdownDate = new Date("Jan 2, 2026 00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            document.getElementById("countdown-box").innerHTML = "<div class='time-val'>¡Lanzamiento!</div>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const dEl = document.getElementById("d-val");
        const hEl = document.getElementById("h-val");
        const mEl = document.getElementById("m-val");
        const sEl = document.getElementById("s-val");

        if (dEl) dEl.innerText = days;
        if (hEl) hEl.innerText = hours < 10 ? "0" + hours : hours;
        if (mEl) mEl.innerText = minutes < 10 ? "0" + minutes : minutes;
        if (sEl) sEl.innerText = seconds < 10 ? "0" + seconds : seconds;
    }

    if (document.getElementById("countdown-box")) {
        setInterval(updateCountdown, 1000);
        updateCountdown(); // Initial call
    }
});
