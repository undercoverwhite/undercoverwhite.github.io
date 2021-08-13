const waitTime = parseFloat($('body').css('--transt')) * 1000;

// SET ALL
$(function() {
    setPHASE();
});


/*SETS PHASES :

    gives each $('.PHASE') a number (0, 1, 2,...)
    given their order of appearance;
        -> find it with $('.PHASE').attr('phase')

    allows the $('.GOTO_JS') to be clicked
    and display only the wanted phase;
        -> the HTML must be set like this :
            <x class="GOTO_JS ...">...
            (goes to the next phase)

            or

            <x class="GOTO_JS ..." next="Y">...
            (goes to phase n° Y if Y is an int)

            or

            <x class="GOTO_JS ..." next="plusY">...
            (goes to Y phases next to the current one,
        if Y is an int)
    */
function setPHASE() {

    var count = 0;
    // hides all the phases except the first one
    $('.PHASE').each(function() {
        var ths = $(this);
        ths.attr('phase', count);

        // DEFINES WHICH IS DISPLAYED BY DEFAULT
        // (must be 0 for regular play)
        // (modify here for debug)
        if (count != 3) {
            setHiddenPhase(ths);
            ths.removeClass('display-none');
        } else {
            setVisiblePhase(ths);
        }

        count ++;
    });

    // attaches goToNextPhase() to the
    // $('.GOTO_JS') elements when clicked on;
    $('.GOTO_JS').each(function() {
        // verifies if a nextPhase is declared
        var ths = $(this);
        var phase = ths.closest('.PHASE').attr('phase');
        var next = ths.attr('next');
        if (next == phase) next = undefined;

        // if no phase declared, sets to current + 1
        if (next == undefined)
            ths.click(function(){
                goToNextPhase(ths, parseInt(phase) + 1)
            });

        else {
            // checks if it goes to a precise phase
            // or a relative phase (current + y)
            var rgx = /(\D+)?(\d+)/;
            var result = next.match(rgx);
            if (result[1] == 'plus')
                next = parseInt(phase) + parseInt(result[2]);
            else if (result[1] == 'moins')
                next = parseInt(phase) - parseInt(result[2]);
            else
                next = parseInt(result[2]);

            ths.click(function(){
                goToNextPhase(ths, next)
            });
        }
    });
};

/*hides the current phase and goes to the phase[nextPhase]*/
function goToNextPhase(ths, nextPhase) {
    var phase = ths.closest('.PHASE');
    setHiddenPhase(phase);

    var phase2 = $('.PHASE').eq(nextPhase);
    setVisiblePhase(phase2);
};

function setHiddenPhase(element) {
    element.css('height', '0');
    element.css('padding-top', '0');
    element.css('padding-bottom', '0');
    setTimeout(function() {
        element.css('display', 'none');
    }, waitTime);
}

function setVisiblePhase(element) {
    element.css('display', 'block');
    setTimeout(function() {
        element.css('padding-top', 'var(--width-shadow-main)');
        element.css('padding-bottom', 'var(--width-shadow-main)');
        element.css('height', '100%');
    }, waitTime);

}
