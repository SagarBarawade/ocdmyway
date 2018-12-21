'use strict';
var baseUrlFromStorage = window.localStorage.imageBaseUrl;
var imageBaseUrl = window.localStorage.imageBaseUrl;
var baseUrl = window.localStorage.baseUrl;

function setPrerequisites() {
    window.localStorage.clear();
    window.localStorage.baseUrl = 'http://localhost:3000/app';
    window.localStorage.imageBaseUrl = 'http://localhost:3000';
    window.localStorage.socketUrl = 'http://localhost:4000';

    showSuccesNotificationMessage('All set! Please Signup first...!');
}

function showSuccesNotificationMessage(messageToDisplay) {
    $.notify({
        message: messageToDisplay,
        icon: 'glyphicon glyphicon glyphicon-ok'
    }, {
            type: 'success',
            animate: {
                enter: "animated fadeInRight",
                exit: "animated fadeOutRight"
            },
            onShown: function () {
                // location.reload();          
            }
        });
}

function showErrorNotificationMessage(messageToDisplay) {
    $.notify({
        message: messageToDisplay,
        icon: 'glyphicon glyphicon-warning-sign'
    }, {
            type: 'danger',
            animate: {
                enter: "animated fadeInRight",
                exit: "animated fadeOutRight"
            }
        });
}

function doLogout() {
    var userId = window.localStorage.userId;
    var authToken = window.localStorage.authToken;

    $.ajax({
        type: "POST",
        url: baseUrl + "/logout/",
        data: {
            "authToken": authToken
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authtoken", authToken);
            xhr.setRequestHeader("userid", userId);
            xhr.setRequestHeader("module", 'signout');
        },
        success: function (response) {
            if (response.status == 'success') {
                showSuccesNotificationMessage(response.message);
                window.localStorage.removeItem('token');
                window.localStorage.removeItem('userId');
                window.localStorage.removeItem('gameId');
                window.setTimeout(function () {
                    window.location = 'index.html'
                }, 1000);
            } else {
                showErrorNotificationMessage(response.message);
            }
        },
        error: function (err) {
            $("#userLogin").prop('disabled', false);
            showErrorNotificationMessage('Something went wrong' + err);
        }
    });
}