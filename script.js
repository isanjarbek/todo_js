// (function () {
  const todosWrapper = document.querySelector(".todos__wrapper");
  const todoForm = document.querySelector(".todo__add__form form");
  const todoInput = document.querySelector(
    ".todo__add__form form .todo__input"
  );

  const editModal = document.querySelector(".edit__modal");
  const todoEditForm = document.querySelector(".edit__todo__form form");
  const todoEditInput = document.querySelector(
    ".edit__todo__form form .edit__todo__input"
  );

  const state = [];

  // EVENTS

  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoText = keepOnlyPlainTodoText(todoInput.value.trim());
    todoInput.value = "";
    if (!todoText) {
      alert("To'g'ri qiymat kiriting!");
      return;
    }

    addTodoState(todoText);
  });

  todoEditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const todoText = keepOnlyPlainTodoText(todoEditInput.value.trim());
    const todoId = +todoEditInput.dataset.todoId;
    todoInput.value = "";
    if (!todoText) {
      alert("To'g'ri qiymat kiriting!");
      return;
    }

    updateEditedTodo(todoText, todoId);
  });
  // FUNCTIONS

  const addTodoState = (todoText) => {
    const newTodo = {
      text: todoText,
      completed: false,
      id: makedId(state),
    };

    state.push(newTodo);
    drawUIByState();
  };

  const deleteTodo = (id) => {
    const idx = state.findIndex((todo) => todo.id === id);
    state.splice(idx, 1);
    drawUIByState();
  };

  const updateEditedTodo = (todoText, todoId) => {
    const todoIndex = state.findIndex((i) => i.id === todoId);
    state[todoIndex].text = todoText;
    drawUIByState();
    hideEditModal();
  };

  const editTodo = (id) => {
    const todo = state.find((i) => i.id === id);
    showEditModal(todo.text, id);
  };

  const drawUIByState = () => {
    let todosHTML = "";
    state.forEach((todo, index) => {
      let oneTodoHTML = makeOneTodoHTMLContent(todo, index + 1);
      todosHTML += oneTodoHTML;
    });

    todosWrapper.innerHTML = todosHTML;
  };

  const showEditModal = (todoText, todoId) => {
    editModal.style.display = "inline-flex";
    todoEditInput.value = todoText;
    todoEditInput.dataset.todoId = todoId;
  };

  const hideEditModal = () => {
    editModal.style.display = "none";
    todoEditInput.value = "";
    delete todoEditInput.dataset.todoId;
  };

  // UTILITY FUNCTIONS

  const makedId = (state) => {
    if (!state.length) return 1;
    return state[state.length - 1].id + 1;
  };

  const keepOnlyPlainTodoText = (inputText) => {
    const safeInputTodoText = filterXSS(inputText, {
      whiteList: [],
      stripIgnoreTag: true,
      stripIgnoreTagBody: ["script"],
    });
    return safeInputTodoText;
  };

  const makeOneTodoHTMLContent = (todo, index) => {
    const safeTodoText = keepOnlyPlainTodoText(todo.text);

    const todoContent = ` 
    <div class="one__todo__wrapper">
      <div class="one__todo__content">
        <h3>${index}. ${safeTodoText}</h3>
      </div>
      <div class="one__todo__actions">
        <button class="button__edit" onclick="editTodo(${todo.id})">Edit</button>
        <button class="button__delete" onclick="deleteTodo(${todo.id})">Delete</button>
      </div>
    </div>
    `;
    return todoContent;
  };
// })();
