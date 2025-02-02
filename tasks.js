const data = JSON.parse(localStorage.getItem("Data")) || [];
const taskWrapper = document.getElementById("task_wrapper");
var taskTitle;
var taskDescription;
var taskDeadline;

updateTasks(data);
updateCompletedTasks();

function showTask(task) {
    const taskBox = document.createElement("div");
    taskBox.classList.add("position-relative", "ms-3", "mb-3", "col-1", "task");
    taskWrapper.appendChild(taskBox);
    
    const title = document.createElement("textarea");
    title.classList.add("title");
    title.setAttribute("wrap", "off");
    title.setAttribute("readonly", true);
    title.textContent = task.title;
    taskBox.appendChild(title);
    
    const button = document.createElement("button");
    button.classList.add("btn", "menu_btn");
    taskBox.appendChild(button);
    
    const img = document.createElement("img");
    img.src = "image/menu_icon.png";
    img.alt = "Menu"
    img.id = "menu_icon"
    button.appendChild(img);

    const description = document.createElement("textarea");
    description.classList.add("description");
    description.setAttribute("readonly", true);
    description.textContent = task.description;
    taskBox.appendChild(description);

    const deadline = document.createElement("label");
    deadline.classList.add("position-absolute", "deadline");
    deadline.style.display = "none";
    deadline.textContent = task.deadline;
    taskBox.appendChild(deadline);
    
    const date = new Date(task.deadline);
    const deadlineText = document.createElement("label");
    deadlineText.textContent = `Deadline: ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getFullYear()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    deadlineText.style.position = "absolute";
    deadlineText.style.bottom = "7px";
    taskBox.appendChild(deadlineText);
}
    
function updateTasks(data) {
    let element = document.getElementById("task_wrapper");
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
    for (let i = 0; i < data.length; i++) {
        showTask(data[i]);
    }
    document.querySelectorAll(".menu_btn").forEach(button => {
        button.addEventListener("click", getTaskInfo = () => {
            const rect = button.getBoundingClientRect();
            menu.style.visibility = "visible";
            menu.style.left = rect.right + "px";
            menu.style.top = rect.top + window.scrollY + "px"; 
            const task = button.closest(".task");
            const selectedTask = document.getElementById("selectedTask");
            if (selectedTask != null) {
                selectedTask.removeAttribute("id");
            }
            task.id = "selectedTask";
            
            taskTitle = task.querySelector(".title").textContent;
            taskDescription = task.querySelector(".description").textContent;
            taskDeadline = task.querySelector(".deadline").textContent;
        });
    });
}

function updateCompletedTasks() {
    let element = document.getElementById("completed_tasks");
    while (element.hasChildNodes()) {
        element.removeChild(element.firstChild);
    }
    const completedTasks = JSON.parse(localStorage.getItem("Completed Tasks")) || [];
    completedTasks.forEach(data => {
        const list = document.createElement("li");
        list.textContent = data.title;
        completedTask.appendChild(list);

        const label = document.createElement("div");
        const time = new Date(data.dateCompleted);
        const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let date = String(time.getDate()).padStart(2, 0);
        let month = monthName[time.getMonth()];
        let year = time.getFullYear();
        let hour = String(time.getHours()).padStart(2, 0);
        let minute = String(time.getMinutes()).padStart(2, 0);
        label.classList.add("form-text");
        label.innerText = `Completed on ${date} ${month} ${year} ${hour}:${minute}`
        label.style.fontSize = "15px";
        list.appendChild(label);

        const hr = document.createElement("hr");
        completedTask.appendChild(hr);
    });
}

function getSelectedTaskIndex() {
    const task = document.querySelectorAll(".task");
    var taskIndex;
    task.forEach((task, index) => {
        if (task.id === "selectedTask") {
            taskIndex = index;
        }
    });
    return taskIndex;
}

function removeTask() {
    const data = JSON.parse(localStorage.getItem("Data"));
    var index = getSelectedTaskIndex();

    data.splice(index, 1);
    updateTasks(data);
    localStorage.setItem("Data", JSON.stringify(data));
}