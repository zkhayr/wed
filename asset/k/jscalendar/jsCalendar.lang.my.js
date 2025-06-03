/*
 * jsCalendar language extension
 * Add <Language Name> Language support
 * Translator: <Your Name or Nickname> (<Your GitHub Username>@github)
 */

// We love anonymous functions
(function(){

    // Get library
    var jsCalendar = window.jsCalendar;

    // If jsCalendar is not loaded
    if (typeof jsCalendar === 'undefined') {
        // If there is no language to load array
        if (typeof window.jsCalendar_language2load === 'undefined') {
            window.jsCalendar_language2load = [];
        }
        // Wrapper to add language to load list
        jsCalendar = {
            addLanguage : function (language) {
                // Add language to load list
                window.jsCalendar_language2load.push(language);
            }
        };
    }

    // Add a new language
    jsCalendar.addLanguage({
        // Language code
        // EDIT HERE THE LANGUAGE CODE ~~~~~~~~~~
        code : 'my',
        // STOP EDIT ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Months of the year
        months : [
            // EDIT HERE THE MONTHS ~~~~~~~~~~~~~
            'Januari',
            'Februari',
            'Mac',
            'April',
            'May',
            'Jun',
            'Julai',
            'Ogos',
            'September',
            'Oktober',
            'November',
            'Disember'
            // STOP EDIT ~~~~~~~~~~~~~~~~~~~~~~~~
        ],
        // Days of the week
        days : [
            // EDIT HERE THE DAYS ~~~~~~~~~~~~~~~
            'Ahad',
            'Isnin',
            'Selasa',
            'Rabu',
            'Khamis',
            'Jummat',
            'Sabtu'
            // STOP EDIT ~~~~~~~~~~~~~~~~~~~~~~~~
        ]
    });

})();