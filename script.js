/**
 * Komal & Chirag Digital Invitation Script
 * Features: Audio Toggle, Intro Transition, GSAP Animations, Faster Kanku Pagla, Countdown
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Kankotri Script Loaded!");

    // --- ૧. Elements Selection ---
    const openBtn = document.getElementById('open-btn');
    const introScreen = document.getElementById('intro-screen');
    const mainContent = document.getElementById('main-content');
    const audio = document.getElementById('bg-music');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');

    let isAudioPlaying = false;

    // --- ૨. Audio Control (Play/Pause) ---
    if (audioToggle && audio) {
        audioToggle.addEventListener('click', () => {
            if (isAudioPlaying) {
                audio.pause();
                if(audioIcon) audioIcon.textContent = '🔇';
            } else {
                audio.play();
                if(audioIcon) audioIcon.textContent = '🔊';
            }
            isAudioPlaying = !isAudioPlaying;
        });
    }

    // --- ૩. Invitation Open Logic ---
    const openInvitation = () => {
        // મ્યુઝિક શરૂ કરો
        if (audio) {
            audio.play().then(() => {
                isAudioPlaying = true;
                if(audioIcon) audioIcon.textContent = '🔊';
            }).catch(err => console.log("Audio auto-play blocked by browser. Wait for user interaction."));
        }

        // ઇન્ટ્રો સ્ક્રીનને ઉપર સ્લાઇડ કરો
        if (introScreen) {
            introScreen.style.transform = 'translateY(-100vh)';
        }
        
        // ૧.૨ સેકન્ડ પછી ઇન્ટ્રો હટાવી મેઈન કન્ટેન્ટ બતાવો
        setTimeout(() => {
            if (introScreen) {
                introScreen.classList.add('hidden');
                introScreen.setAttribute('aria-hidden', 'true');
            }
            if (mainContent) {
                mainContent.classList.remove('hidden');
                mainContent.setAttribute('aria-hidden', 'false');
            }
            
            // GSAP એનિમેશન અને અન્ય ડાયનેમિક ફીચર્સ શરૂ કરો
            initScrollAnimations();
            initReceptionCountdown();
            
            // પેજની ટોચ પર જાઓ
            window.scrollTo(0, 0);
        }, 1200); 
    };

    if (openBtn) {
        openBtn.addEventListener('click', openInvitation);
        // કીબોર્ડ સપોર્ટ
        openBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openInvitation();
            }
        });
    }

    // --- ૪. GSAP Scroll Animations ---
    function initScrollAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.error("GSAP or ScrollTrigger library missing!");
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // સામાન્ય સેક્શન એનિમેશન
        gsap.utils.toArray('.gsap-reveal').forEach(section => {
            gsap.fromTo(section, 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", 
                  scrollTrigger: { trigger: section, start: "top 90%" } 
                }
            );
        });

        // પ્રસંગો માટે Slide-In એનિમેશન (ડાબેથી)
        gsap.utils.toArray('.reveal-left').forEach(tile => {
            gsap.fromTo(tile, 
                { x: -80, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)", 
                  scrollTrigger: { trigger: tile, start: "top 95%" } 
                }
            );
        });

        // પ્રસંગો માટે Slide-In એનિમેશન (જમણેથી)
        gsap.utils.toArray('.reveal-right').forEach(tile => {
            gsap.fromTo(tile, 
                { x: 80, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)", 
                  scrollTrigger: { trigger: tile, start: "top 95%" } 
                }
            );
        });

        // સ્થળ વિગત એનિમેશન (નીચેથી)
        const revealBottom = document.querySelector('.reveal-bottom');
        if (revealBottom) {
            gsap.fromTo(revealBottom, 
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out", 
                  scrollTrigger: { trigger: revealBottom, start: "top 95%" } 
                }
            );
        }
    }

    // --- ૫. Reception Countdown Timer ---
    function initReceptionCountdown() {
        // રિસેપ્શનની તારીખ: May 9, 2026, 7:00 PM
        const receptionDate = new Date("May 9, 2026 19:00:00").getTime();
        
        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = receptionDate - now;
            
            if (distance < 0) {
                clearInterval(timerInterval);
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            const dDays = document.getElementById("days");
            const dHours = document.getElementById("hours");
            const dMins = document.getElementById("minutes");
            
            if(dDays) dDays.innerText = String(days).padStart(2, '0');
            if(dHours) dHours.innerText = String(hours).padStart(2, '0');
            if(dMins) dMins.innerText = String(minutes).padStart(2, '0');
        };

        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer(); // ઇન્સ્ટન્ટ રન
    }

});

// --- ૬. Kanku Pagla Fast Logic ---
// આ એનિમેશન આપણે CSS દ્વારા કંટ્રોલ કરીએ છીએ (3s સ્પીડ), 
// છતાં જો તમારે કસ્ટમ JS ટ્રીગર જોઈતું હોય તો નીચે મુજબ વાપરી શકાય.
// અત્યારે આ CSS થી જ એકદમ સ્મૂથ અને ફાસ્ટ ચાલશે.
function initStickyStack() {
    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray('.reveal-card');
    
    cards.forEach((card, index) => {
        gsap.fromTo(card, 
            { 
                opacity: 0, 
                scale: 0.9, 
                y: 50 
            }, 
            { 
                opacity: 1, 
                scale: 1, 
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%", // જ્યારે કાર્ડ નીચેથી દેખાય ત્યારે
                    end: "top 15%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}

// આ ફંક્શનને તમારા openInvitation ફંક્શનની અંદર કોલ કરજો.
function initHastmelapFinal() {
    gsap.registerPlugin(ScrollTrigger);

    // કાર્ડનું સ્મૂથ એન્ટ્રી એનિમેશન
    gsap.from(".gsap-hastmelap", {
        scale: 0.9,
        opacity: 0,
        y: 40,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: {
            trigger: ".hastmelap-final-section",
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });

    // ટેક્સ્ટનું એક પછી એક આવવું (Stagger)
    gsap.from(".hast-info-item", {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: ".hast-info-grid",
            start: "top 90%"
        }
    });
}
// --- Rose Petal Generator ---
function createPetals() {
    const container = document.getElementById('petal-container');
    const petalCount = 25; // પાંદડીઓની સંખ્યા (વધારે પ્રોફેશનલ લુક માટે ૨૫-૩૦ પૂરતી છે)

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // દર ૩ માંથી ૧ પાંદડી રોઝ-ગોલ્ડ કલરની હશે
        if (i % 3 === 0) petal.classList.add('gold');

        // રેન્ડમ સાઈઝ અને પોઝીશન
        const size = Math.random() * 15 + 10 + 'px';
        const left = Math.random() * 100 + '%';
        const delay = Math.random() * 10 + 's';
        const duration = Math.random() * 10 + 7 + 's';

        petal.style.width = size;
        petal.style.height = size;
        petal.style.left = left;
        petal.style.animationDelay = delay;
        petal.style.animationDuration = duration;
        petal.style.animationName = 'fall';
        petal.style.animationIterationCount = 'infinite';
        petal.style.animationTimingFunction = 'linear';

        container.appendChild(petal);
    }
}

// પત્રિકા ખુલ્યા પછી એનિમેશન શરૂ કરો
// આને તમારા openInvitation ફંક્શનમાં ઉમેરો
// createPetals();
// --- Wedding Countdown Logic ---
function initCountdown() {
    // લગ્નની તારીખ સેટ કરો: તા. ૦૮-૦૫-૨૦૨૬, બપોરે ૦૧:૩૦
    const weddingDate = new Date("May 8, 2026 13:30:00").getTime();

    const timer = setInterval(function() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        // દિવસ, કલાક, મિનિટ અને સેકન્ડની ગણતરી
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // HTML માં ડેટા અપડેટ કરો
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

        // જો તારીખ આવી જાય તો ટાઈમર બંધ કરો
        if (distance < 0) {
            clearInterval(timer);
            document.querySelector(".countdown-container").innerHTML = "<h3 class='gold-text'>આજનો મંગલ દિવસ!</h3>";
        }
    }, 1000);
}

// આ ફંક્શનને તમારા openInvitation ફંક્શનની અંદર કોલ કરજો
// initCountdown();

