class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    addToHead(value) {
        const newNode = new Node(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            newNode.next = this.head;
            this.head = newNode;
        }
        this.size++;
    }
    
    addToTail(value) {
        const newNode = new Node(value);
        if (!this.tail) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;
    }
    
    removeHead() {
        if (!this.head) return null;
        const removedValue = this.head.value;
        this.head = this.head.next;
        if (!this.head) {
            this.tail = null;
        }
        this.size--;
        return removedValue;
    }
    
    removeTail() {
        if (!this.tail) return null;
        
        if (this.head === this.tail) {
            const removedValue = this.head.value;
            this.head = null;
            this.tail = null;
            this.size--;
            return removedValue;
        }
        
        let current = this.head;
        while (current.next !== this.tail) {
            current = current.next;
        }
        
        const removedValue = this.tail.value;
        this.tail = current;
        this.tail.next = null;
        this.size--;
        return removedValue;
    }
    
    search(value) {
        let current = this.head;
        let index = 0;
        while (current) {
            if (current.value === value) {
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }
    
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.value);
            current = current.next;
        }
        return result;
    }
}

// Создаем экземпляр списка
const linkedList = new LinkedList();

// Элементы DOM
const valueInput = document.getElementById('valueInput');
const addToHeadBtn = document.getElementById('addToHead');
const addToTailBtn = document.getElementById('addToTail');
const removeHeadBtn = document.getElementById('removeHead');
const removeTailBtn = document.getElementById('removeTail');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const listContainer = document.getElementById('listContainer');
const sizeDisplay = document.getElementById('sizeDisplay');
const searchResult = document.getElementById('searchResult');

// Функция для отображения списка
function renderList() {
    listContainer.innerHTML = '';
    let current = linkedList.head;
    
    while (current) {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.innerHTML = `
            <div class="node-value">${current.value}</div>
            ${current.next ? '<div class="node-arrow">→</div>' : ''}
        `;
        listContainer.appendChild(nodeElement);
        current = current.next;
    }
    
    sizeDisplay.textContent = linkedList.size;
}

// Обработчики событий
addToHeadBtn.addEventListener('click', () => {
    const value = parseInt(valueInput.value);
    if (!isNaN(value)) {
        linkedList.addToHead(value);
        renderList();
        valueInput.value = '';
    }
});

addToTailBtn.addEventListener('click', () => {
    const value = parseInt(valueInput.value);
    if (!isNaN(value)) {
        linkedList.addToTail(value);
        renderList();
        valueInput.value = '';
    }
});

removeHeadBtn.addEventListener('click', () => {
    const removedValue = linkedList.removeHead();
    if (removedValue !== null) {
        renderList();
    }
});

removeTailBtn.addEventListener('click', () => {
    const removedValue = linkedList.removeTail();
    if (removedValue !== null) {
        renderList();
    }
});

searchBtn.addEventListener('click', () => {
    const value = parseInt(searchInput.value);
    if (!isNaN(value)) {
        const index = linkedList.search(value);
        if (index !== -1) {
            searchResult.textContent = `Значение ${value} найдено на позиции ${index}`;
            
            // Подсветка найденного элемента
            const nodes = document.querySelectorAll('.node');
            if (nodes[index]) {
                nodes[index].classList.add('highlight');
                setTimeout(() => {
                    nodes[index].classList.remove('highlight');
                }, 1500);
            }
        } else {
            searchResult.textContent = `Значение ${value} не найдено`;
        }
        searchInput.value = '';
    }
});

clearBtn.addEventListener('click', () => {
    linkedList.clear();
    renderList();
    searchResult.textContent = '';
});

// Инициализация
renderList();