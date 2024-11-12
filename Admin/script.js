      // Show the preloader
      document.addEventListener("DOMContentLoaded", function() {
        document.querySelector('.preloader').style.display = 'block';
      });
      
      // Hide the preloader when the page has fully loaded
      window.addEventListener("load", function() {
        document.querySelector('.preloader').style.display = 'none';
      });

  // JavaScript to remove loading class after page has loaded
  window.addEventListener('load', function() {
    document.body.classList.remove('loading');
});

document.getElementById('sidebarToggle').addEventListener('click', function() {
    document.getElementById('sidebar').classList.toggle('expand');
    document.getElementById('content').classList.toggle('expand');
});

// Adjust sidebar items position when dropdown is expanded
var dropdowns = document.querySelectorAll('.dropdown');
dropdowns.forEach(function(dropdown) {
    dropdown.addEventListener('mouseover', function() {
        var dropdownMenu = this.querySelector('.dropdown-menu');
        var dropdownHeight = dropdownMenu.offsetHeight;
        var dropdownOffset = dropdownMenu.getBoundingClientRect().top;
        var sidebarHeight = document.getElementById('sidebar').offsetHeight;
        var positionAdjustment = dropdownHeight + dropdownOffset - sidebarHeight;
        if (positionAdjustment > 0) {
            this.style.marginBottom = positionAdjustment + 'px';
        }
    });
});