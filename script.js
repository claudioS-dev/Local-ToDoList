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
      <label for="task${index}" class="${task.completed ? "completed" : ""}">${
    task.text
  }</label>
  <button class="delete-btn" aria-label="Eliminar tarea">
    <img src="trash.svg" alt="Icono de eliminar" width="24" height="24">
  </button>
</div>
    <div class="task-date">Agregada el ${task.date}</div>
  `;

  const checkbox = li.querySelector("input[type='checkbox']");
  checkbox.addEventListener("change", handleCheckboxChange);

  li.querySelector(".delete-btn").addEventListener("click", () =>
    deleteTask(index)
  );

  return li;
}

function handleCheckboxChange(e) {
  const tasks = getTasks();
  const index = getTaskIndex(e.target);
  tasks[index].completed = e.target.checked;
  saveTasks(tasks);

  const label = e.target.nextElementSibling;
  label.classList.toggle("completed", e.target.checked);

  if (e.target.checked) {
    createConfetti();
  }
}

function getTaskIndex(element) {
  const taskId = element.id;
  return parseInt(taskId.replace("task", ""), 10);
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
  const confettiCount = 250;
  const confettiEmojis = ["🎉", "🎊", "✨", "🌟", "🎈"];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.innerHTML =
      confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.top = -50 - Math.random() * 100 + "px";

    const startPositionX = Math.random() * 200 - 100; // -100 a 100
    confetti.style.transform = `translateX(${startPositionX}px)`;

    confetti.style.animationDuration = Math.random() * 1.5 + 1 + "s";
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3000);
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
