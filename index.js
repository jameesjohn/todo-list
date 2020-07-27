const addTodoBtn = document.querySelector('#add');
const addTodoInput = document.querySelector('#addInput');
const todoDisplay = document.querySelector('#todo-list');

function getAllTodos() {
  // Gets todo from local storage;
  const allTodos = localStorage.getItem('allTodos');

  if (allTodos) {
    return JSON.parse(allTodos);
  } else {
    localStorage.setItem('allTodos', JSON.stringify([]));
    return getAllTodos();
  }
}

function updateTodo(todos) {
  localStorage.setItem('allTodos', JSON.stringify(todos));
}

function getLastTodoId() {
  const allTodos = getAllTodos();
  const lastTodo = allTodos[allTodos.length - 1];
  if (lastTodo) {
    return lastTodo.id;
  } else {
    return 0;
  }
}

function addTodo(newTodo) {
  const allTodos = getAllTodos();
  allTodos.push(newTodo);
  updateTodo(allTodos);
}

function displayTodos() {
  const todos = getAllTodos();
  // Displaying todos.
  let allTodosHtml = '';
  for (let index = 0; index < todos.length; index++) {
    const todo = todos[index];
    if (todo.isComplete) {
      const todoHtml = `
        <li data-todo-id="${todo.id}">
          <input type="checkbox" name="" id="" checked>
          <span class="strike">${todo.value}</span>
          <button>Delete</button>
        </li>
      `;
      allTodosHtml += todoHtml;
    } else {
      const todoHtml = `
        <li data-todo-id="${todo.id}">
          <input type="checkbox" name="" id="">
          <span>${todo.value}</span>
          <button>Delete</button>
        </li>
      `;
      allTodosHtml += todoHtml;
    }
  }

  todoDisplay.innerHTML = allTodosHtml;
}

function getTodoFromNode(node) {
  const todoId = Number(node.parentElement.getAttribute('data-todo-id'));

  const selectedTodo = getAllTodos().find(function (todo) {
    return todo.id === todoId;
  });

  return selectedTodo;
}

function deleteTodo(todo) {
  const allTodos = getAllTodos();
  const todoIndex = allTodos.findIndex((td) => td.id === todo.id);
  allTodos.splice(todoIndex, 1);

  updateTodo(allTodos);
}

// Add a Todo
addTodoBtn.addEventListener('click', function (event) {
  const todo = {
    id: getLastTodoId() + 1,
    value: addTodoInput.value,
    isComplete: false,
  };

  addTodo(todo);
  displayTodos();
  addTodoInput.value = '';
});

// Update/delete
todoDisplay.addEventListener('click', function () {
  if (event.target.nodeName === 'INPUT') {
    // Set todo as complete.
    const todo = getTodoFromNode(event.target);
    todo.isComplete = event.target.checked;

    const allTodos = getAllTodos();
    const todoIndex = allTodos.findIndex((td) => td.id === todo.id);
    allTodos.splice(todoIndex, 1, todo);

    updateTodo(allTodos);
    displayTodos();
  }
  if (event.target.nodeName === 'BUTTON') {
    const todo = getTodoFromNode(event.target);
    deleteTodo(todo);

    displayTodos();
  }

  event.stopPropagation();
});
displayTodos();
