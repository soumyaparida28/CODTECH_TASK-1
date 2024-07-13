const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;
  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => addTask(task.text, task.completed));
}

function addTask(taskText, completed = false) {
  const task = taskText || inputBox.value.trim();
  if (!task) {
    alert("Please write down a task");
    console.log("no task added");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox" ${completed ? "checked" : ""}>
      <span>${task}</span>
    </label>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
  `;
  if (completed) {
    li.classList.add("completed");
  }
  listContainer.appendChild(li);

  inputBox.value = "";

  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("span");
  const deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("click", () => {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
    saveTasks();
  });

  editBtn.addEventListener("click", () => {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
      saveTasks();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateCounters();
      saveTasks();
    }
  });

  updateCounters();
  saveTasks();
}

inputBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Load tasks when the page is loaded
document.addEventListener("DOMContentLoaded", loadTasks);
