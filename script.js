// Constants
const STORAGE_KEY = "tasks";
const DATE_FORMAT_OPTIONS = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

// DOM Elements
const taskList = document.getElementById("task-list");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");

// Functions
function getTasks() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function createTaskElement(task, index) {
  const li = document.createElement("li");
  li.classList.add("task-item");
  li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" id="task${index}" ${
    task.completed ? "checked" : ""
  }>
            <label for="task${index}" class="${
    task.completed ? "completed" : ""
  }">${task.text}</label>
            <button class="delete-btn" aria-label="Eliminar tarea">🗑️</button>
        </div>
        <div class="task-date">Agregada el ${task.date}</div>
    `;

  const checkbox = li.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", (e) => {
    const tasks = getTasks();
    tasks[index].completed = e.target.checked;
    saveTasks(tasks);

    const label = li.querySelector("label");
    if (e.target.checked) {
      label.classList.add("completed");
      createConfetti();
    } else {
      label.classList.remove("completed");
    }
  });

  li.querySelector(".delete-btn").addEventListener("click", () => {
    deleteTask(index);
  });

  return li;
}

function loadTasks() {
  const tasks = getTasks();
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    taskList.appendChild(createTaskElement(task, index));
  });
}

function addTask(text) {
  const tasks = getTasks();
  const newTask = {
    text,
    completed: false,
    date: new Date().toLocaleString("es-ES", DATE_FORMAT_OPTIONS),
  };
  tasks.push(newTask);
  saveTasks(tasks);

  const newTaskElement = createTaskElement(newTask, tasks.length - 1);
  newTaskElement.classList.add("new-task");
  taskList.appendChild(newTaskElement);

  void newTaskElement.offsetWidth;

  setTimeout(() => {
    newTaskElement.classList.remove("new-task");
  }, 500);
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  loadTasks();
}

function createConfetti() {
  const confettiCount = 100;
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    confetti.style.opacity = Math.random();
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }
}

// Event Listeners
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const trimmedValue = taskInput.value.trim();
  if (trimmedValue !== "") {
    addTask(trimmedValue);
    taskInput.value = "";
  }
});

// Initialize
loadTasks();
