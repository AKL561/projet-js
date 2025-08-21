document.addEventListener("DOMContentLoaded", () => {
    const nav = document.createElement("nav");
    nav.className = "navbar navbar-expand-lg bg-secondary text-uppercase fixed-top";
    nav.id = "mainNav";
    nav.innerHTML = `
      <div class="container">
        <a class="navbar-brand" href="index.html">Tâches</a>
        <button class="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded" type="button"
          data-bs-toggle="collapse" data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          Menu <i class="fas fa-bars"></i>
        </button>
        <div class="collapse navbar-collapse" id="navbarResponsive">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item"><a class="nav-link" href="index.html">Accueil</a></li>
           
            <li class="nav-item"><a class="nav-link" href="tasks.html">Liste des tâches</a></li>
             
            <li class="nav-item"><a class="nav-link" href="stat.html">Statistiques</a></li>
          </ul>
        </div>
      </div>
    `;
  
    document.body.insertBefore(nav, document.body.firstChild);
  });
  
  
  