// Initialize Lucide Icons
lucide.createIcons();

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Hero Section Initial Load Animation
    const heroTimeline = gsap.timeline();
    
    heroTimeline.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
    })
    .from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6")
    .from(".cta-btn", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out"
    }, "-=0.6");

    // 2. Auto-Hiding Navbar & GSAP Smooth Progress Bar
    const navbar = document.querySelector(".navbar");
    const progressBar = document.querySelector(".scroll-progress");

    let lastScrollY = window.scrollY;
    let scrollTimeout;
    let navHideTimeout;
    let isMouseNearTop = false;

    function showNav() {
        if (navbar) {
            navbar.classList.remove("nav-hidden");
        }
    }

    function hideNav() {
        if (navbar && !isMouseNearTop) {
            navbar.classList.add("nav-hidden");
        }
    }

    // Schedules auto-hide after 1.5 seconds of inactivity
    function resetNavHideTimer() {
        clearTimeout(navHideTimeout);
        navHideTimeout = setTimeout(() => {
            hideNav();
        }, 1500);
    }

    // Initial state setup
    showNav();
    resetNavHideTimer();

    // Mouse Proximity Listener (Shows header when hovering near top 80px)
    window.addEventListener("mousemove", (e) => {
        if (e.clientY <= 80) {
            isMouseNearTop = true;
            showNav();
            clearTimeout(navHideTimeout);
        } else {
            if (isMouseNearTop) {
                isMouseNearTop = false;
            }
            resetNavHideTimer();
        }
    });

    // Scroll Handler (GSAP Progress Fill, Tilt, & Auto-Show)
    window.addEventListener("scroll", () => {
        showNav();
        resetNavHideTimer();
        
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        if (totalScrollableHeight > 0 && progressBar) {
            const currentScrollY = window.scrollY;
            const scrolledPercentage = (currentScrollY / totalScrollableHeight) * 100;
            
            const delta = currentScrollY - lastScrollY;
            const skewAngle = Math.max(-25, Math.min(25, delta * 0.8));
            
            // Ultra-smooth progress fill/empty animation via GSAP
            gsap.to(progressBar, {
                width: `calc(${scrolledPercentage}% + 100px)`,
                duration: 0.25,
                ease: "power1.out",
                overwrite: "auto"
            });

            // Kinetic shear angle animation via GSAP
            gsap.to(progressBar, {
                skewX: skewAngle,
                duration: 0.15,
                ease: "power1.out",
                overwrite: "auto"
            });
            
            lastScrollY = currentScrollY;
            
            // Smoothly ease tilt back to straight line when scrolling pauses
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                gsap.to(progressBar, {
                    skewX: 0,
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }, 80);
        }
    }, { passive: true });

    // 3. Process Section Scroll-Driven Timeline Highlighting
    const processSteps = gsap.utils.toArray('.process-step');
    
    processSteps.forEach((step) => {
        ScrollTrigger.create({
            trigger: step,
            start: "top 60%",
            end: "bottom 40%",
            toggleClass: "is-active",
            onEnter: () => gsap.to(step, { scale: 1, duration: 0.3 }),
            onLeave: () => gsap.to(step, { scale: 0.98, duration: 0.3 }),
            onEnterBack: () => gsap.to(step, { scale: 1, duration: 0.3 }),
            onLeaveBack: () => gsap.to(step, { scale: 0.98, duration: 0.3 }),
        });
        
        gsap.set(step, { scale: 0.98 });
    });

    // 4. Contact Form Plain Validation & Submission Override
    // 4. Contact Form Real Email Submission (FormSubmit Integration)
    const contactForm = document.getElementById("contact-form");
    const formMessage = document.getElementById("form-message");
    const submitBtn = document.querySelector(".submit-btn");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "SENDING INQUIRY...";
            submitBtn.style.pointerEvents = "none";
            submitBtn.style.opacity = "0.5";
            
            const formData = new FormData(contactForm);
            
            // Send data to FormSubmit
            fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.reset();
                    formMessage.innerText = "INQUIRY RECEIVED. WE WILL CONTACT YOU.";
                    formMessage.classList.add("visible");
                } else {
                    formMessage.innerText = "ERROR SENDING INQUIRY. PLEASE TRY AGAIN.";
                    formMessage.classList.add("visible");
                }
            })
            .catch(error => {
                formMessage.innerText = "NETWORK ERROR. PLEASE TRY AGAIN.";
                formMessage.classList.add("visible");
            })
            .finally(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.pointerEvents = "auto";
                submitBtn.style.opacity = "1";
                
                setTimeout(() => {
                    formMessage.classList.remove("visible");
                }, 6000);
            });
        });
    }
});