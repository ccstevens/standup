/*++

Copyright (c) 2017 Chris Stevens

Module Name:

    main.js

Abstract:

    This module implements the main application process.

Author:

    Chris Stevens 8-Sept-2017

--*/

//
// -------------------------------------------------------------------- Imports
//

const electron = require('electron');
const timer = require('./timer.js');
const app = electron.app;

//
// --------------------------------------------------------------------- Script
//

//
// Once Electron has completed initialization, it triggers the ready event.
//

app.on('ready', function () {

    //
    // Start the timer.
    //

    timer.start();
    return;
});

//
// Do not quit the application when all windows are close. The timer is always
// running in the background.
//

app.on('window-all-closed', function () {});
