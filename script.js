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

function createStatusCell(status) {
  const cell = document.createElement("div");
  const badge = document.createElement("span");

  cell.classList.add("task-cell");

  badge.classList.add("status", status === "Activa" ? "active" : "paused");

  badge.textContent = status;
  cell.append(badge);

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
      createStatusCell(task.status),
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

taskForm.addEventListener("submit", handleTaskSubmit);

renderTasks();
