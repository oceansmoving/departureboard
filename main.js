	const {app, BrowserWindow, Menu} = require('electron')
	const path = require('path')
	const url = require('url')
	const shell = require('electron').shell
	const ipc = require('electron').ipcMain;
	
	
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


  let win

  function createWindow () {
    // Create the browser window.
	app.commandLine.appendSwitch('disable-web-security'); // try add this line
    win = new BrowserWindow({
		width: 900, 
		height: 800,
		"web-preferences": {
			"web-security": false,
			"defaultEncoding": "utf-8"
		}
	})
  
    // and load the index.html of the app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, '/src/index.html'),
      protocol: 'file:',
      slashes: true
    }))
  
    // Open the DevTools.
    //win.webContents.openDevTools()
  
    // Emitted when the window is closed.
    win.on('closed', () => {
      win = null
    })
	
	win.setMenu(null);
  }
  
  app.on('ready', createWindow)
  
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  
  app.on('activate', () => {
    if (win === null) {
      createWindow()
    }
  })
  
  
  ipc.on('update-notify-value', function(event, arg) {
		win.webContents.send('targetTime', arg);
  })
  
  ipc.on('default-trip-value', function(event, arg) {
		win.webContents.send('defaultStop', arg);
  })
  
  ipc.on('start-board-value', function(event, arg) {
	var id = arg[1];
	var name = arg[2];
	
	win.loadURL(url.format({
      pathname: path.join(__dirname, '/src/'+arg[0]+'.html'),
      protocol: 'file:',
      slashes: true
    }));
	 win.custom = {
        'id': arg[1],
		'name': arg[2]
    };
  })