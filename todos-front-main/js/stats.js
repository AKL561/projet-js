const API_BASE = "https://totolist-qen1.vercel.app/api";


function asTodoArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.todolist)) return data.todolist;
  if (Array.isArray(data) && data[0] && Array.isArray(data[0].todolist)) return data[0].todolist;
  return [];
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("app");

  fetch(`${API_BASE}/todos`)
    .then(response => {
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      return response.json();
    })
    .then(data => {
      const tasks = asTodoArray(data);

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.is_complete).length;
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
