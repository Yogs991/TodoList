import TodoItem from "./TodoItem";

class Project{
    constructor(name){
        this.name = name;
        this.tasks = [];
    }

    addTodoItem(task){
        if(task instanceof TodoItem){
            this.tasks.push(task);
        }
    }

    removeTodoItem(task){
        this.tasks = this.tasks.filter(t=>t !== task);
    }

    getTodoItem(){
        return this.tasks;
    }
}

export default Project;