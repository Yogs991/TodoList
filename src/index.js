import "./style.css";
import ProjectManager from "./ProjectManager";
import DOMController from "./DOMController";

const projectManager  = new ProjectManager();
const domcontroller = new DOMController(projectManager);

document.addEventListener("DOMContentLoaded",()=>{
    domcontroller.loadProjectsFromLocalStorage();
    domcontroller.renderProjects();
});
