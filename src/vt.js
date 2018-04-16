const request = require('request');
const $ = require('jquery');
const axios = require('axios');
const queryString = require('query-string')
const url = require('url')
const electron = require('electron');
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer;
const remote = electron.remote
const currentWindow = remote.getCurrentWindow();

var notify = 0;
var notifyTarget = 0;
var notifyTrip = 0;

var id;
var newId;

var stopToggle = 0;
var tripToggle = 0;

var trip;
var direct;
var stop;

id = currentWindow.custom.id;
var name = currentWindow.custom.name;

$('#newStop').attr('placeholder', name)

if(id != null || id != undefined) {
	getToken()
}

ipc.on('targetTime', function(event, arg) {
	notify = 1;
	notifyTarget = arg[0];
	notifyTrip = arg[1];
	getToken();
})


$('#notify').click(function() {
	
	if(notify == 1) {
		notify = 0;
		getToken()
	}
	else {
		const modalPath =  path.join('file://', __dirname, '/src/add.html')
		let win = new BrowserWindow({
			"web-preferences": {
				"web-security": false,
				"defaultEncoding": "utf-8"
			},
			frame: false,
			alwaysOnTop: true,
			width: 650,
			height: 300
		})
		win.on('close', function() {
			win = null
		})
		
		win.loadURL(url.format({
		  pathname: path.join(__dirname, '/add.html'),
		  protocol: 'file:',
		  slashes: true
		}))
		  
		win.show()
	}
})



function load(x) {
	if(x === 1) {
		$('#loader').show();
	}
	else {
		$('#loader').hide();
	}
}

load(1);

function submitTrip() {
	load(1);
	trip = document.getElementById('filterTrip').value;
	trip = trip.split(' - ');
	direct = trip[1];
	trip = trip[0]
	tripToggle = 1;
	getToken();
}

function clearTrip() {
	document.getElementById('filterTrip').value = '';
	tripToggle = 0;
	getToken()
	load(1)
}

function submitData() {
	load(1);
	var stop = document.getElementById('newStop').value;
	if(stop != '') {
		stopToggle = 1;
		tripToggle = 0;
		changeStop(stop);
	}
}

function clearStop() {
	document.getElementById('newStop').value = '';
	stopToggle = 0;
	getToken()
	load(1)
}



function changeStop(stop) {
	console.log('changestop running, stop: ' + stop)
	var stop = encodeURI(stop);
	
axios({
  "async": true,
  "crossDomain": true,
  "url": "https://api.vasttrafik.se/bin/rest.exe/v2/location.name?input="+stop+"&format=json",
  "method": "GET",
  "headers": {
    "authorization": "Bearer " + token,
    "content-type": "application/x-www-form-urlencoded"
  }
})
  .then(function(response) {
	  newId = response.data.LocationList.StopLocation[0].id;
	  getToken();
});

}


function getToken() {
	
	var use;
	
	if(stopToggle === 1) {
		console.log(true)
		use = newId;
	}
	else if(stopToggle === 0) {
		console.log(true)
		use = id;
	}
	
	if(notify == 1) {
		$('#notify').text('notifying..')
		$('#notify').css('background-color', 'green')
	}
	else if(notify == 0) {
		$('#notify').text('Notify me')
		$('#notify').css('background-color', '#DB8830')
	}
	
	var interval = 10000;
	

console.log('getToken running, toggle: ' + use)


var TOKEN_URL = 'https://api.vasttrafik.se/token';
var USER_GRANT_TYPE = 'client_credentials';
var CLIENT_ID = 'JDof57qzg7dLS1ipSEy9TKGxIG4a';
var CLIENT_SECRET = 'y7KVMsSO1W6DHeC9Eerdex3d67Ya';
var SCOPE_INT = 'jocke';



   const data = {
      grant_type: USER_GRANT_TYPE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: SCOPE_INT
    };



  axios.post(TOKEN_URL, queryString.stringify(data))
   .then(response => {
      token = response.data.access_token;
	  main(token, use);
    })   
   .catch((error) => {
      console.log('error ' + error);
   });
   
   setTimeout(getToken, 30000);
}


var trips = []

