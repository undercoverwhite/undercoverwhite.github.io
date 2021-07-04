var initPlayersCount = 3;
var flexp = $('#flex_players');
var PLAYERS = {};

$(function() {

    // BEFORE USE
    setPlayers();

    // WHEN USED
    validatePlayers();
});

/*
    SETS :
        number initPlayersCount of players (with no name, the user must enter names for each one to access the rest of the game)
        function attached to the 2 buttons (add a word patch / delete empty words patches)
*/
function setPlayers() {

    // creates initPlayersCount players
    for (var i = 0; i < initPlayersCount; i++) {
        flexp.append(createPlayer());
    }

    // attach createPlayer function to the left button
    $('#addToFlex_players').click(function() {
        var bp = createPlayer();
        flexp.append(bp);
    });

    // attach deleteEmptyPlayers function to the left button
    $('#removeEmpty_players').click(function() {
        deleteEmptyPlayers();
    });
}

function createPlayer() {
    var bp = create('input')
    bp.addClass('simple light');
    bp.attr('type', 'text');
    var count = flexp.find('input').length + 1;
    bp.attr('placeholder', 'Joueur·se ' + count);
    return bp;
}

function deleteEmptyPlayers() {

    // goes through the flex;
    // removes the empty inputs
    // and counts how many right ones there are
    var correctPlayersCount = 0;
    stripAllPlayers();
    flexp.find('input').each(function() {
        if ($(this).val() == '') $(this).remove();
        else correctPlayersCount ++;
    });

    // possibly adds empty inputs if needed
    var toAdd = initPlayersCount - correctPlayersCount;
    for (var i = 0; i < toAdd; i++) {
        flexp.append(createPlayer());
    }
}

function stripAllPlayers() {
    //strips all the inputs from useless spaces
    flexp.find('input').each(function() {
        var ths = $(this);
        var v = ths.val();
        ths.val(strip(v));
    });
}



//////////////
/*

    VALIDATES the names of the players
    if not enough names has been mentionned,
    the user can't unlock the rest of the game.

    the user has to confirm his choice in the end
    because this is also when the final WORDS dico
    is concatenated with the potential personal words.

*/

function validatePlayers() {
    $('#VALIDATE_players').click(function() {

        // counts how many non null inputs there are
        var count = 0;
        flexp.find('input').each(function() {
            if ($(this).val() != '') count ++;
        });

        // alerts if there aren't enough players
        if (count < initPlayersCount) {
            alert('Veuillez entrer au moins ' + initPlayersCount + ' joueur·se·s.');
        } else {

            // tries to add the players to the PLAYER = {}
            // if ok, asks confirmation -> concatenate -> next phase
            var lastCheck = createFinalPlayers();
            if (lastCheck) {
                if (confirm('Êtes-vous sûr·e de la configuration de votre jeux ? Vous ne pourrez plus revenir en arrière.')) {
                    concatenateWords();
                    console.log(WORDS);
                    console.log(PLAYERS);
                    $('#realVALIDATE_players').click();
                }
            } else {
                // if not ok, alerts that some names are common
                // and stops the function
                alert("Au moins un des noms de joueur·se·s est présent au moins une fois. Veuillez en rentrer d'autres.");
            }
        }
    });
}

function concatenateWords() {
    // WORDS is defined in ./1_words.js

    var lenW = Object.keys(WORDS).length;
    var lenPW = Object.keys(persoWords).length;

    var combine = Boolean($('#inp1_addWords').prop('checked'));
    var persoExists = Boolean(lenPW > 0);

    // verifies what to do with the WORDS
    // if (!combine && !persoExists), WORDS still stays the same
    // (without any personal word)
    if (combine) {
        for (var el in persoWords) {
            var key = (parseInt(el) + lenW).toString();
            WORDS[key] = persoWords[el];
        }
    } else if (persoExists) {
        WORDS = persoWords;
    }
}

function createFinalPlayers() {
    stripAllPlayers();
    var ok = true;
    flexp.find('input').each(function() {
        var ths = $(this);
        var name = ths.val();

        // verifies if must still run
        // and if the name isn't empty
        if (ok && name != '') {
            // verifies if there is not already a player
            // for this name; if so, !ok and PLAYERS emptied
            if (PLAYERS[name] != undefined) {
                PLAYERS = {};
                ok = false;
                return false;
        }

        // fills the PLAYERS with the [name]
        PLAYERS[name] = {
            'points': 0,
            'role': null
        };
        }
    });

    return ok;
};
