const observerOptions = {
    root: null,  // Observe in the viewport
    threshold: 0.5  // Trigger when 50% of the section is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

const themeDropdown = document.getElementById('themeDropdown');
const themeIcon = document.getElementById('themeIcon');
const themeItems = document.querySelectorAll('.dropdown-item');
const body = document.body;
const sections = document.querySelectorAll('.section');
const navbarHeight = document.querySelector('.navbar').offsetHeight;
const navLinks = document.querySelectorAll('.nav-link');

// Function to apply theme
function applyTheme(theme) {
    // Apply the theme and update the icon
    if (theme === 'dark') {
        body.setAttribute('data-bs-theme', 'dark');
        themeIcon.innerHTML = '<use xlink:href="img/symbol.svg#icon-moon"></use>';
    } else if (theme === 'light') {
        body.setAttribute('data-bs-theme', 'light');
        themeIcon.innerHTML = '<use xlink:href="img/symbol.svg#icon-sun"></use>';
    } else {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        body.setAttribute('data-bs-theme', systemTheme);
        themeIcon.innerHTML = '<use xlink:href="img/symbol.svg#icon-contrast"></use>';
    }

    // Remove 'active' class from all theme items
    themeItems.forEach(item => {
        item.classList.remove('active');
    });

    // Mark the selected item as active
    const selectedItem = document.getElementById(theme + 'Theme');
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
}

// Typewriter effect with typing and deleting animation
function typeWriter() {
    const dataText = ["Programmer", "Web Developer", "Designer", "Networking"];
    const typingSpeed = 150; // Reduced for smoother typing
    const deletingSpeed = 100; // Slightly slower deleting for smoother effect
    const pauseBeforeDelete = 1500; // Slightly longer pause before deleting
    const pauseBeforeNextWord = 800; // A bit longer pause before the next word

    function typeWriter(text, i, isDeleting, callback) {
        const element = document.querySelector(".typing");

        if (!isDeleting) {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';
                setTimeout(() => typeWriter(text, i + 1, isDeleting, callback), typingSpeed);
            } else {
                // Once the word is fully typed, pause before deleting
                setTimeout(() => typeWriter(text, i - 1, true, callback), pauseBeforeDelete);
            }
        } else {
            if (i >= 0) {
                element.innerHTML = text.substring(0, i) + '<span aria-hidden="true"></span>';
                setTimeout(() => typeWriter(text, i - 1, isDeleting, callback), deletingSpeed);
            } else {
                // Once the word is fully deleted, start typing the next word
                setTimeout(callback, pauseBeforeNextWord);
            }
        }
    }

    function startTypingAnimation(index = 0) {
        if (index >= dataText.length) {
            index = 0;
        }
        typeWriter(dataText[index], 0, false, () => {
            startTypingAnimation(index + 1);
        });
    }

    // Start typing animation after a 2-second delay
    setTimeout(() => startTypingAnimation(), 2000);
};

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'system') {
        applyTheme('system');
    }
});

function themeCheker() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('system');
        localStorage.setItem('theme', 'system');
    }

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
};

function changeActiveLink() {
    let index = sections.length;

    while (--index && window.scrollY + (navbarHeight + 1) < sections[index].offsetTop) { }

    navLinks.forEach((link) => link.classList.remove('active'));
    navLinks[index].classList.add('active');
}

navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default behavior of anchor links

        // Get the target section
        const targetId = this.getAttribute('href').substring(1); // Remove '#' from the href
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            // Smooth scroll with offset
            window.scrollTo({
                top: targetElement.offsetTop - navbarHeight,
                behavior: 'smooth' // Enable smooth scrolling
            });
        }
    });
});

// Click event for each theme option in the dropdown
themeItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedTheme = e.target.id.replace('Theme', '');
        applyTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    });
});

themeDropdown.addEventListener('click', () => {
    themeCheker();
});

// Load the saved theme or apply system theme by default
document.addEventListener('DOMContentLoaded', () => {
    themeCheker();
    typeWriter();
});

window.addEventListener('scroll', changeActiveLink);
changeActiveLink();

const image = document.querySelector('.img-cover');
const container = document.querySelector('.container-3d');

container.addEventListener('mousemove', (e) => {
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Adjust this value for more/less rotation
    const rotateY = ((x - centerX) / centerX) * 15;  // Adjust this value for more/less rotation

    // Apply the 3D rotation
    image.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

container.addEventListener('mouseleave', () => {
    image.style.transform = 'rotateX(0deg) rotateY(0deg)';
});
