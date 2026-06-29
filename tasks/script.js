// Advanced Daily Tasks Notes App

const taskInput = document.getElementById('taskInput');
const taskDescription = document.getElementById('taskDescription');
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
const navTabs = document.querySelectorAll('.nav-tab');
const tabContents = document.querySelectorAll('.tab-content');

// Tab elements
const totalCountEl = document.getElementById('totalCount');
const completedCountEl = document.getElementById('completedCount');
const pendingCountEl = document.getElementById('pendingCount');

// Weekly elements
const prevWeekBtn = document.getElementById('prevWeekBtn');
const nextWeekBtn = document.getElementById('nextWeekBtn');
const weekRange = document.getElementById('weekRange');
const weekTaskCount = document.getElementById('weekTaskCount');
const weekCompletedCount = document.getElementById('weekCompletedCount');
const weekCompletionPercent = document.getElementById('weekCompletionPercent');
const weeklyTasksList = document.getElementById('weeklyTasksList');

// Monthly elements
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const monthRange = document.getElementById('monthRange');
const monthTaskCount = document.getElementById('monthTaskCount');
const monthCompletedCount = document.getElementById('monthCompletedCount');
const monthCompletionPercent = document.getElementById('monthCompletionPercent');
const perfectScore = document.getElementById('perfectScore');
const calendarGrid = document.getElementById('calendarGrid');
const monthlyTasksList = document.getElementById('monthlyTasksList');

// Stats elements
const allTotalTasks = document.getElementById('allTotalTasks');
const allCompletedTasks = document.getElementById('allCompletedTasks');
const overallCompletion = document.getElementById('overallCompletion');
const onTimePercent = document.getElementById('onTimePercent');
const overdueTasks = document.getElementById('overdueTasks');
const avgTasksPerDay = document.getElementById('avgTasksPerDay');
const categoryStats = document.getElementById('categoryStats');
const priorityStats = document.getElementById('priorityStats');
const perfectionFill = document.getElementById('perfectionFill');
const perfectionText = document.getElementById('perfectionText');
const perfectionMessage = document.getElementById('perfectionMessage');

let tasks = [];
let currentFilter = 'all';
let currentWeekOffset = 0;
let currentMonthOffset = 0;
const STORAGE_KEY = 'daily-tasks-notes-advanced';

// Initialize app
function init() {
    loadTasks();
    updateDate();
    renderTasks();
    attachEventListeners();
    setDefaultDate();
    updateWeeklyView();
    updateMonthlyView();
    updateStatsView();
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

// Tab navigation
function attachEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Tab switching
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            if (tabName === 'weekly') updateWeeklyView();
            if (tabName === 'monthly') updateMonthlyView();
            if (tabName === 'stats') updateStatsView();
        });
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

    // Weekly navigation
    prevWeekBtn.addEventListener('click', () => {
        currentWeekOffset--;
        updateWeeklyView();
    });
    nextWeekBtn.addEventListener('click', () => {
        currentWeekOffset++;
        updateWeeklyView();
    });

    // Monthly navigation
    prevMonthBtn.addEventListener('click', () => {
        currentMonthOffset--;
        updateMonthlyView();
    });
    nextMonthBtn.addEventListener('click', () => {
        currentMonthOffset++;
        updateMonthlyView();
    });
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
        description: taskDescription.value.trim(),
        category: categorySelect.value,
        priority: prioritySelect.value.toLowerCase(),
        dueDate: dueDateInput.value,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    resetForm();
}

// Reset form
function resetForm() {
    taskInput.value = '';
    taskDescription.value = '';
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
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
        updateWeeklyView();
        updateMonthlyView();
        updateStatsView();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateWeeklyView();
    updateMonthlyView();
    updateStatsView();
}

// Clear completed tasks
function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateWeeklyView();
        updateMonthlyView();
        updateStatsView();
    }
}

// Format date
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

// Check if task is overdue
function isOverdue(task) {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
}

