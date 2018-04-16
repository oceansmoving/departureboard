var $ = require('jquery')
const path = require('path')
const electron = require('electron')
const remote = electron.remote
const queryString = require('query-string')
const ipc = electron.ipcRenderer
const axios = require('axios')
const url = require('url')
const BrowserWindow = electron.remote.BrowserWindow

const searchBtn = $('#searchBtn')

searchBtn.click(function() {
	ipc.send('default-trip-value', document.getElementById('defaultTrip').value)
})

ipc.on('defaultStop', function(event, arg) {
	getToken(arg)
})


function getToken(stop) {
	
var TOKEN_URL = 'https://api.vasttrafik.se/token';
var USER_GRANT_TYPE = 'client_credentials';
var CLIENT_ID = 'YOUR_CLIENT_ID';
var CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
var SCOPE_INT = 'YOUR_SCOPE';



   const data = {
      grant_type: USER_GRANT_TYPE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: SCOPE_INT
    };



  axios.post(TOKEN_URL, queryString.stringify(data))
   .then(response => {
      token = response.data.access_token;
	  changeStop(token, stop);
    })   
   .catch((error) => {
      console.log('error ' + error);
   });
}

function changeStop(token, stop) {

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
	  var id = response.data.LocationList.StopLocation[0].id;
	  var name = response.data.LocationList.StopLocation[0].name;
	  userChoice(token, name, id)
});
}

function userChoice(token, name, id) {
	
	var id = id;
	
	$('#output').html('Result: <i><b>' + name + '</i></b><br>Is this the stop you were looking for?<br><button id="yes">Yes</botton><button id="no">No</botton>')
	
	const goBtn = $('#yes')

	goBtn.click(function() {
		ipc.send('start-board-value', ['vt', id, name])
	})
	
	$('#no').click(function() {
		$('#output').html(null)
	})
	
}
