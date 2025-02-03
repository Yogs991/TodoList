class TodoItem{
    contructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completed = false;
    }

    toggleComplete(){
        this.completed = !this.completed;
    }

    updateDetails({title,description, dueDate, priority}){
        this.title = title || this.title;
        this.description = description || this.description;
        this.dueDate = dueDate || this.dueDate;
        this.priority = priority || this.priority;
    }
}

export default TodoItem;