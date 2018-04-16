var request = require('request');
var $ = require('jquery');
var axios = require('axios');
var queryString = require('query-string')
const url = require('url')
const electron = require('electron');


const ipc = electron.ipcRenderer;


var stopToggle = 0;
var tripToggle = 0;
var id = 9021014007520000;
var trip;
var direct;
var stop;


setInterval(getToken, 30000);

function getToken() {
	
	var interval = 10000;
	

console.log('getToken running, toggle: ' + stopToggle)


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
      // username: DEMO_EMAIL,
      // password: DEMO_PASSWORD
    };



  axios.post(TOKEN_URL, queryString.stringify(data))
   .then(response => {
      token = response.data.access_token;
	  main(token, id);
    })   
   .catch((error) => {
      console.log('error ' + error);
   });
   
	// setTimeout(getToken, interval);
}

getToken()


   
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
	  
		
});



}