// Render daily tasks
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    taskList.innerHTML = '';

    if (filteredTasks.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.priority} ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <div class="task-content">
                    <div class="task-text">${escapeHtml(task.text)}</div>
                    ${task.description ? `<div class="task-description-display">${escapeHtml(task.description)}</div>` : ''}
                    <div class="task-meta">
                        <span class="badge category">${task.category}</span>
                        <span class="badge priority-${task.priority}">🔥 ${task.priority}</span>
                        ${task.dueDate ? `<span class="badge due-date">📅 ${formatDate(task.dueDate)}${isOverdue(task) ? ' ⚠️' : ''}</span>` : ''}
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

// Update daily stats
function updateStats() {
    const today = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(t => t.dueDate === today);
    const total = todaysTasks.length;
    const completed = todaysTasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalCountEl.textContent = total;
    completedCountEl.textContent = completed;
    pendingCountEl.textContent = pending;
}

// Get week dates
function getWeekDates(offset = 0) {
    const today = new Date();
    const first = today.getDate() - today.getDay() + (offset * 7);
    const last = first + 6;
    const startDate = new Date(today.setDate(first));
    const endDate = new Date(today.setDate(last));
    return { startDate, endDate };
}

// Update weekly view
function updateWeeklyView() {
    const { startDate, endDate } = getWeekDates(currentWeekOffset);
    const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weekRange.textContent = `${startStr} - ${endStr}`;

    const weekTasks = tasks.filter(t => {
        const taskDate = new Date(t.dueDate || t.createdAt);
        return taskDate >= startDate && taskDate <= endDate;
    });

    const weekCompleted = weekTasks.filter(t => t.completed).length;
    const weekTotal = weekTasks.length;
    const weekPercent = weekTotal === 0 ? 0 : Math.round((weekCompleted / weekTotal) * 100);

    weekTaskCount.textContent = weekTotal;
    weekCompletedCount.textContent = weekCompleted;
    weekCompletionPercent.textContent = `${weekPercent}%`;

    weeklyTasksList.innerHTML = '';
    if (weekTasks.length === 0) {
        weeklyTasksList.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;">No tasks for this week</p>';
    } else {
        weekTasks.forEach(task => {
            const div = document.createElement('div');
            div.className = `weekly-task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <strong>${escapeHtml(task.text)}</strong>
                ${task.description ? `<p style="margin-top:5px;font-size:0.9em;color:#6b7280;">${escapeHtml(task.description)}</p>` : ''}
                <small>📅 ${formatDate(task.dueDate)} • ${task.category} • ${task.priority} ${task.completed ? '✅' : '⏳'}</small>
            `;
            weeklyTasksList.appendChild(div);
        });
    }
}

// Get month dates
function getMonthDates(offset = 0) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + offset;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { firstDay, lastDay, month: month % 12, year };
}

// Update monthly view
function updateMonthlyView() {
    const { firstDay, lastDay, month, year } = getMonthDates(currentMonthOffset);
    const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    monthRange.textContent = monthName;

    const monthTasks = tasks.filter(t => {
        const taskDate = new Date(t.dueDate || t.createdAt);
        return taskDate >= firstDay && taskDate <= lastDay;
    });

    const monthCompleted = monthTasks.filter(t => t.completed).length;
    const monthTotal = monthTasks.length;
    const monthPercent = monthTotal === 0 ? 0 : Math.round((monthCompleted / monthTotal) * 100);

    monthTaskCount.textContent = monthTotal;
    monthCompletedCount.textContent = monthCompleted;
    monthCompletionPercent.textContent = `${monthPercent}%`;

    // Calculate perfection score
    const onTimeCount = monthTasks.filter(t => t.completed && t.dueDate && new Date(t.completedAt) <= new Date(t.dueDate)).length;
    const perfectScore_calc = monthTotal === 0 ? 10 : Math.min(10, Math.round((onTimeCount / monthTotal) * 10));
    perfectScore.textContent = `${perfectScore_calc}/10`;

    // Render calendar
    calendarGrid.innerHTML = '';
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDiv = document.createElement('div');
        calendarGrid.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day).toISOString().split('T')[0];
        const dayTasks = monthTasks.filter(t => (t.dueDate || t.createdAt).startsWith(date));
        const allCompleted = dayTasks.length > 0 && dayTasks.every(t => t.completed);

        const div = document.createElement('div');
        div.className = 'calendar-day';
        if (dayTasks.length > 0) div.classList.add('has-tasks');
        if (allCompleted) div.classList.add('completed');
        div.textContent = day;
        if (dayTasks.length > 0) div.innerHTML += `<br><small>${dayTasks.length}</small>`;
        calendarGrid.appendChild(div);
    }

    // Render monthly tasks
    monthlyTasksList.innerHTML = '';
    if (monthTasks.length === 0) {
        monthlyTasksList.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;">No tasks for this month</p>';
    } else {
        monthTasks.forEach(task => {
            const div = document.createElement('div');
            div.className = `monthly-task-item ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <strong>${escapeHtml(task.text)}</strong>
                ${task.description ? `<p style="margin-top:5px;font-size:0.9em;color:#6b7280;">${escapeHtml(task.description)}</p>` : ''}
                <small>📅 ${formatDate(task.dueDate)} • ${task.category} • ${task.priority} ${task.completed ? '✅' : '⏳'}</small>
            `;
            monthlyTasksList.appendChild(div);
        });
    }
}

