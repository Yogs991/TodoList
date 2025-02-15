import Project from "./Project";
import TodoItem from "./TodoItem";

let projectManager;
let currentProject;

function DOMController(pm){
    projectManager = pm;
    currentProject = pm.getDefaultProject();
    loadProjectsFromLocalStorage();
    eventListeners();
    
}


function eventListeners(){
    document.getElementById("projectForm").addEventListener("submit",(event)=>{
        event.preventDefault();
        createProject();
    });

    document.getElementById("todoForm").addEventListener("submit",(event)=>{
        event.preventDefault();
        createTodo();
    });
}

function createProject(){
    const projectName = document.getElementById("projectName").value;
    if(projectName){
        const newProject = new Project(projectName);
        projectManager.addProject(newProject);
        saveProjectsToLocalStorage();
        document.getElementById("projectForm").reset();
    }
}

function createTodo(){
    const title = document.getElementById("todoTitle").value;
    const description = document.getElementById("todoDescription").value;
    const dueDate = document.getElementById("todoDueDate").value;
    const priority =  document.getElementById("todoPriority").value;
    if(title && description && dueDate){
        const newTodo = new TodoItem(title, description, dueDate, priority);
        currentProject.addTodoItem(newTodo);
        renderTodos(currentProject);
        saveProjectsToLocalStorage();
        document.getElementById("todoForm").reset();
    }
}

function renderProjects(){
    const projectContainer = document.getElementById("projectContainer");
    projectContainer.innerHTML = "";

    projectManager.getProjects().forEach(project=>{
        const projectDiv = document.createElement("div");
        projectDiv.className = "project";
        projectDiv.textContent = project.name;
        projectDiv.addEventListener("click",()=>{
            currentProject = project;
            renderTodos(project);
        });
    });

    const editButton = document.createElement("button");
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    editButton.title = "Edit";
    editButton.addEventListener("click", (event)=>{
        event.stopPropagation();
        editProjectDetails(project);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
    deleteButton.title = 'Delete';
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        projectManager.removeProject(project);
        renderProjects();
        saveProjectsToLocalStorage();
    });

    projectDiv.appendChild(editButton);
    projectDiv.appendChild(deleteButton);
    projectContainer.appendChild(projectDiv);
}

function renderTodos(project){
    const todoContainer = document.getElementById("todoContainer");
    todoContainer.innerHTML = "";
    project.getTodos().forEach(todo => {

        const todoElement = document.createElement("div");
        todoElement.className = `todo ${getPriorityClass(todo.priority)}`;
        todoElement.textContent = `${todo.title} (Due: ${todo.dueDate})`;
        todoElement.addEventListener('click', () => expandTodoDetails(todo));

        const editButton = document.createElement("button");
        editButton.innerHTML = `<i class="fas fa-edit"></i>`;
        editButton.title = "Edit";
        editButton.addEventListener("click", (event)=>{
            event.stopPropagation();
            editTodoDetails(todo);
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
        deleteButton.title = 'Delete';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            currentProject.removeTodoItem(todo);
            renderTodos(currentProject);
            saveTodosToLocalStorage();
        });

        todoElement.appendChild(editButton);
        todoElement.appendChild(deleteButton);
        todoContainer.appendChild(todoElement);
    });
}


function expandTodoDetails(todo){
    const todoDetailsContainer = document.getElementById("todoDetailsContainer");
    todoDetailsContainer.innerHTML = "";

    const titleElement = document.createElement("h2");
    titleElement.textContent = todo.title;

    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = todo.description;

    const dueDateElement = document.createElement("p");
    dueDateElement.textContent = `Due: ${todo.dueDate}`;

    const priorityElement = document.createElement("p");
    priorityElement.textContent = `Priority: ${todo.priority}`;

    const completeButton = document.createElement("button");
    completeButton.innerHTML = todo.completed ? `<i class="fas fa-undo"></i>` : `<i class="fas fa-check"></i>`;
    completeButton.title = todo.completed ? "Incomplete" : "Complete";
    completeButton.addEventListener("click", (event) => {
        todo.toggleComplete();
        expandTodoDetails();
        saveProjectsToLocalStorage();
    });

    const editButton = document.createElement('button');
    editButton.innerHTML = `<i class="fas fa-edit"></i>`;
    editButton.title = 'Edit Todo';
    editButton.addEventListener('click', () => this.editTodoDetails(todo));

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fas fa-trash"></i>`;
    deleteButton.title = "Delete";
    deleteButton.addEventListener('click', ()=>{
        currentProject.removeTodoItem(todo);
        renderTodos(currentProject);
        saveProjectsToLocalStorage();
    });

    todoDetailsContainer.appendChild(titleElement);
    todoDetailsContainer.appendChild(descriptionElement);
    todoDetailsContainer.appendChild(dueDateElement);
    todoDetailsContainer.appendChild(priorityElement);
    todoDetailsContainer.appendChild(completeButton);
    todoDetailsContainer.appendChild(editButton);
    todoDetailsContainer.appendChild(deleteButton);
}

function editTodoDetails(todo){
    document.getElementById("todoTitle").value = todo.title;
    document.getElementById("todoDescription").value = todo.description;
    document.getElementById("todoDueDate").value = todo.dueDate;
    document.getElementById("todoPriority").value = todo.priority;

    const submitButton = document.querySelector("#submitForm");
    submitButton.textContent = "Update Todo";
    submitButton.addEventListener('click', (event) => {
        todo.updateDetails({
            title: document.getElementById("todoTitle").value,
            description: document.getElementById("todoDescription").value,
            dueDate: document.getElementById("todoDueDate").value,
            priority: document.getElementById("todoPriority").value,
        });
        renderTodos(currentProject);
        saveProjectsToLocalStorage();
        submitButton.textContent = "Add todo";
    },{once:true});
}

function editProjectDetails(project){
    document.getElementById('projectName').value = project.name;
    const submitButton = document.querySelector("#submitTodoForm");
    submitButton.textContent = "Update Project";
    submitButton.addEventListener("click", ()=>{
        project.name = document.getElementById("projectName").value;
        renderProjects();
        saveProjectsToLocalStorage();
        submitButton.textContent = "Add Project";
    },{once: true});
}

function getPriorityClass(priority){
    switch(priority){
        case "Low":
            return "low-priority";
        case "Medium":
            return "medium-priority";
        case "High":
            return "high-priority";
        default:
            return "";
    }
}

function saveProjectsToLocalStorage(){
    const projects = projectManager.getProjects();
    localStorage.setItem("projects", JSON.stringify(projects));
}

function loadProjectsFromLocalStorage(){
    const storedProjects = localStorage.getItem("projects");
    if(!storedProjects){
        console.log("Local storage projects are null");
        return
    }
    try{
    const projects = JSON.parse(storedProjects);
        if(projects){
            projects.forEach(projectData =>{
                const project = new Project(projectData.name);
                projectData.todos.forEach(todoData =>{
                    const todo = new TodoItem(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
                    if(todoData.completed){
                        todo.toggleComplete();
                    }
                    project.addTodoItem(todo);
                });
                projectManager.addProject(project);
            });
        }
    }catch(error){
        console.log("Error loading projects from local storage", error);
    }
}



export default DOMController;
