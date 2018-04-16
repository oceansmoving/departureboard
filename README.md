# departureboard

A Node/Electron departureboard application for Västtrafik travels
![alt text](http://socialsiberia.com/dp.png)

* Returns the next 15 minutes of departures from the choosen stop
* Allows you to change stop
* Allows you to filter on specific trips
* Allows you to set notification for a certain trip

### Prerequisites

NodeJs & NPM

Modules required:

```
npm install request
npm install electron
npm install jquery
npm install query-string
npm install axios
```

### Installing
You will need to create an API user at https://developer.vasttrafik.se to aquire Client ID and Secret for token retrieval.

In **src/index.js** and **src/vt.js** you need to provide your **Client ID**, **Secret** and **Scope**
```
var TOKEN_URL = 'https://api.vasttrafik.se/token';
var USER_GRANT_TYPE = 'client_credentials';
var CLIENT_ID = 'YOUR_CLIENT_ID';
var CLIENT_SECRET = 'YOUR_SECRET';
var SCOPE_INT = 'YOUR_SCOPE';

   const data = {
      grant_type: USER_GRANT_TYPE,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: SCOPE_INT
    }
```
Next you need to edit your package.json file in the root folder. If it hasn't been created use:

```
npm init -y
```

In your package.json file, add under "scripts":

```
"start": "electron ."
```

and set "main" script to:

```
"main": "main.js"
```

Finally, start application by running:

```
npm start
```

For debugging uncomment:

```
win.webContents.openDevTools()
```

in **main.js**

## Authors

* **Joakim Jensen**
