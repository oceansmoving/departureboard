var $ = require('jquery');;
const path = require('path')
const electron = require('electron')
const remote = electron.remote
const ipc = electron.ipcRenderer
const { BrowserWindow } = require('@electron/remote/main')

const closeBtn = $('#closeBtn')

closeBtn.click(function() {
	console.log('click');
	ipc.send('close-notify-window');
})

const updateBtn = $('#updateBtn');

updateBtn.click(function() {
	ipc.send('update-notify-value', [document.getElementById('notifyVal').value, document.getElementById('notifyTrip').value])
	ipc.send('close-notify-window');
})