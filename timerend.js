/*++

Copyright (c) 2017 Chris Stevens

Module Name:

    timerend.js

Abstract:

    This module implements the renderer process for the timer window.

Author:

    Chris Stevens 8-Sept-2017

--*/

//
// -------------------------------------------------------------------- Imports
//

const electron = require('electron');
const ipc = electron.ipcRenderer;

//
// ------------------------------------------------------------------ Constants
//

//
// Define the update interval in milliseconds.
//

const TIMER_SECONDS = 20;
const TIMER_UPDATE_INTERVAL = 1000;
const MILLISECONDS_PER_SECOND = 1000;

//
// -------------------------------------------------------------------- Globals
//

//
// Store the initial countdown value, in millseconds.
//

var timerSeconds = TIMER_SECONDS;
var timerMilliseconds = timerSeconds * MILLISECONDS_PER_SECOND;

//
// ------------------------------------------------------------------ Functions
//

function timerUpdate ()

/*++

Routine Description:

    This routine implements the timer update callback. It updates timer.html
    based on the current timer value.

Arguments:

    None.

Return Value:

    None.

--*/

{

    var timerSeconds;

    timerMilliseconds -= TIMER_UPDATE_INTERVAL;
    if (timerMilliseconds > 0) {
        timerSeconds = timerMilliseconds / MILLISECONDS_PER_SECOND;
        document.getElementById('timer').innerHTML = timerSeconds.toString()

        //
        // After the window has displayed for a second, allow the user to exit
        // out of the screen. Ignore mouse moves, as those may not always
        // be intentional.
        //

        if (timerSeconds < TIMER_SECONDS) {
            document.addEventListener('click', timerComplete);
            document.addEventListener('keydown', timerComplete);
        }

    } else {
        timerComplete()
    }

    return;
}

function timerComplete()

/*++

Routine Description:

    This routine completes the timer process, mainly by sending a completion
    message to the main process.

Arguments:

    None.

Return Value:

    None.

--*/

{

    ipc.send('timer-complete');
    return;
}

//
// --------------------------------------------------------------------- Script
//

//
// Initialize the timer value and then start the countdown, updating the
// display every second.
//

document.getElementById('timer').innerHTML = timerSeconds.toString();
setInterval(timerUpdate, TIMER_UPDATE_INTERVAL);
