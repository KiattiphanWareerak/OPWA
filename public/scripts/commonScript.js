document.addEventListener("DOMContentLoaded", function() {
    const buttons = document.querySelectorAll(".select-time");
    buttons.forEach(button => {
        button.addEventListener("click", function() {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove("active"));
            // Add active class to the clicked button
            this.classList.add("active");
        });
    });
});
