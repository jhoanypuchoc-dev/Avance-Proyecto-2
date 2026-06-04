// Constantes
const STORAGE_KEY = 'taskflow_tareas';
const STATS_KEY = 'taskflow_stats';

// Elementos del DOM
const statTotal = document.getElementById('stat-total');
const statCompleted = document.getElementById('stat-completed');
const statPending = document.getElementById('stat-pending');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const barPending = document.getElementById('bar-pending');
const barCompleted = document.getElementById('bar-completed');
const labelPending = document.getElementById('label-pending');
const labelCompleted = document.getElementById('label-completed');
const pieChart = document.getElementById('pie-chart');
const motivationText = document.getElementById('motivation-text');
const motivationCard = document.getElementById('motivation-card');

// Mensajes motivacionales
const motivations = [
    "¡Cada tarea completada te acerca a tu meta! 🚀",
    "¡Sigue así! El éxito es la suma de pequeños esfuerzos 💪",
    "¡Excelente trabajo! Sigue manteniendo el ritmo ⚡",
    "¡Tu productividad mejora cada día! 🌟",
    "¡Un paso más cerca de tus objetivos! 🎯",
    "¡Sigue adelante! Los resultados llegarán 🌈",
    "¡Estás haciendo un gran trabajo! 👏",
    "¡La constancia es la clave del éxito! 🔑"
];

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});

// Cargar estadísticas
function loadStats() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    let tasks = [];
    
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Actualizar valores en el DOM
    updateStatsDisplay(total, completed, pending, percentage);
    renderBarChart(pending, completed, total);
    renderPieChart(pending, completed);
    updateMotivation(completed);
}

// Actualizar visualización de estadísticas
function updateStatsDisplay(total, completed, pending, percentage) {
    if (statTotal) statTotal.textContent = total;
    if (statCompleted) statCompleted.textContent = completed;
    if (statPending) statPending.textContent = pending;
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.textContent = percentage + '%';
    }
    
    if (progressText) {
        progressText.textContent = `${completed} de ${total} tareas completadas`;
    }
}

// Renderizar gráfico de barras
function renderBarChart(pending, completed, total) {
    const pendingPercent = total > 0 ? (pending / total) * 100 : 0;
    const completedPercent = total > 0 ? (completed / total) * 100 : 0;
    
    if (barPending) {
        barPending.style.height = pendingPercent + '%';
    }
    if (barCompleted) {
        barCompleted.style.height = completedPercent + '%';
    }
    if (labelPending) {
        labelPending.textContent = Math.round(pendingPercent) + '%';
    }
    if (labelCompleted) {
        labelCompleted.textContent = Math.round(completedPercent) + '%';
    }
}

// Renderizar gráfico circular (pie chart)
function renderPieChart(pending, completed) {
    if (!pieChart) return;
    
    const ctx = pieChart.getContext('2d');
    const total = pending + completed;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, pieChart.width, pieChart.height);
    
    if (total === 0) {
        // Mostrar círculo vacío
        ctx.beginPath();
        ctx.arc(100, 100, 80, 0, 2 * Math.PI);
        ctx.fillStyle = '#e0e0e0';
        ctx.fill();
        return;
    }
    
    const completedAngle = (completed / total) * 2 * Math.PI;
    const pendingAngle = (pending / total) * 2 * Math.PI;
    
    // Dibujar segmento completado (verde)
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 80, -0.5 * Math.PI, -0.5 * Math.PI + completedAngle);
    ctx.fillStyle = '#2ecc71';
    ctx.fill();
    
    // Dibujar segmento pendiente (naranja)
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.arc(100, 100, 80, -0.5 * Math.PI + completedAngle, -0.5 * Math.PI + completedAngle + pendingAngle);
    ctx.fillStyle = '#f39c12';
    ctx.fill();
    
    // Dibujar círculo central (para efecto donut)
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    
    // Añadir texto en el centro
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    ctx.fillStyle = '#2c3e50';
    ctx.font = 'bold 24px Segoe UI';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(percentage + '%', 100, 100);
}

// Actualizar mensaje motivacional
function updateMotivation(completed) {
    if (!motivationText) return;
    
    let message;
    
    if (completed === 0) {
        message = "¡Comienza a agregar tareas para ver tu progreso! 🌱";
    } else if (completed < 3) {
        message = "¡Buen comienzo! Sigue añadiendo tareas 📝";
    } else if (completed < 5) {
        message = "¡Vas muy bien! Continuemos así 💪";
    } else if (completed < 10) {
        message = motivations[Math.floor(Math.random() * motivations.length)];
    } else if (completed < 20) {
        message = "¡Increíble! Has completado muchas tareas 🎉";
    } else {
        message = "¡Eres una máquina de productividad! 🌟";
    }
    
    motivationText.textContent = message;
    
    // Actualizar color según el progreso
    if (motivationCard) {
        if (completed >= 10) {
            motivationCard.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        } else if (completed >= 5) {
            motivationCard.style.background = 'linear-gradient(135deg, #4a90e2, #667eea)';
        } else {
            motivationCard.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
        }
    }
}

// Actualizar cada 5 segundos (para cuando se añaden tareas desde otra página)
setInterval(() => {
    loadStats();
}, 5000);