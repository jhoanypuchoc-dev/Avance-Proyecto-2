// Constante para LocalStorage
const STORAGE_KEY = 'taskflow_tareas';

// Elementos del DOM
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyMessage = document.getElementById('empty-message');
const filterButtons = document.querySelectorAll('.filter-btn');

// Estado de la aplicación
let tasks = [];
let currentFilter = 'all';

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Cargar tareas desde LocalStorage
function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    renderTasks();
}

// Guardar tareas en LocalStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    renderTasks();
}

// Renderizar la lista de tareas
function renderTasks() {
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    // Aplicar filtro
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    // Mostrar mensaje vacío
    if (filteredTasks.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }
    
    // Crear elementos
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <div class="task-content">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
            </div>
            <div class="task-actions">
                <button class="btn-edit" title="Editar">✏️</button>
                <button class="btn-delete" title="Eliminar">🗑️</button>
            </div>
        `;
        
        taskList.appendChild(li);
    });
    
    updateStats();
}

// Agregar nueva tarea
function addTask(e) {
    e.preventDefault();
    
    const text = taskInput.value.trim();
    if (!text) return;
    
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString