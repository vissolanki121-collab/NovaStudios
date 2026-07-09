(function () {
    'use strict';

    var toggle = document.querySelector('.nav-toggle');
    var navbar = document.querySelector('.navbar');
    if (!toggle || !navbar) return;

    // Initialize aria-expanded state on load
    toggle.setAttribute('aria-expanded', 'false');

    toggle.addEventListener('click', function () {
        var isOpen = navbar.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close the menu after a navigation link is clicked
    var links = navbar.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
        link.addEventListener('click', function () {
            navbar.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navbar.classList.contains('nav-open')) {
            navbar.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
})();
