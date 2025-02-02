const title = document.getElementById("task_title");
const description = document.getElementById("task_description");
const deadline = document.getElementById("task_deadline");
const addTaskBtn = document.getElementById("addTask_btn");
const clock = document.getElementById("clock");
const successPopup = document.getElementById("success_popup");
const editBtn = document.getElementById("edit_btn");
const editPopup = document.getElementById("edit_popup");
const deleteBtn = document.getElementById("delete_btn");
const markAsDoneBtn = document.getElementById("markAsDone_btn");
const completedTask = document.getElementById("completed_tasks"); 
const clearAllBtn = document.getElementById("clearAll_btn");
const searchBar = document.getElementById("search_bar");
const menu = document.getElementById("menu_display");
const editTitle = document.getElementById("edit_title");
const editDescription = document.getElementById("edit_description");
const editDeadline = document.getElementById("edit_deadline");
const closeBtn = document.getElementById("close_btn");
const confirmEditBtn = document.getElementById("confirm_edit");
const blackOverlay = document.getElementById("black_overlay");
var dateCompleted;

function validate(elementId, minLength, maxLength) {
    if (!(elementId.value.length >= minLength && elementId.value.length <= maxLength)) {
        elementId.style.borderColor = "red";
        return false;
    }
    else {
        elementId.style.borderColor = "";
        return true;
    }
}

function showSuccessPopup(message) {
    successPopup.style.opacity = 1;
    successPopup.style.transform = "translateY(560px)";
    var text = successPopup.querySelector("p");
    text.textContent = message;
    
    setTimeout(hidePopup = () => {
        successPopup.style.opacity = 0;
        successPopup.style.transform = "translateY(720px)";
    }, 2000);
}

function setClock() {
    const time = new Date();
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let day = weekday[time.getDay()];
    let month = monthName[time.getMonth()];
    let date = String(time.getDate()).padStart(2, 0);
    let year = time.getFullYear();
    let hour = String(time.getHours()).padStart(2, 0);
    let minute = String(time.getMinutes()).padStart(2, 0);
    let second = String(time.getSeconds()).padStart(2, 0);
    clock.innerText = `${day}, ${date} ${month} ${year}\n${hour}:${minute}:${second}`;
}
setClock();
setInterval(setClock, 1000);

addTaskBtn.addEventListener("click", createTask = () => {
    const data = JSON.parse(localStorage.getItem("Data")) || [];
    let titleValid = validate(title, 5, 25);
    let descriptionValid = validate(description, 20, 100);
    let deadlineValid = validate(deadline, 1, 16);
    
    if (titleValid && descriptionValid && deadlineValid) {
        let newData = {
            title: title.value,
            description: description.value,
            deadline: deadline.value
        }
        data[data.length] = newData;
        localStorage.setItem("Data", JSON.stringify(data));
        
        showSuccessPopup("Task added successfully!");

        title.value = "";
        description.value = "";
        deadline.value = "";
        updateTasks(data);
    }
});

editBtn.addEventListener("click", editTask = () => {
    const data = JSON.parse(localStorage.getItem("Data"));
    var index = getSelectedTaskIndex();
    
    blackOverlay.style.display = "block";
    editPopup.style.display = "block";

    editTitle.value = taskTitle;
    editDescription.value = taskDescription;
    editDeadline.value = taskDeadline;
    
    confirmEditBtn.addEventListener("click", confirmEdit = () => {
        data[index].title = editTitle.value;
        data[index].description = editDescription.value;
        data[index].deadline = editDeadline.value;

        let titleValid = validate(editTitle, 5, 25);
        let descriptionValid = validate(editDescription, 20, 100);
        let deadlineValid = validate(editDeadline, 1, 16);
        
        if (titleValid && descriptionValid && deadlineValid) {
            updateTasks(data);
            localStorage.setItem("Data", JSON.stringify(data));
            showSuccessPopup("Task edited successfully!");
            editPopup.style.display = "none";
            blackOverlay.style.display = "none";
        }
    });
    menu.style.visibility = "hidden";
});


deleteBtn.addEventListener("click", deleteTask = () => {
    removeTask();
    showSuccessPopup("Task deleted successfully!");
    menu.style.visibility = "hidden";
});

markAsDoneBtn.addEventListener("click", markAsDone = () => {
    const completedTasks = JSON.parse(localStorage.getItem("Completed Tasks")) || [];
    let newData = {
        title: taskTitle,
        dateCompleted: new Date()
    }
    completedTasks[completedTasks.length] = newData;  
    localStorage.setItem("Completed Tasks", JSON.stringify(completedTasks));
    updateCompletedTasks();
    removeTask();
    showSuccessPopup("Task marked as done!");
    menu.style.visibility = "hidden";
});

clearAllBtn.addEventListener("click", clear = () => {
    while(completedTask.hasChildNodes()) {
        completedTask.removeChild(completedTask.firstChild);
    }
    localStorage.removeItem("Completed Tasks");
    showSuccessPopup("Completed tasks cleared!")
});

closeBtn.addEventListener("click", closePopup = () => {
    editPopup.style.display = "none";
    blackOverlay.style.display = "none";
});

searchBar.addEventListener("input", searchTask = () => {
    const data = JSON.parse(localStorage.getItem("Data")) || [];
    const input = searchBar.value.toLowerCase();
    var updatedTask = [];
    data.forEach(data => {
        if (data.title.toLowerCase().includes(input)) {
            updatedTask.push(data);
        }
    });
    updateTasks(updatedTask);
});

document.addEventListener("click", function(event) {
    if (!event.target.closest(".menu_btn") && !event.target.closest("#menu_display")) {
        menu.style.visibility = "hidden";
    }
});

window.onscroll = flipClockPosition = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight + 10) {
        clock.classList.remove("fixed-bottom")
        clock.classList.add("fixed-top")
    }
    else {
        clock.classList.remove("fixed-top")
        clock.classList.add("fixed-bottom")
    }
};
