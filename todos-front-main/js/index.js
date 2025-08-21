document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const inputPrenom = document.querySelector("#prenom");
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const prenom = inputPrenom.value.trim();
  
      if (prenom === "") {
        alert("Veuillez entrer votre prénom !");
        return;
      }
  
      
      localStorage.setItem("prenom", prenom);
  
      
      window.location.href = "tasks.html";
    });
  });