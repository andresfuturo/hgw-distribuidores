// Agenda Interactiva - JavaScript

let currentDate = new Date();
let selectedDate = null;
let events = {};

// Cargar eventos desde localStorage con manejo de errores
function loadEvents() {
    try {
        // Verificar si localStorage está disponible
        if (typeof localStorage === 'undefined') {
            console.error('localStorage no está disponible en este navegador');
            alert('Su navegador no soporta almacenamiento local. Los eventos no se guardarán.');
            events = {};
            return;
        }

        const storedEvents = localStorage.getItem('hgwEvents');
        if (storedEvents) {
            events = JSON.parse(storedEvents);
            console.log('Eventos cargados:', Object.keys(events).length, 'días con eventos');
            console.log('Eventos:', events);
        } else {
            events = {};
            console.log('No hay eventos guardados, iniciando con agenda vacía');
        }
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        events = {};
    }
}

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
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

// Guardar eventos en localStorage con manejo de errores
function saveEvents() {
    try {
        // Verificar si localStorage está disponible
        if (typeof localStorage === 'undefined') {
            console.error('localStorage no está disponible');
            alert('Su navegador no soporta almacenamiento local. Los eventos no se guardarán.');
            return false;
        }

        // Verificar cuota de almacenamiento
        const eventsString = JSON.stringify(events);
        const sizeInBytes = new Blob([eventsString]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(2);
        
        console.log('Guardando eventos - Tamaño:', sizeInKB, 'KB');
        console.log('Cantidad de días con eventos:', Object.keys(events).length);
        
        localStorage.setItem('hgwEvents', eventsString);
        
        // Verificar que se guardó correctamente
        const savedEvents = localStorage.getItem('hgwEvents');
        if (savedEvents === eventsString) {
            console.log('Eventos guardados y verificados exitosamente');
            return true;
        } else {
            console.error('Error: Los eventos no se guardaron correctamente');
            return false;
        }
    } catch (error) {
        console.error('Error al guardar eventos:', error);
        if (error.name === 'QuotaExceededError') {
            alert('Error: Espacio de almacenamiento lleno. Por favor, elimine algunos eventos o use un navegador diferente.');
        } else {
            alert('Error al guardar los eventos: ' + error.message);
        }
        return false;
    }
}

// Inicializar calendario
function initCalendar() {
    loadEvents();
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
                <div class="event-content">
                    <div class="event-time">${event.time}</div>
                    <div class="event-title">${event.title}</div>
                    ${event.description ? `<div class="event-description">${event.description}</div>` : ''}
                </div>
                <div class="event-actions">
                    <button class="btn-edit" data-index="${index}">✏️</button>
                    <button class="btn-delete" data-index="${index}">🗑️</button>
                </div>
            `;
            
            // Botón editar
            const editBtn = eventItem.querySelector('.btn-edit');
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                editEvent(dateString, index);
            });
            
            // Botón eliminar
            const deleteBtn = eventItem.querySelector('.btn-delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteEventDirect(dateString, index);
            });
            
            // Click en el evento para editar
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
    
    // Event listeners para exportar/importar
    exportBtn.addEventListener('click', exportEvents);
    importFile.addEventListener('change', importEvents);
    
    // Mostrar información de localStorage en la consola
    checkLocalStorageStatus();
}

// Verificar estado de localStorage
function checkLocalStorageStatus() {
    try {
        const testKey = 'hgwTest_' + Date.now();
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        console.log('✓ localStorage está funcionando correctamente');
    } catch (error) {
        console.error('✗ localStorage no está disponible:', error);
    }
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
    
    // Guardar en localStorage usando la función centralizada
    if (saveEvents()) {
        closeModal();
        renderCalendar();
        showEventsForDate(selectedDate);
    }
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
        
        if (saveEvents()) {
            closeModal();
            renderCalendar();
            showEventsForDate(selectedDate);
        }
    }
}

// Eliminar evento directamente desde la lista
function deleteEventDirect(dateString, index) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
        events[dateString].splice(index, 1);
        
        if (events[dateString].length === 0) {
            delete events[dateString];
        }
        
        if (saveEvents()) {
            renderCalendar();
            showEventsForDate(dateString);
        }
    }
}

// Exportar eventos a archivo JSON
function exportEvents() {
    try {
        const eventsString = JSON.stringify(events, null, 2);
        const blob = new Blob([eventsString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hgw_agenda_backup_' + new Date().toISOString().split('T')[0] + '.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log('Eventos exportados exitosamente');
    } catch (error) {
        console.error('Error al exportar eventos:', error);
        alert('Error al exportar eventos: ' + error.message);
    }
}

// Importar eventos desde archivo JSON
function importEvents(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedEvents = JSON.parse(e.target.result);
            if (typeof importedEvents === 'object' && importedEvents !== null) {
                events = importedEvents;
                if (saveEvents()) {
                    alert('Eventos importados exitosamente');
                    renderCalendar();
                    if (selectedDate) {
                        showEventsForDate(selectedDate);
                    }
                }
            } else {
                alert('El archivo no tiene el formato correcto');
            }
        } catch (error) {
            console.error('Error al importar eventos:', error);
            alert('Error al importar eventos: El archivo no es un JSON válido');
        }
    };
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCalendar);