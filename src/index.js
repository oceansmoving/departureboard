var $ = require("jquery");
const path = require('path');
const electron = require('electron');
const queryString = require('query-string');
const ipc = electron.ipcRenderer
const axios = require('axios');
const url = require('url');
const { BrowserWindow } = require('@electron/remote/main')
var fs = require('fs');
require('dotenv').config();

const searchBtn = $('#searchBtn');

searchBtn.click(function() {
	ipc.send('default-trip-value', document.getElementById('defaultTrip').value);
})

ipc.on('defaultStop', function(event, arg) {
	getToken(arg);
})

function getToken(stop) {
	
	var TOKEN_URL = process.env.TOKEN_URL;
	var USER_GRANT_TYPE = process.env.USER_GRANT_TYPE;
	var CLIENT_ID = process.env.CLIENT_ID;
	var CLIENT_SECRET = process.env.CLIENT_SECRET;
	var SCOPE_INT = process.env.SCOPE_INT;

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
