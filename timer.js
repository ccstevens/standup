/*++

Copyright (c) 2017 Chris Stevens

Module Name:

    timer.js

Abstract:

    This module implements the timer support for the application. This will
    generate the break window at the stored interval (default of 20 minutes).

Author:

    Chris Stevens 8-Sept-2017

--*/

//
// -------------------------------------------------------------------- Imports
//

const electron = require('electron')
const path = require('path')
const url = require('url')
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

//
// -------------------------------------------------------------------- Exports
//

module.exports.start = timerStart;
module.exports.stop = timerStop;
module.exports.isEnabled = timerIsEnabled;

//
// ------------------------------------------------------------------ Constants
//

//
// Store the default interval between breaks, in milliseconds.
//

const TIMER_PERIOD_DEFAULT = 20 * 60 * 1000;

//
// -------------------------------------------------------------------- Globals
//

//
// Keep a global reference on the timer window object, otherwise it will
// be closed automatically when the JavaScript object is garbage collected.
//

let timerWindow;
var timerInterval = null;
var timerPeriod = TIMER_PERIOD_DEFAULT;

//
// ------------------------------------------------------------------ Functions
//

function timerStart ()

/*++

Routine Description:

    This routine starts the timer. It will stop and restart the timer if
    it is already running.

Arguments:

    None.

Return Value:

    None.

--*/

{

    timerStop();
    timerInterval = setInterval(timerTimeoutHandler, timerPeriod);
    return;
}

function timerStop ()

/*++

Routine Description:

    This routine stops the timer.

Arguments:

    None.

Return Value:

    None.

--*/

{

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    timerDestroyWindow();
    return;
}

function timerIsEnabled ()

/*++

Routine Description:

    This routine determines whether or not the timer is enabled.

Arguments:

    None.

Return Value:

    Returns true if the timer is enabled, or false otherwise.

--*/

{

    if (timerInterval) {
        return true;
    }

    return false;
}

function timerTimeoutHandler ()

/*++

Routine Description:

    This routine gets called at each timeout interval.

Arguments:

    None.

Return Value:

    None.

--*/

{

    //
    // Destroy the old window in case it's still around for some reason.
    //

    timerDestroyWindow();

    //
    // Create a transparent, frameless, full screen window. Do not show it
    // immediately to prevent the default white background from being
    // rendered before the final window properties have been loaded. The
    // window will be shown on the 'ready-to-show' event.
    //

    timerWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        toolbar: false,
        fullscreen: true,
        alwaysOnTop: false,
        show: false,
        movable: false,
        skipTaskbar: true,
        transparent: true});

    if (!timerWindow) {
        return;
    }

    //
    // The HTML for this window can be found in timer.html.
    //

    timerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'timer.html'),
        protocol: 'file:',
        slashes: true
    }));

    //
    // Display the fully rendered window once it is ready to show.
    //

    timerWindow.once('ready-to-show', function () {
        timerWindow.show();
        timerWindow.focus();
    });

    timerWindow.on('closed', function () {
        timerWindow = null;
    });

    //
    // Listen to the rendering process for the timer complete event.
    //

    ipc.on('timer-complete', function(event) {
        timerDestroyWindow();
    });

    return;
}

function timerDestroyWindow ()

/*++

Routine Description:

    This routine destroys the timer's break window.

Arguments:

    None.

Return Value:

    None.

--*/

{

    if (timerWindow) {
        timerWindow.close();
        timerWindow = null;
    }
}
