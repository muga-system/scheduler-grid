"use strict";

const scheduler = {
  tasks: [
    {
      id: crypto.randomUUID(),
      name: "Backup Base de Datos",
      frequency: "Diaria",
      nextExecution: "11 Jul · 02:00",
      status: "Activa",
    },
    {
      id: crypto.randomUUID(),
      name: "Enviar Reporte",
      frequency: "Semanal",
      nextExecution: "13 Jul · 09:00",
      status: "Pausada",
    },
    {
      id: crypto.randomUUID(),
      name: "Limpieza Logs",
      frequency: "Mensual",
      nextExecution: "01 Ago · 00:30",
      status: "Activa",
    },
  ],
};

const schedulerGrid = document.querySelector("#scheduler-grid");
const taskForm = document.querySelector("#task-form");
const taskNameInput = document.querySelector("#task-name");
const taskFrequencyInput = document.querySelector("#task-frequency");
const taskNextExecutionInput = document.querySelector("#task-next-execution");

function createTaskCell(content) {
  const cell = document.createElement("div");

  cell.classList.add("task-cell");
  cell.textContent = content;

  return cell;
}

function createStatusCell(task) {
  const cell = document.createElement("div");
  const button = document.createElement("button");

  cell.classList.add("task-cell");

  button.classList.add(
    "status",
    task.status === "Activa" ? "active" : "paused",
  );

  button.type = "button";
  button.dataset.taskId = task.id;
  button.textContent = task.status;
  button.setAttribute("aria-label", `Cambiar estado de ${task.name}`);

  cell.append(button);

  return cell;
}

function renderTasks() {
  const renderedCells = schedulerGrid.querySelectorAll(".task-cell");

  renderedCells.forEach((cell) => cell.remove());

  scheduler.tasks.forEach((task) => {
    schedulerGrid.append(
      createTaskCell(task.name),
      createTaskCell(task.frequency),
      createTaskCell(task.nextExecution),
      createStatusCell(task),
    );
  });
}

function formatNextExecution(value) {
  const date = new Date(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = new Intl.DateTimeFormat("es-AR", {
    month: "short",
  })
    .format(date)
    .replace(".", "");

  const time = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return `${day} ${month} · ${time}`;
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const newTask = {
    id: crypto.randomUUID(),
    name: taskNameInput.value.trim(),
    frequency: taskFrequencyInput.value,
    nextExecution: formatNextExecution(taskNextExecutionInput.value),
    status: "Activa",
  };

  scheduler.tasks.push(newTask);

  renderTasks();
  taskForm.reset();
  taskNameInput.focus();
}

function handleSchedulerClick(event) {
  const statusButton = event.target.closest(".status");

  if (!statusButton) {
    return;
  }

  const task = scheduler.tasks.find(
    (currentTask) => currentTask.id === statusButton.dataset.taskId,
  );

  if (!task) {
    return;
  }

  task.status = task.status === "Activa" ? "Pausada" : "Activa";

  renderTasks();
}

schedulerGrid.addEventListener("click", handleSchedulerClick);
taskForm.addEventListener("submit", handleTaskSubmit);

renderTasks();
