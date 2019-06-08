var mainApp = {};
var database;
var key;
var content;
var arr = [];

(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            uid = user.uid;
        } else {
            //redirect to login page
            uid = null;
            window.location.replace("login.html")
        }
    });

    function logOut() {
        firebase.auth().signOut().then(function () {
            console.log("User sign out!");
        }, function (error) {
            console.log("User sign out error!");
        })
    }
    mainApp.logOut = logOut;

    database = firebase.database();
    var ref = database.ref('Competitions');
    console.log("Access the Competition database!");
    ref.on("value", gotData, errData);

    key = getQueryString("id");
    content = getQueryString("content");

    function gotData(data) {
        var listings = document.getElementsByClassName('listing');
        // console.log('class listing: '+ listings.length);
        for (var i = listings.length - 1; i >= 0; i--) {
            listings[i].remove();
            console.log(listings[i]);
        }

        // console.log(data.val());
        var address = 'Competition.html?' + 'id=' + key;
        var competitions = data.val();
        var attendants = arr.concat(competitions[key].attendants);
        var description = competitions[key].cDescription;
        var status = competitions[key].cStatus;
        var compname = competitions[key].cname;
        var date = competitions[key].date;
        var result = competitions[key].results;
        var reward = competitions[key].reward;
        var startT = competitions[key].startTime;
        var stopT = competitions[key].stopTime;
        var winner = competitions[key].winner;
        var typeNum = competitions[key].compType;
        var status = competitions[key].cStatus;
        

        //console.log(description+' '+ date+' '+startT +' '+ stopT);
        var title = document.getElementById('title');
        var ul = document.getElementById('content');
        var head = document.getElementById('head');
        var table = document.getElementById('table');

        switch (content) {
            case 'detail':
            var refUser = firebase.database().ref("Users");
            console.log("Access the user database");
            refUser.once("value").then(function (snapshot) {
                var name = snapshot.child(winner).child('displayName').val();
                head.innerHTML = "Competition Detail";
                var tr = document.createElement('tr');
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Competition Name' + "</th>" +
                    "<td>" + compname + "</td>";
                console.log(tr);
                table.appendChild(tr);

                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Description' + "</th>" +
                    "<td>" + description + "</td>";
                console.log(tr);
                table.appendChild(tr);

                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Time' + "</th>" +
                    "<td>" + date + "</td>";
                console.log(tr);
                table.appendChild(tr);
                var typeClass;
                switch (typeNum) {
                    case 0:
                        typeClass = 'By Single Fish Length';
                        break;
                    case 1:
                        typeClass = 'By Single Fish Width';
                        break;
                    case 2:
                        typeClass = 'By Single Fish Weight';
                        break;
                    case 3:
                        typeClass = 'By Total Fish Weight';
                        break;
                    case 4:
                        typeClass = 'By Fish Species';
                        break;
                    case 5:
                        typeClass = 'By Fish Quantity';
                        break;
                }
                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Competition Type' + "</th>" +
                    "<td>" + typeClass + "</td>";
                console.log(tr);
                table.appendChild(tr);

                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row' >" + 'Start Time' + "</th>" +
                    "<td>" + startT + "</td>";
                console.log(tr);
                table.appendChild(tr);

                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Stop Time' + "</th>" +
                    "<td>" + stopT + "</td>";
                console.log(tr);
                table.appendChild(tr);

                var tr = document.createElement('tr'); 
                tr.className = 'listing';
                tr.innerHTML = "<th scope='row'>" + 'Reward Price' + "</th>" +
                    "<td>" + reward + "</td>";
                console.log(tr);
                table.appendChild(tr);

                if (status == '3') {
                    var tr = document.createElement('tr'); 
                    tr.className = 'listing';
                    tr.innerHTML = "<th scope='row'>" + 'Winner' + "</th>" +
                        "<td>" + name + "</td>";
                    console.log(tr);
                    table.appendChild(tr);

                    var tr = document.createElement('tr'); 
                    tr.className = 'listing';
                    tr.innerHTML = "<th scope='row'>" + 'Result' + "</th>" +
                        "<td>" + result + "</td>";
                    console.log(tr);
                    table.appendChild(tr);
                }
            })
 

                break;

            case 'attendance':
                head.innerHTML = "Competition Attendance";
                var refUser = firebase.database().ref("Users");
                console.log("Access the user database");
                refUser.once("value").then(function (snapshot) {

                    if (attendants[0] == null) {
                        // alert('An empty array!');
                        var text = document.createElement('h2');
                        text.innerHTML = 'No one has registered yet.';
                        text.className = 'listing';
                        text.align = 'center';
                        text.style.font = "italic 30px arial,serif";
                        document.getElementById('container').appendChild(text);
                    } else {
                        var thead = document.createElement('thead');
                        thead.className = 'listing';
                        var tr = document.createElement('tr');
                        tr.innerHTML = "<th scope='col'>" + '#' + "</th>" +
                            "<th scope='col'>" + 'User Name' + "</th>";
                        thead.appendChild(tr);
                        document.getElementById('maintable').appendChild(thead);

                        for (var i = 0; i < attendants.length; i++) {
                            var uid = attendants[i];
                            console.log(uid);
                            var name = snapshot.child(uid).child('displayName').val();
                            console.log(name);

                            var tr = document.createElement('tr'); 
                            tr.className = 'listing';
                            tr.id = i + uid;
                            tr.innerHTML = "<th scope='row'>" + (i + 1) + "</th>" +
                                "<td>" + name + "</td>";
                            console.log(tr);
                            table.appendChild(tr);
                        }
                    }

                })

                break;

            case 'post':
                console.log(status);
                head.innerHTML = "Competition Posts";
                if (status == '0') {
                    var sentence = document.createElement('h3');
                    sentence.innerHTML = "The game has not started yet."
                    var cont = document.getElementById('container');
                    cont.appendChild(sentence);
                } else {
                    var storageRef = firebase.storage().ref('Images/Competitions');
                    console.log("Access the Storage");
                }
                break;
        }


        //set button
        var detailBtn = document.getElementById('detail');
        var attBtn = document.getElementById('attendance');
        var postBtn = document.getElementById('post');
        var mapBtn = document.getElementById('map');

        detailBtn.onclick = function () {
            //console.log('detail');
            //this.className
            window.location.replace(address += "&content=detail")
        }

        attBtn.onclick = function () {
            //console.log('attendance');
            window.location.replace(address += "&content=attendance")
        }

        postBtn.onclick = function () {
           
            if (status != '0') {
                window.location.assign('Post.html?id=' + key);
            } else {
                alert("The competition has not started yet!")
            }
            // window.location.replace('Post.html?id=' + key);
        }

        mapBtn.onclick = function () {
            //console.log('map');
            window.location.assign('Map.html?id=' + key);
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }


})()