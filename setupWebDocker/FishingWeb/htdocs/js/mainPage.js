var mainApp = {};
var database;
var complist = document.getElementById('complist');
var tablelist = document.getElementById('listtable');

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
    console.log("Access the database!");
    ref.on("value", gotData, errData);

    function gotData(data) {

        var listings = document.getElementsByClassName('listing');
        // console.log('class listing: '+ listings.length);
        // avoid windows refilling when data get updated
        for (var i = listings.length - 1; i >= 0; i--) {
            listings[i].remove();
            console.log(listings[i]);
        }

        // console.log(data.val());
        var competitions = data.val();
        console.log(competitions);
        // console.log(competitions);
        var dic = new Array();

        var keys = Object.keys(competitions);
        // console.log(keys);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            // var timekey = competitions[k].date_translated;
            var timekey = translateDate(competitions[k].date,competitions[k].startTime);
            console.log('timekey: '+timekey);
            dic[timekey*1000+i] = k;
        }
        var sortlist = Object.keys(dic).sort();
        console.log(sortlist);
        var i = 1;

        for (var key in sortlist) {
            var k = dic[sortlist[key]];
            var compName = competitions[k].cname;
            var compDate = competitions[k].date;
            var status = competitions[k].cStatus;
            var time = competitions[k].startTime;

            var li = document.createElement('li');
            // add id to li tag
            li.id = k;
            
            var address = 'Competition.html?' + 'id=' + k + "&content=detail";
            var link = document.createElement('a');
            link.href = address;
            link.target = "_blank";
            link.innerHTML = compName;
            // console.log(typeof status);
            var statusN;
            switch (status) {
                case '3':
                    statusN = 'Finished';
                    break;
                case '2':
                    statusN = 'Waiting for the result......';
                    break;
                case '1':
                    statusN = 'In progress';
                    break;
                case '0':
                    statusN = 'Upcoming'
                    break;
            }

            //create a new row
            var tr = document.createElement('tr');
            tr.id = i;
            var th = document.createElement('th');
            var td = document.createElement('td');
            var td2 = document.createElement('td');
            var td3 = document.createElement('td');
            td2.id = i + 'date';
            td3.id = i + 'status';
            td.appendChild(link);
            th.scope = 'row';
            th.innerHTML = i;
            td2.innerHTML = compDate;
            td3.innerHTML = statusN;
            translateDate(compDate,time);
            tr.appendChild(th);
            tr.appendChild(td2);
            tr.appendChild(td);
            tr.appendChild(td3);
            tr.className = 'listing';
            listtable.appendChild(tr);
            i++;
            console.log(tr);
        }
    }

    function errData(err) {
        console.log('Error!');
        console.log(err);
    }

    function translateDate(date,time){
      var nums1 = date.split('/');
      var nums2 = time.split(':');
      var time_trans = new Array(2);   
      var date_trans = new Array(3);
      date_trans=nums1[2]+nums1[1]+nums1[0];
      time_trans = nums2[0]+nums2[1];

      console.log('date translated: '+ Number(date_trans+time_trans));
      return Number(date_trans+time_trans);
  
    }


})()