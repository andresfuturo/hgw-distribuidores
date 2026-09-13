// Agenda Interactiva - JavaScript

let currentDate = new Date();
let selectedDate = null;
let events = JSON.parse(localStorage.getItem('hgwEvents')) || {};

// Elementos del DOM
const calendarDays = document.getElementById('calendarDays');
const currentMonthElement = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const selectedDateElement = document.getElementById('selectedDate');
const eventsListElement = document.getElementById('eventsList');
const addEventBtn = document.getElementById('addEventBtn');
const eventModal = document.getElementById('eventModal');
const eventForm = document.getElementById('eventForm');
const modalTitle = document.getElementById('modalTitle');
const closeBtn = document.querySelector('.close');
const deleteEventBtn = document.getElementById('deleteEventBtn');

// Inicializar calendario
function initCalendar() {
    renderCalendar();
    setupEventListeners();
}

// Renderizar calendario
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Nombre del mes
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Limpiar días
    calendarDays.innerHTML = '';
    
    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    // Días vacíos antes del primer día
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Días del mes
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dateString = formatDate(year, month, day);
        dayElement.dataset.date = dateString;
        
        // Marcar hoy
        if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
            dayElement.classList.add('today');
        }
        
        // Marcar seleccionado
        if (selectedDate === dateString) {
            dayElement.classList.add('selected');
        }
        
        // Número del día
        const dayNumber = document.createElement('span');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);
        
        // Eventos del día
        if (events[dateString] && events[dateString].length > 0) {
            const dayEvents = document.createElement('div');
            dayEvents.className = 'day-events';
            
            events[dateString].forEach(event => {
                const eventDot = document.createElement('span');
                eventDot.className = 'event-dot';
                eventDot.style.backgroundColor = event.color;
                dayEvents.appendChild(eventDot);
                
                const eventSmall = document.createElement('div');
                eventSmall.className = 'event-item-small';
                eventSmall.textContent = `${event.time} ${event.title}`;
                eventSmall.style.borderLeft = `3px solid ${event.color}`;
                dayEvents.appendChild(eventSmall);
            });
            
            dayElement.appendChild(dayEvents);
        }
        
        // Click en día
        dayElement.addEventListener('click', () => selectDate(dateString));
        
        calendarDays.appendChild(dayElement);
    }
}

// Seleccionar fecha
function selectDate(dateString) {
    selectedDate = dateString;
    renderCalendar();
    showEventsForDate(dateString);
}

// Mostrar eventos de una fecha
function showEventsForDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateElement.textContent = date.toLocaleDateString('es-ES', options);
    
    eventsListElement.innerHTML = '';
    
    if (events[dateString] && events[dateString].length > 0) {
        // Ordenar eventos por hora
        const sortedEvents = [...events[dateString]].sort((a, b) => a.time.localeCompare(b.time));
        
        sortedEvents.forEach((event, index) => {
            const eventItem = document.createElement('div');
            eventItem.className = 'event-item';
            eventItem.style.borderLeftColor = event.color;
            
            eventItem.innerHTML = `
                <div class="event-time">${event.time}</div>
                <div class="event-title">${event.title}</div>
                ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
            `;
            
            eventItem.addEventListener('click', () => editEvent(dateString, index));
            
            eventsListElement.appendChild(eventItem);
        });
    } else {
        eventsListElement.innerHTML = '<div class="no-events">No hay eventos para este día</div>';
    }
}

// Formatear fecha
function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// Configurar event listeners
function setupEventListeners() {
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    
    addEventBtn.addEventListener('click', () => {
        if (!selectedDate) {
            alert('Por favor, selecciona una fecha primero');
            return;
        }
        openModal();
    });
    
    closeBtn.addEventListener('click', closeModal);
    
    eventModal.addEventListener('click', (e) => {
        if (e.target === eventModal) {
            closeModal();
        }
    });
    
    eventForm.addEventListener('submit', saveEvent);
    
    deleteEventBtn.addEventListener('click', deleteEvent);
}

// Abrir modal
function openModal(eventData = null) {
    eventModal.style.display = 'block';
    
    if (eventData) {
        modalTitle.textContent = 'Editar Evento';
        document.getElementById('eventId').value = eventData.index;
        document.getElementById('eventTitle').value = eventData.title;
        document.getElementById('eventTime').value = eventData.time;
        document.getElementById('eventDescription').value = eventData.description || '';
        document.getElementById('eventColor').value = eventData.color;
        deleteEventBtn.style.display = 'inline-block';
    } else {
        modalTitle.textContent = 'Añadir Evento';
        eventForm.reset();
        document.getElementById('eventId').value = '';
        deleteEventBtn.style.display = 'none';
    }
}

// Cerrar modal
function closeModal() {
    eventModal.style.display = 'none';
}

// Guardar evento
function saveEvent(e) {
    e.preventDefault();
    
    const eventId = document.getElementById('eventId').value;
    const title = document.getElementById('eventTitle').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value;
    const color = document.getElementById('eventColor').value;
    
    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }
    
    if (eventId !== '') {
        // Editar evento existente
        const index = parseInt(eventId);
        events[selectedDate][index] = { title, time, description, color };
    } else {
        // Añadir nuevo evento
        events[selectedDate].push({ title, time, description, color });
    }
    
    // Guardar en localStorage
    localStorage.setItem('hgwEvents', JSON.stringify(events));
    
    closeModal();
    renderCalendar();
    showEventsForDate(selectedDate);
}

// Editar evento
function editEvent(dateString, index) {
    selectedDate = dateString;
    const eventData = events[dateString][index];
    eventData.index = index;
    openModal(eventData);
}

// Eliminar evento
function deleteEvent() {
    const eventId = document.getElementById('eventId').value;
    const index = parseInt(eventId);
    
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        events[selectedDate].splice(index, 1);
        
        if (events[selectedDate].length === 0) {
            delete events[selectedDate];
        }
        
        localStorage.setItem('hgwEvents', JSON.stringify(events));
        
        closeModal();
        renderCalendar();
        showEventsForDate(selectedDate);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCalendar);