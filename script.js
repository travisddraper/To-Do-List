function numGenerator(max) {
    return Math.floor(Math.random() * max);
}

var loadTasks = function() {

    $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=17',
        dataType: 'json',
        success: function (response, textStatus) {
            $('input[type="checkbox"]').closest('.toDoNote').remove();
            
            var tasksRemaining = response.tasks.length;

            response.tasks.forEach(function(task) {
                $('.toDoBody').prepend($('<div class="toDoNote col-12"><input type="checkbox" id="checkBox" class="align-self-center mr-2 mb-2"' + (task.completed ? "checked" : "") + '><label class="pl-3 mt-1" for="checkBox">' + task.content + '</label><button class="btn pb-2 removeTask" data-id="' + task.id +'"><span class="buttonText">X</span></button></div>'))

                if(task.completed) {
                    tasksRemaining--
                }
            })
            
            $('#itemsLeft').html(tasksRemaining);
        },
        error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
        }
    });
}

var uploadTask = function() {

    $.ajax({
        type: 'POST',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=17',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
            task: {
                content: $('.taskInput').val()
            }
        }),
        success: function (response, textStatus) {
            loadTasks();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
    });
}

var deleteTask = function(id) {

    $.ajax({
        type: 'DELETE',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=17',
        success: function (response, textStatus) {},
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
    });

}

var completeTask = function(id) {

    $.ajax({
        type: 'PUT',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=17',
        dataType: 'json',
        success: function(response, textStatus) {
            var itemsRemaining = parseInt($('#itemsLeft').text())
            $('#itemsLeft').html(itemsRemaining-1)

        },
        error: function(request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });


}

var markTaskActive = function(id) {

    $.ajax({
        type: 'PUT',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=17',
        dataType: 'json',
        success: function(response, textStatus) {
            var itemsRemaining = parseInt($('#itemsLeft').text())
            $('#itemsLeft').html(itemsRemaining+1)
        },
        error: function(request, textStatus, errorMessage) {
            console.log(errorMessage);
        }
    });

}

var pickATask = function() {
    $.ajax({
        type: 'GET',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=17',
        dataType: 'json',
        success: function (response, textStatus) {
            $('input[type="checkbox"]').closest('.toDoNote').hide();

            var max = [];
            response.tasks.forEach(function(task) {
                if(task.completed !== true) {
                    max.push(task);
                }
            })
            $('input[type="checkbox"]:not(:checked)').eq(numGenerator(max.length)).closest('.toDoNote').show();

        },
        error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
        }
    });
}

var refreshThePage = function() {
    console.log('refreshed');
    loadTasks();
}

$(document).ready(function() {

    loadTasks();
    var interval = window.setInterval(refreshThePage, 10000);
   

    $('#noteSheetForm').submit(function(event) {

        event.preventDefault();
        uploadTask();
        $('.taskInput').val('')

    }) 

    $(document).on('click', '.removeTask', function(event) {

        $(this).closest('.toDoNote').remove();
        deleteTask($(this).data('id'));

        if($(this).prev().prev().is(':checked') !== true) {
            $('#itemsLeft').html((parseInt($('#itemsLeft').text()))-1);
            
        } 
    })

    $(document).on('change', '#checkBox', function() {

        if($(this).is(':checked')) {
            completeTask($(this).siblings('.removeTask').data('id'));

        } else  {
            markTaskActive($(this).siblings('.removeTask').data('id'))
        }
    })
                        /* Action Buttons */

    $('#clearAll').on('click', function() {
        $('input[type="checkbox"]:checked').each(function() {
            deleteTask($(this).siblings('.removeTask').data('id'));
            $('input[type="checkbox"]:checked').closest('.toDoNote').remove();
        }) 
    })

    $('#active').on('focus', function() {
        $('input[type="checkbox"]:checked').closest('.toDoNote').hide();
        $('input[type="checkbox"]:not(:checked)').closest('.toDoNote').show();
    })
    $('#completed').on('focus', function() {
        $('input[type="checkbox"]:not(:checked)').closest('.toDoNote').hide();
        $('input[type="checkbox"]:checked').closest('.toDoNote').show();
    })
    $('#all').on('focus', function() {
        loadTasks();
    })

    $('#randomTaskButton').on('click', function() {
        pickATask();
        $('.kudos').show();
    })
                       /* Kudos Notice */
    $('#randomTaskButton').on('mouseleave', function() {
        $('.kudos').hide();
    })
});