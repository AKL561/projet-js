document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("app");
  
    fetch("https://totolist-qen1.vercel.app/api/todos")
      .then(response => {
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        return response.json();
      })
      .then(data => {
        
        if (!Array.isArray(data) || !Array.isArray(data[0].todolist)) {
          throw new Error("Format inattendu de la réponse API.");
        }
  
        const tasks = data[0].todolist;
  
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.is_complete).length;
        const pendingTasks = totalTasks - completedTasks;
  
        container.innerHTML = `
          <h2>Statistiques des tâches</h2>
          <ul>
            <li><strong>Total :</strong> ${totalTasks}</li>
            <li><strong>Terminées :</strong> ${completedTasks}</li>
            <li><strong>À faire :</strong> ${pendingTasks}</li>
          </ul>
        `;
      })
      .catch(error => {
        console.error("Erreur API :", error);
        container.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
      });
  });
  
  
    
    
    
  