var $ = require('jquery');;
const path = require('path')
const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer

const closeBtn = $('#closeBtn')

closeBtn.click(function() {
	console.log('click')
	var window = remote.getCurrentWindow();
	window.close();
})


const updateBtn = $('#updateBtn');

updateBtn.click(function() {
	ipc.send('update-notify-value', [document.getElementById('notifyVal').value, document.getElementById('notifyTrip').value])
	var window = remote.getCurrentWindow();
	window.close();
})