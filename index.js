// Scroll horizontal con rueda del mouse
document.addEventListener('DOMContentLoaded', function () {
    const scrollContainer = document.querySelector('.scroll-container');
    const navLinks = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');

    if (!scrollContainer) {
        console.error('No se encontró el contenedor de scroll');
        return;
    }

    let isScrolling = false;
    let scrollTimeout;
    let lastWheelTime = 0;

    // Convertir scroll vertical a horizontal
    // Capturar evento en window para asegurar que funcione
    window.addEventListener('wheel', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();

        // Throttle: solo procesar si han pasado al menos 100ms desde el último evento
        if (now - lastWheelTime < 100) {
            return;
        }
        lastWheelTime = now;

        if (isScrolling) return;

        const delta = e.deltaY;
        const scrollAmount = window.innerWidth;
        const currentScroll = scrollContainer.scrollLeft;
        const maxScroll = scrollContainer.scrollWidth - window.innerWidth;

        let targetScroll;

        if (delta > 0) {
            // Scroll hacia abajo = mover a la derecha
            targetScroll = Math.min(currentScroll + scrollAmount, maxScroll);
        } else {
            // Scroll hacia arriba = mover a la izquierda
            targetScroll = Math.max(currentScroll - scrollAmount, 0);
        }

        if (targetScroll !== currentScroll) {
            scrollContainer.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });

            // Prevenir múltiples scrolls rápidos
            isScrolling = true;
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 600);
        }
    }, { passive: false });

    // Actualizar navegación activa según la página visible
    function updateActiveNav() {
        const scrollLeft = scrollContainer.scrollLeft;
        const pageWidth = window.innerWidth;
        const currentPage = Math.round(scrollLeft / pageWidth);
        const header = document.getElementById('global-header');

        // Ocultar header en página 2 (índice 1)
        if (currentPage === 1) {
            header.classList.add('header-hidden');
        } else {
            header.classList.remove('header-hidden');
        }

        navLinks.forEach((link, index) => {
            if (index === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Escuchar cambios en el scroll
    scrollContainer.addEventListener('scroll', updateActiveNav);

    // Navegación por clic en los enlaces
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetPage = parseInt(this.getAttribute('data-page'));
            const pageWidth = window.innerWidth;

            scrollContainer.scrollTo({
                left: targetPage * pageWidth,
                behavior: 'smooth'
            });
        });
    });

    // Inicializar navegación activa
    updateActiveNav();

    // Manejar clicks en thumbnails para mostrar imágenes en picture-views
    const thumbnailItems = document.querySelectorAll('.thumbnail-item');
    const pictureLeft = document.getElementById('picture-left');
    const pictureCenter = document.getElementById('picture-center');
    const pictureRight = document.getElementById('picture-right');

    // Mapeo de nombres de carpetas a nombres de archivos
    const fileNames = {
        'tele': 'tele',
        'camara': 'cam',
        'teclado': 'teclado',
        'telefono': 'telefono',
        'tocadiscos': 'tocadiscos',
        'bender': 'bender',
        'robot': 'robot',
        'auris': 'auris'
    };

    // Función para actualizar las imágenes
    function updatePictures(folder, fileName) {
        pictureLeft.src = `assets/3D/${folder}/${fileName}.gif`;
        pictureCenter.src = `assets/3D/${folder}/${fileName}1.jpg`;
        pictureRight.src = `assets/3D/${folder}/${fileName}2.jpg`;
    }

    thumbnailItems.forEach(item => {
        item.addEventListener('click', function () {
            const folder = this.getAttribute('data-folder');
            const fileName = fileNames[folder] || folder;

            // Actualizar las imágenes según el orden: .gif, 1.jpg, 2.jpg
            updatePictures(folder, fileName);

            // Agregar clase activa al thumbnail seleccionado
            thumbnailItems.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Cargar la primera imagen por defecto
    if (thumbnailItems.length > 0) {
        const firstItem = thumbnailItems[0];
        const firstFolder = firstItem.getAttribute('data-folder');
        const firstName = fileNames[firstFolder] || firstFolder;
        updatePictures(firstFolder, firstName);
        firstItem.classList.add('active');
    }

    // Animación de entrada para elementos de la página 2
    const page2 = document.querySelector('.page-2');
    const animatedElements = document.querySelectorAll('.proyectos-title, .proyectos-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animatedElements.forEach(el => {
                    el.classList.add('animate-in');
                });
            } else {
                animatedElements.forEach(el => {
                    el.classList.remove('animate-in');
                });
            }
        });
    }, observerOptions);

    if (page2) {
        observer.observe(page2);
    }

    // Animación de entrada para la imagen de la home (Página 1)
    const page1 = document.querySelector('.page-1'); // O usar querySelector('.page') si es la primera
    const homeImage = document.querySelector('.home-image');

    if (page1 && homeImage) {
        const homeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    homeImage.classList.add('animate-home');
                } else {
                    homeImage.classList.remove('animate-home');
                }
            });
        }, { threshold: 0.3 }); // Ajustar threshold según necesidad

        homeObserver.observe(page1);
    }

    // Animación de entrada para la galería de thumbnails (Página 3)
    const page3 = document.querySelector('.page-3');
    const thumbnailElements = document.querySelectorAll('.thumbnail-item');

    if (page3 && thumbnailElements.length > 0) {
        const page3Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    thumbnailElements.forEach(el => {
                        el.classList.add('animate-up');
                    });
                } else {
                    thumbnailElements.forEach(el => {
                        el.classList.remove('animate-up');
                    });
                }
            });
        }, { threshold: 0.2 });

        page3Observer.observe(page3);
    }

    // Página 4: Motion Graphics
    const page4 = document.querySelector('.page-4');
    const videoThumbnails = document.querySelectorAll('.video-thumbnail');
    const mainVideo = document.getElementById('main-video');
    const motionTitle = document.querySelector('.motion-title');

    // Asegurar que el video esté oculto inicialmente
    if (mainVideo) {
        mainVideo.classList.remove('active');
    }

    // Animación de entrada para la página 4
    if (page4) {
        const page4Observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (motionTitle) {
                        motionTitle.classList.add('animate-in');
                    }
                    videoThumbnails.forEach(el => {
                        el.classList.add('animate-in');
                    });
                } else {
                    if (motionTitle) {
                        motionTitle.classList.remove('animate-in');
                    }
                    videoThumbnails.forEach(el => {
                        el.classList.remove('animate-in');
                    });
                }
            });
        }, { threshold: 0.2 });

        page4Observer.observe(page4);
    }

    // Reproducir video en miniatura al hacer hover
    videoThumbnails.forEach(thumbnail => {
        const video = thumbnail.querySelector('.thumbnail-video');
        
        thumbnail.addEventListener('mouseenter', () => {
            if (video) {
                video.currentTime = 0;
                video.play().catch(e => console.log('Error al reproducir miniatura:', e));
            }
        });

        thumbnail.addEventListener('mouseleave', () => {
            if (video) {
                video.pause();
            }
        });
    });

    // Mostrar video en el área principal al hacer click
    videoThumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video');
            const videoName = this.getAttribute('data-name');
            
            if (videoSrc && mainVideo) {
                // Cargar y mostrar el video
                mainVideo.src = videoSrc;
                mainVideo.load();
                mainVideo.classList.add('active');
                
                // Remover clase active de todos los thumbnails
                videoThumbnails.forEach(thumb => thumb.classList.remove('active'));
                // Agregar clase active al thumbnail seleccionado
                this.classList.add('active');
                
                // Reproducir automáticamente
                mainVideo.play().catch(e => console.log('Error al reproducir video:', e));
            }
        });
    });
});

