// Theme toggler 
const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
});

// Script para poder mover las tareas
document.addEventListener('DOMContentLoaded', (event) => {

    var dragSrcEl = null;
    var dragSrcColumn = null;
  
    function handleDragStart(e) {
      this.style.opacity = '0.1';
      this.style.border = '3px dashed #c4cad3';
  
      dragSrcEl = this;
      dragSrcColumn = this.parentElement;
  
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', this.innerHTML);
    }
  
    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault();
      }
  
      e.dataTransfer.dropEffect = 'move';
      return false;
    }
  
    function handleDragEnter(e) {
      this.classList.add('task-hover');
    }
  
    function handleDragLeave(e) {
      this.classList.remove('task-hover');
    }
  
    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
      }
  
      // Ensure the drop is within the same column
      if (dragSrcEl != this && dragSrcColumn === this.parentElement) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
      }

      // Reasignar eventos de arrastre y soltar
      initDragAndDrop();
      // Reasignar eventos para las opciones y el estado de la tarea
      initTaskOptions();
      initTaskStatusToggle();
  
      return false;
    }
  
    function handleDragEnd(e) {
      this.style.opacity = '1';
      this.style.border = 0;
  
      items.forEach(function (item) {
        item.classList.remove('task-hover');
      });
    }
  
    let items = document.querySelectorAll('.task');
    items.forEach(function(item) {
      item.addEventListener('dragstart', handleDragStart, false);
      item.addEventListener('dragenter', handleDragEnter, false);
      item.addEventListener('dragover', handleDragOver, false);
      item.addEventListener('dragleave', handleDragLeave, false);
      item.addEventListener('drop', handleDrop, false);
      item.addEventListener('dragend', handleDragEnd, false);
    });
  });
  

// Script de la vista modal para agregar tareas 
document.addEventListener('DOMContentLoaded', (event) => {
    // Get the modal
    var modal = document.getElementById("myModal");
  
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
  
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("closing")[0];
  
    // When the user clicks the button, open the modal 
    btn.onclick = function() {
      modal.style.display = "block";
    }
  
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  });
  

// Script para mostrar las operaciones del CRUD
function initTaskOptions() {
  // Toggle the visibility of the options menu on button click
  document.querySelectorAll('.task__options').forEach(button => {
    button.addEventListener('click', (event) => {
      const optionsMenu = event.target.closest('.task__tags').querySelector('.options-menu');
      // Toggle the display of the options menu
      optionsMenu.style.display = optionsMenu.style.display === 'block' ? 'none' : 'block';
    });
  });

  // Hide the options menu when clicking outside of it
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.task__tags')) {
      document.querySelectorAll('.options-menu').forEach(menu => {
        menu.style.display = 'none';
      });
    }
  });
}

// Inicializar las opciones de tarea
document.addEventListener('DOMContentLoaded', () => {
  initTaskOptions();
});

// Obtiene el elemento input de tipo date
const inputDate = document.getElementById('fecha_finalizacion');
const editDate = document.getElementById('edit-fecha_finalizacion');

// Obtiene la fecha actual en formato yyyy-mm-dd
const today = new Date();

// Formatea la fecha actual en formato yyyy-mm-dd
const year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();

// Agrega un cero delante si el mes o el día son menores que 10
if (month < 10) {
  month = '0' + month;
}
if (day < 10) {
  day = '0' + day;
}

// Obtiene la fecha actual en formato yyyy-mm-dd
const currentDate = `${year}-${month}-${day}`;

// Establece la fecha mínima como la fecha actual
inputDate.setAttribute('min', currentDate);
editDate.setAttribute('min', currentDate);



// Sobrepone una línea para marcar como Done la tarea (falta funcionalidad en la base de datos)
function initTaskStatusToggle() {
  var checkButtons = document.querySelectorAll('.fas.fa-check');

  checkButtons.forEach(function(button) {
    button.addEventListener('click', async function() {
      var taskId = this.getAttribute('data-task-id');
      var taskElement = this.closest('.task');

      try {
        let response = await fetch(`/tasks/${taskId}/toggle-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        let result = await response.json();
        if (result.success) {
          // Actualiza la clase 'checked' según el nuevo estatus
          if (result.status === 'Done') {
            taskElement.classList.add('checked');
          } else {
            taskElement.classList.remove('checked');
          }

          // Determina la columna a la que se debe mover la tarea
          var newColumn;
          if (result.status === 'Done') {
            newColumn = document.querySelector('.project-column-tasks[data-status="Done"]');
          } else {
            // Aquí se realiza la validación de la fecha de finalización
            var today = new Date();
            today.setHours(0, 0, 0, 0);
            var endDate = new Date(taskElement.querySelector('time').getAttribute('datetime'));
            endDate.setHours(0, 0, 0, 0);

            if (endDate.getTime() === today.getTime()) {
              newColumn = document.querySelector('.project-column-tasks[data-status="Doing"]');
            } else {
              newColumn = document.querySelector('.project-column-tasks[data-status="To do"]');
            }
          }

          if (newColumn) {
            newColumn.appendChild(taskElement);
          }

          // Reactivar los eventos de arrastrar y soltar
          initDragAndDrop();
          // Reactivar los eventos para las opciones
          initTaskOptions();

        } else {
          console.error('Error al actualizar el estatus de la tarea:', result.message);
        }
      } catch (error) {
        console.error('Error al realizar la petición:', error);
      }
    });
  });
}

// Inicializar el estatus de tarea
document.addEventListener('DOMContentLoaded', () => {
  initTaskStatusToggle();
  initTaskOptions();
  initDragAndDrop();
});


// Inicializar el estatus de tarea
document.addEventListener('DOMContentLoaded', () => {
  initTaskStatusToggle();
  initTaskOptions();
  initDragAndDrop();
});



// Script del CRUD de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  var deleteButtons = document.querySelectorAll('.delete-btn');
  var editButtons = document.querySelectorAll('.edit-btn');
  var editModal = document.getElementById('editModal');
  var closeEditBtn = editModal.querySelector('.closing');
  var editForm = document.getElementById('edit-task-form');

  // Manejo de eliminación de tareas
  deleteButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var taskId = this.getAttribute('data-task-id');
      if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/tasks/${taskId}`, {
          method: 'DELETE'
        })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then(data => {
              throw new Error(data.error);
            });
          }
        })
        .then(data => {
          console.log(data.message);
          var taskElement = this.closest('.task');
          taskElement.remove();
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Error deleting task: ' + error.message);
        });
      }
    });
  });

  // Editar tarea
  editButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var taskId = this.getAttribute('data-task-id');
      var taskDescription = this.getAttribute('data-task-description');
      var taskDate = this.getAttribute('data-task-date');
      var taskImportance = this.getAttribute('data-task-importance');
  
      // Populate the modal with task data
      document.getElementById('edit-task-id').value = taskId;
      document.getElementById('edit-descripcion').value = taskDescription;
      document.getElementById('edit-fecha_finalizacion').value = taskDate;
      document.getElementById('edit-importancia').value = taskImportance;
  
      // Open the modal
      editModal.style.display = "block";
    });
  });
  
  
  


  closeEditBtn.addEventListener('click', function() {
    editModal.style.display = "none";
  });

  window.onclick = function(event) {
    if (event.target == editModal) {
      editModal.style.display = "none";
    }
  };
});
