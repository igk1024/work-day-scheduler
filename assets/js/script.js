 //Display Day of Week and Current Date
 var todaysDate = moment();
 $("#currentDay").text(todaysDate.format("dddd, MMMM Do, YYYY"));
 console.log(currentDay);

//Tasks to store in localStorage
var tasks = {
    "9": [],
    "10": [],
    "11": [],
    "12": [],
    "13": [],
    "14": [],
    "15": [],
    "16": [],
    "17": []
};

//Add tasks to localStorage
var setTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//Load the tasks from localStorage and create tasks in the right row
var getTasks = function() {

    var loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (loadedTasks) {
        tasks = loadedTasks

        //Create task for each key/value pair in tasks
        $.each(tasks, function(hour, task) {
            var hourDiv = $("#" + hour);
            createTask(task, hourDiv);
        })
    }

    //Confirm past/current/future time is reflected
    auditTasks()
}

//Create a task in the row that corresponds to the specified hour
var createTask = function(taskText, hourDiv) {

    var taskDiv = hourDiv.find(".task");
    var taskP = $("<p>")
        .addClass("task-description")
        .text(taskText)
    taskDiv.html(taskP);
}

//Change the background color of row based on the time of day
var auditTasks = function() {

    //Get current hour
    var currentHour = moment().hour();
    $(".task-info").each( function() {
        var elementHour = parseInt($(this).attr("id"));

        //Check for past, present, future
        if ( elementHour < currentHour ) {
            $(this).removeClass(["present", "future"]).addClass("past");
        }
        else if ( elementHour === currentHour ) {
            $(this).removeClass(["past", "future"]).addClass("present");
        }
        else {
            $(this).removeClass(["past", "present"]).addClass("future");
        }
    })
};

//Replace the textarea element with p element
var replaceTextarea = function(textareaElement) {
  

    //Get elements
    var taskInfo = textareaElement.closest(".task-info");
    var textArea = taskInfo.find("textarea");

    // get the time and task
    var time = taskInfo.attr("id");
    var text = textArea.val().trim();

    tasks[time] = [text];  //Set to one item list
    setTasks();

    //Replace the textarea element with a p element
    createTask(text, taskInfo);
}

//Tasks
$(".task").click(function() {

    //Save tasks if clicked
    $("textarea").each(function() {
        replaceTextarea($(this));
    })

    //Convert to a textarea element if time hasn't passed
    var time = $(this).closest(".task-info").attr("id");
    if (parseInt(time) >= moment().hour()) {

        //Create textInput element that includes the current task
        var text = $(this).text();
        var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);

        //Add textInput element to parent div
        $(this).html(textInput);
        textInput.trigger("focus");
    }
})

//Save button
$(".saveBtn").click(function() {
    replaceTextarea($(this));
})

//Update tasks on the hour
timeHour = 3600000 - todaysDate.milliseconds();  //Check time left until next hour
setTimeout(function() {
    setInterval(auditTasks, 3600000)
}, timeHour);

//Get the tasks from localStorage on load
getTasks();