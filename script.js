"use strict";

const scheduler = {
  executionLog: [],
  tasks: [
    {
      id: crypto.randomUUID(),
      name: "Backup Base de Datos",
      frequency: "Diaria",
      nextExecution: "2026-07-17T02:00",
      status: "Activa",
    },
    {
      id: crypto.randomUUID(),
      name: "Enviar Reporte",
      frequency: "Semanal",
      nextExecution: "2026-07-20T09:00",
      status: "Pausada",
    },
    {
      id: crypto.randomUUID(),
      name: "Limpieza Logs",
      frequency: "Mensual",
      nextExecution: "2026-08-01T00:30",
      status: "Activa",
    },
  ],
};

const taskSummary = document.querySelector("#task-summary");
const schedulerGrid = document.querySelector("#scheduler-grid");
const taskForm = document.querySelector("#task-form");
const taskNameInput = document.querySelector("#task-name");
const taskFrequencyInput = document.querySelector("#task-frequency");
const taskNextExecutionInput = document.querySelector("#task-next-execution");
const executionLog = document.querySelector("#execution-log");
const emptyLog = document.querySelector("#empty-log");

function createTaskCell(content) {
  const cell = document.createElement("div");

  cell.classList.add("task-cell");
  cell.textContent = content;

  return cell;
}

function createNextExecutionCell(task) {
  const cell = document.createElement("div");
  const timingStatus = getTaskTimingStatus(task);

  const timingStatusClass = {
    Atrasada: "atrasada",
    Próxima: "proxima",
    Programada: "programada",
  }[timingStatus];

  cell.classList.add("task-cell", "next-execution", timingStatusClass);

  cell.innerHTML = `
    <span>${formatNextExecution(task.nextExecution)}</span>
    <small>${timingStatus}</small>
  `;

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

function createActionCell(task) {
  const cell = document.createElement("div");
  const button = document.createElement("button");

  cell.classList.add("task-cell");

  button.classList.add("action-button");
  button.type = "button";
  button.dataset.action = "execute";
  button.dataset.taskId = task.id;
  button.textContent = "Ejecutar";
  button.disabled = task.status === "Pausada";

  cell.append(button);

  return cell;
}

function renderExecutionLog() {
  executionLog.innerHTML = "";

  if (scheduler.executionLog.length === 0) {
    executionLog.append(emptyLog);
    return;
  }

  scheduler.executionLog.forEach((entry) => {
    const item = document.createElement("p");

    item.classList.add("execution-entry");

    item.innerHTML = `
      <strong>${entry.name}</strong>
      <time>${entry.executedAt}</time>
    `;

    executionLog.append(item);
  });
}

function renderTasks() {
  schedulerGrid.querySelectorAll(".task-cell").forEach((cell) => cell.remove());

  const sortedTasks = [...scheduler.tasks].sort((taskA, taskB) => {
    if (taskA.status !== taskB.status) {
      return taskA.status === "Activa" ? -1 : 1;
    }

    return (
      new Date(taskA.nextExecution).getTime() -
      new Date(taskB.nextExecution).getTime()
    );
  });

  sortedTasks.forEach((task) => {
    schedulerGrid.append(
      createTaskCell(task.name),
      createTaskCell(task.frequency),
      createNextExecutionCell(task),
      createStatusCell(task),
      createActionCell(task),
    );
  });

  renderTaskSummary();
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

function calculateNextExecution(task) {
  const nextDate = new Date(task.nextExecution);

  switch (task.frequency) {
    case "Diaria":
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case "Semanal":
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case "Mensual":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }

  return nextDate.toISOString().slice(0, 16);
}

function getTaskTimingStatus(task) {
  const now = new Date();
  const nextExecution = new Date(task.nextExecution);
  const differenceInMilliseconds = nextExecution.getTime() - now.getTime();
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

  if (differenceInMilliseconds < 0) {
    return "Atrasada";
  }

  if (differenceInMilliseconds <= oneDayInMilliseconds) {
    return "Próxima";
  }

  return "Programada";
}

function getTaskSummary() {
  const activeTasks = scheduler.tasks.filter(
    (task) => task.status === "Activa",
  ).length;

  const pausedTasks = scheduler.tasks.filter(
    (task) => task.status === "Pausada",
  ).length;

  return {
    activeTasks,
    pausedTasks,
  };
}

function renderTaskSummary() {
  const { activeTasks, pausedTasks } = getTaskSummary();

  taskSummary.textContent = `${activeTasks} activas · ${pausedTasks} pausadas`;
}

function handleTaskSubmit(event) {
  event.preventDefault();

  const newTask = {
    id: crypto.randomUUID(),
    name: taskNameInput.value.trim(),
    frequency: taskFrequencyInput.value,
    nextExecution: taskNextExecutionInput.value,
    status: "Activa",
  };

  scheduler.tasks.push(newTask);

  renderTasks();
  taskForm.reset();
  taskNameInput.focus();
}

function handleSchedulerClick(event) {
  const executeButton = event.target.closest(".action-button");

  if (executeButton) {
    const task = scheduler.tasks.find(
      (currentTask) => currentTask.id === executeButton.dataset.taskId,
    );

    if (!task) {
      return;
    }

    scheduler.executionLog.unshift({
      name: task.name,
      executedAt: new Intl.DateTimeFormat("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(new Date()),
    });

    task.nextExecution = calculateNextExecution(task);

    renderExecutionLog();
    renderTasks();
    return;
  }

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
renderExecutionLog();
