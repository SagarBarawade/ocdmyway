'use strict'

$(document).ready(function () {

    if (!window.localStorage.authToken) {
        window.location = 'index.html';
        showErrorNotificationMessage('You need to login first!');
    }

    getUserData();

});
//
function getUserData() {

    var userId = window.localStorage.userId;

    $.ajaxSetup({
        headers: {
            'authtoken': window.localStorage.authToken,
            'userid': userId,
            'module': 'user'
        }
    });

    $.getJSON(baseUrl + "/home/users/profile/" + userId + "/", function (message) {
        if (message.status == 'success') {
            console.log(message.data[0]);
            var dataObject = message.data[0];
            $('#displayName,inputName').empty().append(dataObject.name);
            $('#displayEmail,inputEmail').empty().append(dataObject.email);
            $('#displayMobile,inputMobileNo').empty().append(dataObject.mobile);
            $('#displaySkills,inputSkills').empty().append(dataObject.skills.toString());

            $('#inputName').empty().val(dataObject.name);
            $('#inputEmail').empty().val(dataObject.email);
            $('#inputMobileNo').empty().val(dataObject.mobile);
            $('#inputSkills').empty().val(dataObject.skills.toString());

            for (var obj in dataObject.image) {
                let objectT = dataObject.image[obj];
                if (objectT.image == 1) {
                    console.log(objectT);
                    $('#img1').attr('data-imageId', objectT._id);
                    $('#img1').css('background-image', 'url("' + baseUrlFromStorage + objectT.imageLink + '")');
                }
                if (objectT.image == 2) {
                    $('#img2').attr('data-imageId', objectT._id);
                    $('#img2').css('background-image', 'url("' + baseUrlFromStorage + objectT.imageLink + '")');
                }
                if (objectT.isDefault == 'YES') {
                    console.log(baseUrlFromStorage + objectT.imageLink);
                    $('#displayProfileImage').attr("src", baseUrlFromStorage + objectT.imageLink);
                }
            }
        }
        if (message.status == 'error') {
            showErrorNotificationMessage(message.message);
        }
    });
};
//
function editUserData(field) {

    var value;
    if (field == 'name')
        value = $('#inputName').val();
    else if (field == 'email')
        value = $('#inputEmail').val();
    else if (field == 'mobile')
        value = $('#inputMobileNo').val();
    else {
        if (field == 'skills')
            var temp = $('#inputSkills').val();
        value = JSON.stringify(temp.split(','));
    }


    var userId = window.localStorage.userId;

    $.ajax({
        type: "POST",
        url: baseUrl + "/home/users/profile/update/",
        //headers: { 'module': 'user', 'authtoken': window.localStorage.authToken, 'userid': userId },
        data: { "field": field, "value": value, "userId": userId },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authtoken", window.localStorage.authToken);
            xhr.setRequestHeader("userid", userId);
            xhr.setRequestHeader("module", 'user');
        },
        success: function (response) {
            if (response.status == 'success') {
                if (field == 'name')
                    value = $('#displayName').append(value);
                else if (field == 'email')
                    value = $('#displayEmail').append(value);
                else if (field == 'mobile')
                    value = $('#displayMobile').append(value);
                else {
                    if (field == 'skills') {
                        var value = temp.split(',');
                        var temp = $('#displaySkills').append(value.toString());
                    }
                }
                showSuccesNotificationMessage(response.message);
            } else {
                showErrorNotificationMessage(response.message);
            }
        },
        error: function (err) {
            showErrorNotificationMessage('Something went wrong' + err);
        }
    });
};

function uploadImage(img) {

    var userId = window.localStorage.userId;
    var image = (img == '1') ? 'img1' : 'img2';
    var imageId = $('#' + image).attr('data-imageId');
    var base64img = base64(image);

    var selectedForm = document.getElementById('form1');
    var fd = new FormData(selectedForm);
    fd.append("file", base64img);
    fd.append("fileCount", parseInt(img));
    fd.append("userId", userId);
    (imageId != 0) ? fd.append("imageId", imageId) : '';

    $.ajax({
        type: "POST",
        url: baseUrl + "/home/users/profile/set/image/",
        crossDomain: true,
        data: fd,
        processData: false,
        contentType: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authtoken", window.localStorage.authToken);
            xhr.setRequestHeader("userid", userId);
            xhr.setRequestHeader("module", 'user');
        },
        success: function (response) {
            if (response.status == 'success') {
                setTimeout(() => { window.location.reload() }, 1000);
                showSuccesNotificationMessage(response.message);
            } else {
                setTimeout(() => { window.location.reload() }, 1000);
                showErrorNotificationMessage(response.message);
            }
        },
        error: function (err) {
            showErrorNotificationMessage('Something went wrong' + JSON.stringify(err));
        }
    });
};

function setDefaultImage(imageId) {

    var userId = window.localStorage.userId;

    $.ajax({
        type: "POST",
        url: baseUrl + "/home/users/profile/set/default-image/",
        crossDomain: true,
        data: { "userId": userId, 'imageId': imageId },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authtoken", window.localStorage.authToken);
            xhr.setRequestHeader("userid", userId);
            xhr.setRequestHeader("module", 'user');
        },
        success: function (response) {
            if (response.status == 'success') {
                showSuccesNotificationMessage(response.message);
                setTimeout(() => { window.location.reload() }, 1000);
            } else {
                showErrorNotificationMessage(response.message);
            }
        },
        error: function (err) {
            showErrorNotificationMessage('Something went wrong' + err);
        }
    });
};

function base64(image) {

    var img = $('#' + image).css('background-image');
    var temp = img.replace('url("', '');
    var base64 = temp.replace('")', '');

    var block = base64.split(";");
    var contentType = block[0].split(":")[1];
    var realData = block[1].split(",")[1];
    var blob = base64t(realData, contentType);

    return blob;
}

function base64t(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}