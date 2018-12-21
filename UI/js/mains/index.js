

$(document).ready(function () {

    if (!window.localStorage.baseUrl) {
        showErrorNotificationMessage("Prerequisite setup needed! Click on link below");
        $("#userLogin").prop('disabled', true);
        return false
    }

    $("#userLogin").click(function () {
        doLogin();
    });
});

function doLogin() {
    $("#userLogin").prop('disabled', true);
    var username = $("#loginUserName").val();
    var password = $("#loginpassWord").val();
    if (username == '' || password == '') {
        showErrorNotificationMessage('Username & Password required to Login!');
        return false;
    } else {
        $.ajax({
            type: "POST",
            url: baseUrl + "/login/",
            data: {
                "username": username,
                "password": password
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("module", 'login');
            },
            success: function (response) {
                if (response.status == 'success') {
                    showSuccesNotificationMessage(response.message);
                    window.setTimeout(function () {
                        window.location = 'home.html'
                    }, 1000)
                    $.each(response.data, function (key, value) {
                        window.localStorage.authToken = value.token;
                        window.localStorage.userId = value.userId;
                    });
                } else {
                    showErrorNotificationMessage(response.message);
                }
            },
            error: function (err) {
                showErrorNotificationMessage('Something went wrong' + err);
            }
        });
    }
}

function doSignup() {
    $("#userLogin").prop('disabled', true);
    var name = $("#input_Name").val();
    var username = $("#input_UserName").val();
    var password = $("#input_Password").val();
    var cpassword = $("#input_CPassword").val();
    if (username == '' || password == '') {
        showErrorNotificationMessage('Provide username & password!');
        return false;
    } else if (password != cpassword) {
        showErrorNotificationMessage('Passwords mismatched! Use same password to confirm.');
    } else {
        $.ajax({
            type: "POST",
            url: baseUrl + "/signup/",
            data: {
                "name": name,
                "username": username,
                "password": password
            },
            beforeSend: function (xhr) {
                xhr.setRequestHeader("module", 'signup');
            },
            success: function (response) {
                if (response.status == 'success') {
                    showSuccesNotificationMessage(response.message);
                    window.setTimeout(function () {
                        window.location = 'home.html'
                    }, 1000)
                    $.each(response.data, function (key, value) {
                        window.localStorage.authToken = value.token;
                        window.localStorage.userId = value.userId;
                    });
                } else {
                    showErrorNotificationMessage(response.message);
                }
            },
            error: function (err) {
                showErrorNotificationMessage('Something went wrong' + JSON.stringify(err));
            }
        });
    }
}

