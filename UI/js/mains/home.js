var websocket;

$(document).ready(function () {
    var socketUrl = window.localStorage.socketUrl;
    websocket = io(socketUrl);
    websocket.emit('PINGB', 'HI SERVER');
    websocket.on('PINGS', function (msg) {
        showSuccesNotificationMessage('(WEB SOCKET CONNECTED)<br /> Server Says: ' + msg);
    });
    websocket.on('ACKN', function (msg) {
        showSuccesNotificationMessage('Server Says: ' + msg);
    });

});
// On load function to check for previous data
function loadGameDataFromPreviousHistory() {

    var userId = window.localStorage.getItem('userId');

    $.ajaxSetup({
        headers: {
            'authtoken': window.localStorage.authToken,
            'userid': userId,
            'module': 'home'
        }
    });

    $.getJSON(baseUrl + "/home/old/game/" + userId + "/", function (message) {
        if (message.status == 'success') {
            showSuccesNotificationMessage(message.message);
            window.localStorage.setItem('gameId', message.data.gameId);
            $('#cardsArena').empty();
            var RawArray = message.data.raw;
            var HTML = '';
            RawArray.forEach(function (rawObject) {

                var keyside = Object.keys(rawObject)[0];
                var valueside = rawObject[keyside];

                HTML = HTML + '<div class="col-md-1" style="padding:2px;" >';
                HTML = HTML + '<img src="' + valueside + '" id="' + keyside + '" ondragstart="drag(event)" draggable="true" class="img-responsive card-img">';
                HTML = HTML + '</div>';
            });
            //console.log(HTML);
            $('#cardsArena').append(HTML);
        }
        if (message.status == 'error') {
            showErrorNotificationMessage(message.message);
        }
    });
}
// On restart function
function loadNewGameData() {

    var userId = window.localStorage.getItem('userId');

    $.ajax({
        type: "PUT",
        url: baseUrl + "/home/new/game/",
        data: {
            "userId": userId
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader("authtoken", window.localStorage.authToken);
            xhr.setRequestHeader("userid", userId);
            xhr.setRequestHeader("module", 'home');
        },
        success: function (response) {
            if (response.status == 'success') {
                showSuccesNotificationMessage(response.message);
                $('#cardsArena').empty();
                window.localStorage.setItem('gameId', response.data.gameId);
                var RawArray = response.data.raw;
                var HTML = '';
                RawArray.forEach(function (rawObject) {

                    var keyside = Object.keys(rawObject)[0];
                    var valueside = rawObject[keyside];

                    HTML = HTML + '<div class="col-md-1" style="padding:2px;" >';
                    HTML = HTML + '<img src="' + valueside + '" id="' + keyside + '" ondragstart="drag(event)" draggable="true" class="img-responsive card-img">';
                    HTML = HTML + '</div>';
                });
                //console.log(HTML);
                $('#cardsArena').append(HTML);
            } else {

            }
        },
        error: function (err) {
            $("#userLogin").prop('disabled', false);
            showErrorNotificationMessage('Something went wrong' + err);
        }
    });
}
//
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
//
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
//
function allowDrop(ev) {
    ev.preventDefault();
}
//
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
//
function dropSpade(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var spadeArray = ['AS', '1S', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'JS', 'QS', 'KS'];
    if (spadeArray.indexOf(data) >= 0) {
        ev.target.appendChild(document.getElementById(data));
        emitSocket('spade', data);
    }
    else {
        showErrorNotificationMessage('Wrong Bucket...!');
    }
}
//
function dropHeart(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var heartArray = ['AH', '1H', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'JH', 'QH', 'KH'];
    if (heartArray.indexOf(data) >= 0) {
        ev.target.appendChild(document.getElementById(data));
        emitSocket('heart', data);
    }
    else {
        showErrorNotificationMessage('Wrong Bucket...!');
    }
}
//
function dropClub(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var clubArray = ['AC', '1C', '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'JC', 'QC', 'KC'];
    if (clubArray.indexOf(data) >= 0) {
        ev.target.appendChild(document.getElementById(data));
        emitSocket('club', data);
    }
    else {
        showErrorNotificationMessage('Wrong Bucket...!');
    }
}
//
function dropDiamond(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var diamondArray = ['AD', '1D', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'JD', 'QD', 'KD'];
    if (diamondArray.indexOf(data) >= 0) {
        ev.target.appendChild(document.getElementById(data));
        emitSocket('diamond', data);
    }
    else {
        showErrorNotificationMessage('Wrong Bucket...!');
    }
}
//
function emitSocket(card, cardNo) {
    var userId = window.localStorage.userId;
    var gameId = window.localStorage.gameId;

    var socketEmitString = userId + '#' + gameId + '#' + card + '#' + cardNo;
    websocket.emit('GAMEON', socketEmitString);
}