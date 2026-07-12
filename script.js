// script.js

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

function createTaskCell(content) {
  const cell = document.createElement("div");
  cell.textContent = content;

  return cell;
}

function createStatusCell(status) {
  const cell = document.createElement("div");
  const badge = document.createElement("span");

  badge.classList.add("status", status === "Activa" ? "active" : "paused");

  badge.textContent = status;
  cell.append(badge);

  return cell;
}

function renderTasks() {
  scheduler.tasks.forEach((task) => {
    schedulerGrid.append(
      createTaskCell(task.name),
      createTaskCell(task.frequency),
      createTaskCell(task.nextExecution),
      createStatusCell(task.status),
    );
  });
}

renderTasks();
