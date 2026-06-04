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
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    taskInput.value = '';
    taskInput.focus();
}

// Eliminar tarea
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
}

// Marcar tarea como completada
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
    }
}

// Editar tarea
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const li = document.querySelector(`li[data-id="${id}"]`);
    const span = li.querySelector('.task-text');
    const editBtn = li.querySelector('.btn-edit');
    
    if (li.classList.contains('editing')) {
        // Guardar cambios
        const input = li.querySelector('.task-text');
        task.text = input.value.trim();
        if (task.text) {
            saveTasks();
        }
        li.classList.remove('editing');
        editBtn.textContent = '✏️';
    } else {
        // Modo edición
        li.classList.add('editing');
        span.innerHTML = `<input type="text" class="task-text" value="${task.text}">`;
        editBtn.textContent = '💾';
        
        const input = li.querySelector('.task-text');
        input.focus();
        input.select();
    }
}

function updateStats() {
    const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length
    };
    
    // Guardar stats en localStorage para el dashboard
    localStorage.setItem('taskflow_stats', JSON.stringify(stats));
}

// Configurar event listeners
function setupEventListeners() {
    if (taskForm) {
        taskForm.addEventListener('submit', addTask);
    }
    
    if (taskList) {
        taskList.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            
            const id = parseInt(li.dataset.id);
            
            if (e.target.classList.contains('task-checkbox')) {
                toggleComplete(id);
            } else if (e.target.classList.contains('btn-delete')) {
                deleteTask(id);
            } else if (e.target.classList.contains('btn-edit')) {
                editTask(id);
            }
        });
    }
    
    // Filtros
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
}