function main(token, id) {
	
var relevantTrips = [];

var today = new Date();
h = today.getHours();
m = today.getMinutes();
var mm = today.getMonth() + 1;
var yy = today.getFullYear('YYYY');
var dd = today.getDate('YYYY');

if(mm < 9) {
	mm = '0' + mm;
}

var date = yy+'-'+mm+'-'+dd;
time = h+'%3A'+m;

var tripArr = [];

axios({
  "async": true,
  "crossDomain": true,
  "url": "https://api.vasttrafik.se/bin/rest.exe/v2/departureBoard?id="+id+"&date="+date+"&time="+time+"&format=json&timeSpan=15",
  "method": "GET",
  "headers": {
    "authorization": "Bearer " + token,
    "content-type": "application/x-www-form-urlencoded"
  }
})
  .then(function(response) {
	  console.log(response)
	var cnt = -1;
	
	  $('table #content').remove();
	  load(0);
	  var res = response.data.DepartureBoard;
	  
	  var departure = res.Departure;
	  var err = res.error;
	  
	  if(err) {
		  $('#error').show();
		  $('#error').text(err);
	  }
	  else {
		  $('#error').hide();
	  
	  for(i = 0; i < departure.length; i++) {
		 var tripStr = departure[i].sname + ' - ' + departure[i].direction;

		
		  if(tripArr.indexOf(tripStr)  === -1) {
			  tripArr.push(tripStr)
		  }
		var direction = departure[i].direction;
			direction = '<td>'+direction+'</td>'
		
		var sname = departure[i].sname;
		var rt = departure[i].rtTime;
		
		if(rt == undefined) {
		  rt = h+':'+m;
		}
		  
		  var t = departure[i].time
		  rt = rt.replace(':','');
		  t = t.replace(':','');
		  var d = new Date();
		  var min = d.getMinutes()
		  var hour = d.getHours()
		  if(min < 10) {
			  min = '0'+min;
		  }
		  if(hour < 10) {
			  hour = '0'+hour;
		  }

		  var now = hour+''+min
		  var lowerLimit = 0;
		  
		  if(rt.substr(0,2) == now.substr(0,2)) {
				var saveTime = rt - parseInt(now);
				var timeLeft = rt - parseInt(now);
				var delay = parseInt(rt) - parseInt(t);
		  }
		  else {
			  var saveTime = (rt - parseInt(now)) - 40;
			  var timeLeft = (rt - parseInt(now)) - 40;
			  var delay = (parseInt(rt) - parseInt(t)) - 40;
		  }
		  
		if(notify == 1 && parseInt(timeLeft) <= parseInt(notifyTarget) && notifyTrip == departure[i].sname) {
			cnt++;

			relevantTrips[cnt] = {
				trip: departure[i].sname,
				timeleft: timeLeft,
				direction: departure[i].direction
				}
				
		}
		
		console.log(relevantTrips)
		

		  if(timeLeft <= 10 && timeLeft > 5) {
			  timeLeft = '<td style="background-color: orange;">' + timeLeft + ' min</td>'
		  }
		  else if(timeLeft <= 5){
			  timeLeft = '<td style="background-color: #D1232B; color: white;">' + timeLeft + ' min</td>'
		  }
		  else {
			  timeLeft = '<td style="background-color: #7AB800; color: white;">' + timeLeft + ' min</td>'
		  }
		  
		  
		  if(rt.substr(0,2) == t.substr(0,2)) {
				var delay = parseInt(rt) - parseInt(t);
		  }
		  else {
				var delay = (parseInt(rt) - parseInt(t)) - 40;
		  }
		  
		  
		  
		  if(delay >= 0) {
			  delay = '+' + delay;
			  delay = '<td style="color: red;">'+delay+'</td>';
		  }
		  else {
			  delay = '<td style="color: green;">'+delay+'</td>'
		  }
		  if(saveTime > 0) {
			if(tripToggle == 1) {
				if(departure[i].sname == trip && departure[i].direction == direct) {
					$('table').append('<tr id="content"><td>'+departure[i].type+'</td><td style="background-color: '+departure[i].fgColor+'; color: ' + departure[i].bgColor + '"> ' + departure[i].sname + '</td>'+direction+'<td>'+departure[i].time+'</td>'+delay+'' + timeLeft + '</tr>')
				}
			}
			else {
					$('table').append('<tr id="content"><td>'+departure[i].type+'</td><td style="background-color: '+departure[i].fgColor+'; color: ' + departure[i].bgColor + '"> ' + departure[i].sname + '</td>'+direction+'<td>'+departure[i].time+'</td>'+delay+'' + timeLeft + '</tr>')
			}
		  }
		  
		  
	  }
  
	  
	  trips = relevantTrips;

	  // if(notify == 1) {
		// startNotify(relevantTrips)
	  // }
	  
		$('select option').remove()
		for(i = 0; i < tripArr.length; i++) {
			$('select').append('<option value="'+tripArr[i]+'">'+tripArr[i]+'</option>')
		}
		
	  }
});

}



function startNotify() {

	var interval = 5000;
	
	if(notify === 1) {
		interval = 30000;
	

	console.log(interval);
	
	var notifyMe = [];
	
		console.log(trips.length)
		if(trips.length != 0) {
		for (i = 0; i < trips.length; i++) {
			if(trips[i].timeleft > 0) {
		notifyMe[i] = {
			title: 'Alert',
			body: + trips[i].timeleft+' min left for trip ' + trips[i].trip + ' towards ' + trips[i].direction
			}
			const myNotification = new window.Notification(notifyMe[i].title, notifyMe[i])
			}
		}
	}
}
	setTimeout(startNotify, interval)
	
}

	startNotify();
