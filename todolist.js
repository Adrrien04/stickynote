class Task {
    constructor(title, description, author, assignee, priority) {
        this.title = title;
        this.description = description;
        this.author = author;
        this.assignee = assignee;
        this.priority = priority;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    updateTask(oldTitle, newTask) {
        const taskIndex = this.tasks.findIndex(task => task.title === oldTitle);
        if (taskIndex !== -1) this.tasks[taskIndex] = newTask;
    }

    deleteTask(taskTitle) {
        this.tasks = this.tasks.filter(task => task.title !== taskTitle);
    }
}

const taskManager = new TaskManager();
let editingTaskTitle = null;

function updateEmptyPostItVisibility() {
    const emptyPostIt = document.getElementById('emptyPostIt');
    emptyPostIt.style.display = taskManager.tasks.length === 0 ? 'block' : 'none';
}


document.getElementById('addTaskButton').addEventListener('click', () => {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const author = document.getElementById('taskAuthor').value;
    const assignee = document.getElementById('taskAssignee').value;
    const priority = document.getElementById('taskPriority').value;

    if (title && description && author && assignee && priority) {
        const task = new Task(title, description, author, assignee, priority);

        if (editingTaskTitle) {

            taskManager.updateTask(editingTaskTitle, task);
            updateTaskInDOM(editingTaskTitle, task);
            editingTaskTitle = null;
        } else {
            taskManager.addTask(task);
            addTaskToDOM(task);
        }

        clearForm();
        $('#taskModal').modal('hide');

        updateEmptyPostItVisibility();
    }
});


function addTaskToDOM(task) {
    const note = document.createElement('div');
    note.classList.add('sticky-note', 'appear');
    note.innerHTML = `
        <div class="title">${task.title}</div>
        <div class="description">${task.description}</div>
        <div class="author"><strong>Auteur :</strong> ${task.author}</div>
        <div class="assignee"><strong>Assigné à :</strong> ${task.assignee}</div>
        <div class="priority ${task.priority}"></div>
        <button class="edit-button btn btn-outline-primary">✏️</button>
        <button class="delete-button btn btn-outline-danger">🗑️</button>
    `;
    document.getElementById('taskList').appendChild(note);
}


function updateTaskInDOM(oldTitle, updatedTask) {
    const taskElement = Array.from(document.querySelectorAll('.sticky-note')).find(
        note => note.querySelector('.title').textContent === oldTitle
    );
    if (taskElement) {
        taskElement.querySelector('.title').textContent = updatedTask.title;
        taskElement.querySelector('.description').textContent = updatedTask.description;
        taskElement.querySelector('.author').innerHTML = `<strong>Auteur :</strong> ${updatedTask.author}`;
        taskElement.querySelector('.assignee').innerHTML = `<strong>Assigné à :</strong> ${updatedTask.assignee}`;
        taskElement.querySelector('.priority').className = `priority ${updatedTask.priority}`;
    }
}


document.getElementById('taskList').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-button')) {
        const taskTitle = event.target.parentElement.querySelector('.title').textContent;
        taskManager.deleteTask(taskTitle);
        const note = event.target.parentElement;
        note.classList.add('explode');
        setTimeout(() => {
            note.remove();
            updateEmptyPostItVisibility();
        }, 500);
    }

    if (event.target.classList.contains('edit-button')) {
        const taskTitle = event.target.parentElement.querySelector('.title').textContent;
        const task = taskManager.tasks.find(task => task.title === taskTitle);

        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.getElementById('taskAuthor').value = task.author;
        document.getElementById('taskAssignee').value = task.assignee;
        document.getElementById('taskPriority').value = task.priority;

        editingTaskTitle = task.title;
        $('#taskModal').modal('show');
    }
});

function clearForm() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskAuthor').value = '';
    document.getElementById('taskAssignee').value = '';
}


$('#taskModal').on('hidden.bs.modal', () => {
    editingTaskTitle = null;
});

window.addEventListener('load', updateEmptyPostItVisibility);
