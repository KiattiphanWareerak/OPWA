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

function switchTopAndBottom(fadeId, displayId) {
  const fadeTab = document.getElementById(fadeId);
  const displayTab = document.getElementById(displayId);
  
  // รีเซ็ตค่าใน input ของ fadeTab
  const fadeInputs = fadeTab.querySelectorAll("input[type='text']");
  fadeInputs.forEach(input => {
      input.value = "";
  });
  
  // รีเซ็ตค่าใน input ของ displayTab
  const displayInputs = displayTab.querySelectorAll("input[type='text']");
  displayInputs.forEach(input => {
      input.value = "";
  });

  fadeTab.classList.remove('active');
  displayTab.classList.add('active');
}