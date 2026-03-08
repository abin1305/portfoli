 const projects = document.querySelectorAll(".project-box");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    let current = 0;

    function showProject(index) {
      projects.forEach((project, i) => {
        project.classList.toggle("active", i === index);
      });
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === projects.length - 1;
    }

    nextBtn.addEventListener("click", () => {
      if (current < projects.length - 1) {
        current++;
        showProject(current);
      }
    });

    prevBtn.addEventListener("click", () => {
      if (current > 0) {
        current--;
        showProject(current);
      }
    });

    // Initialize
    showProject(current);