// Update stats view
function updateStatsView() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => isOverdue(t)).length;

    allTotalTasks.textContent = total;
    allCompletedTasks.textContent = completed;
    overallCompletion.textContent = total === 0 ? '0%' : `${Math.round((completed / total) * 100)}%`;
    overdueTasks.textContent = overdue;

    // On-time completion
    const completedOnTime = tasks.filter(t => t.completed && t.dueDate && new Date(t.completedAt) <= new Date(t.dueDate)).length;
    const completedWithDueDate = tasks.filter(t => t.completed && t.dueDate).length;
    onTimePercent.textContent = completedWithDueDate === 0 ? '0%' : `${Math.round((completedOnTime / completedWithDueDate) * 100)}%`;

    // Average tasks per day
    const daysSinceStart = tasks.length === 0 ? 1 : Math.ceil((new Date() - new Date(tasks[tasks.length - 1].createdAt)) / (1000 * 60 * 60 * 24)) || 1;
    avgTasksPerDay.textContent = (total / Math.max(daysSinceStart, 1)).toFixed(1);

    // Category stats
    const categories = {};
    tasks.forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + 1;
    });
    categoryStats.innerHTML = Object.entries(categories).map(([cat, count]) => 
        `<div class="category-stat-item"><span>${cat}:</span> <span>${count}</span></div>`
    ).join('');

    // Priority stats
    const priorities = {};
    tasks.forEach(t => {
        priorities[t.priority] = (priorities[t.priority] || 0) + 1;
    });
    priorityStats.innerHTML = Object.entries(priorities).map(([pri, count]) => 
        `<div class="priority-stat-item"><span>${pri}:</span> <span>${count}</span></div>`
    ).join('');

    // Overall perfection score
    const perfectionScore = total === 0 ? 100 : Math.round(((completed / total) * 50) + ((100 - (overdue / Math.max(total, 1)) * 100) * 0.5));
    const perfectionPercentage = Math.min(100, perfectionScore);
    perfectionFill.style.width = perfectionPercentage + '%';
    perfectionText.textContent = `${perfectionPercentage}/100`;

    if (perfectionPercentage >= 90) perfectionMessage.textContent = '🌟 Outstanding! Keep it up!';
    else if (perfectionPercentage >= 75) perfectionMessage.textContent = '⭐ Great work! You\'re doing well!';
    else if (perfectionPercentage >= 50) perfectionMessage.textContent = '💪 Good effort! Room for improvement.';
    else perfectionMessage.textContent = '📈 Keep pushing! You can do better!';
}

// Export tasks
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

// Import tasks
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
            updateWeeklyView();
            updateMonthlyView();
            updateStatsView();
            alert('Tasks imported successfully!');
        } catch (error) {
            alert('Error importing tasks: ' + error.message);
        }
    };
    reader.readAsText(file);
    fileInput.value = '';
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Set default date
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dueDateInput.value = today;
}

// Initialize
window.addEventListener('DOMContentLoaded', init);