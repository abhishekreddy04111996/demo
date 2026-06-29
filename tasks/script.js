// Daily Tasks Notes App

const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const dueDateInput = document.getElementById('dueDateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const currentDateEl = document.getElementById('currentDate');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const fileInput = document.getElementById('fileInput');
const totalCountEl = document.getElementById('totalCount');
const completedCountEl = document.getElementById('completedCount');
const pendingCountEl = document.getElementById('pendingCount');

let tasks = [];
let currentFilter = 'all';
const STORAGE_KEY = 'daily-tasks-notes';

// Initialize app
function init() {
    loadTasks();
    updateDate();
    renderTasks();
    attachEventListeners();
}

// Update current date display
function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', options);
}

// Load tasks from localStorage
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Add event listeners
function attachEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);
    exportBtn.addEventListener('click', exportTasks);
    importBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', importTasks);
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        category: categorySelect.value,
        priority: prioritySelect.value.toLowerCase(),
        dueDate: dueDateInput.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    resetForm();
}

// Reset form
function resetForm() {
    taskInput.value = '';
    dueDateInput.value = '';
    prioritySelect.value = 'Medium';
    categorySelect.value = 'Personal';
    taskInput.focus();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    }
}

// Format date for display
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Render tasks list
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <div class="task-content">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    <div class="task-meta">
                        <span class="badge category">${task.category}</span>
                        <span class="badge priority-${task.priority}">🔥 ${task.priority}</span>
                        ${task.dueDate ? `<span class="badge due-date">📅 ${formatDate(task.dueDate)}</span>` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <button class="delete-btn" onclick="deleteTask(${task.id})">🗑️</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }
    updateStats();
}

// Filter tasks
function getFilteredTasks() {
    return tasks.filter(task => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'active') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        return task.category === currentFilter;
    });
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalCountEl.textContent = total;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = pending;
}

// Export tasks as JSON
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// Import tasks from JSON
function importTasks(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            if (!Array.isArray(imported)) throw new Error('Invalid format');
            tasks = [...tasks, ...imported];
            saveTasks();
            renderTasks();
            alert('Tasks imported successfully!');
        } catch (error) {
            alert('Error importing tasks: ' + error.message);
        }
    };
    reader.readAsText(file);
    fileInput.value = '';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Set today's date as default
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dueDateInput.value = today;
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    init();
    setDefaultDate();
});