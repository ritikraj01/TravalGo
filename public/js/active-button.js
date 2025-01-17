document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".nav-link");
  
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        // Remove the 'active' class from all links
        navLinks.forEach(nav => nav.classList.remove("active"));
  
        // Add the 'active' class to the clicked link
        link.classList.add("active");
  
        // Optionally, store the active link in local storage to persist across page reloads
        localStorage.setItem("activeLink", link.href);
      });
    });
  
    // On page load, set the previously active link as active
    const activeLink = localStorage.getItem("activeLink");
    if (activeLink) {
      navLinks.forEach(link => {
        if (link.href === activeLink) {
          link.classList.add("active");
        }
      });
    }
  });
  