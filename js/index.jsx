document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. 메인이미지 및 히어로 텍스트 패러랙스 모션
       ========================================================================== */
    const heroContent = document.querySelector('.hero-content');

    if (heroContent) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            
            if (scrollY < window.innerHeight) {
                window.requestAnimationFrame(() => {
                    // 스크롤 시 아래로 스르륵 밀리면서 페이드 아웃되는 정밀 모션
                    heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
                    heroContent.style.opacity = `${1 - (scrollY / (window.innerHeight * 0.75))}`;
                });
            }
        });
    }


    /* ==========================================================================
       2. 스크롤 등장 모션 (Intersection Observer)
       ========================================================================== */
    const revealTargets = document.querySelectorAll('.about-wrapper, .skill-card, .portfolio-item, .timeline-item, section h2');

    // JS 실행 시 초기 투명화 상태 배치
    revealTargets.forEach(target => {
        target.style.opacity = '0';
        target.style.transform = 'translateY(50px)';
        target.style.willChange = 'transform, opacity';
        target.style.transition = 'opacity 1.2s cubic-bezier(0.25, 1, 0.5, 1), transform 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
    });

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // 등장 완료 후 3D 카드 무브 트랜지션과 충돌하는 것 방지
                setTimeout(() => {
                    const isCard = entry.target.classList.contains('portfolio-item') || 
                                   entry.target.classList.contains('about-wrapper') || 
                                   entry.target.classList.contains('skill-card');
                    if (isCard) {
                        entry.target.style.transition = 'none'; 
                    }
                }, 1200);

                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null,
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px'
    });

    revealTargets.forEach(target => revealObserver.observe(target));


    /* ==========================================================================
       3. 마우스 호버 3D 글래스 카드 모션
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.portfolio-item, .about-wrapper, .skill-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (card.style.opacity === '0') return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const tiltX = (yc - y) / yc;
            const tiltY = (x - xc) / xc;
            const maxTilt = 5; 

            window.requestAnimationFrame(() => {
                card.style.transition = 'transform 0.1s linear, box-shadow 0.1s linear, background-color 0.3s ease, border-color 0.3s ease';
                card.style.transform = `perspective(1000px) rotateX(${tiltX * maxTilt}deg) rotateY(${tiltY * maxTilt}deg) scale(1.012)`;
                
                // [수정] 호버 시 그림자 농도를 매우 부드럽고 가볍게 변경 (6% 수준의 흐릿한 그림자)
                card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.06), 0 0 10px rgba(255, 255, 255, 0.2)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                card.style.backgroundColor = 'rgba(255, 255, 255, 0.55)';
            });
        });

        card.addEventListener('mouseleave', () => {
            window.requestAnimationFrame(() => {
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.5s ease, background-color 0.5s ease';
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
                
                // [수정] 마우스가 나갔을 때 원래의 아주 연한 초기 그림자 상태로 회귀
                card.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.02)';
                card.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                card.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            });
        });
    });

});