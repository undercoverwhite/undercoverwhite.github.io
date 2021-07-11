// sets the minimam players count
var initPlayersCount = 0;
for (role in rolesJSON)
    initPlayersCount += rolesJSON[role][0];

var flexp = $('#flex_players');
var flexr = $('#flex_roles');
var rolesArray = [];

$(function() {
    // BEFORE USE
    setPlayers();
    setRoles();

    // WHEN USED
    validatePlayers();
});



////////// SET PLAYERS SET PLAYERS SET PLAYERS //////////

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

    /// fills .players_count_js
    $('.players_count_js').append(initPlayersCount);
}

function createPlayer() {
    var count = flexp.find('input').length + 1;
    var bp =
        create('input')
            .addClass('simple light')
            .attr('type', 'text')
            .attr('placeholder', 'Joueur·se ' + count);
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



////////// SET ROLES SET ROLES SET ROLES //////////

function setRoles() {
    for (role in ROLES) {
        var list = ROLES[role];
        addRole(role, list[0]);
    }
}

/*
    CREATES and add the roles for the game
    given the ./JS/TOP/roleList.JSON
*/
function addRole(name, minValue) {
    var bp = create('div').addClass('simple nopadding');
    bp.append(
        createHTML('cv', name)
            .addClass('name')
    );

    bp.append(
        create('input')
            .addClass('simple small light')
            .attr('type', 'number')
            .attr('name', 'roles')
            .attr('min', minValue)
            .attr('value', minValue)

            // prevents from going lower than input[min]
            .bind('change', notLower)
    );

    flexr.append(bp);
}

/*
    VERIFIES if the value of an input isn't lower than
    min required; if so, fixes it to min required
*/
function notLower() {
    var ths = $(this);
    var val = parseInt(ths.val());
    var min = parseInt(ths.attr('min'));
    if (val < min) ths.val(min);
}



////////// VALIDATE VALIDATE VALIDATE //////////

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
        var playersCount = 0;
        flexp.find('input').each(function() {
            if ($(this).val() != '') playersCount ++;
        });

        var rolesCount = 0;
        flexr.find('input').each(function() {
            rolesCount += parseInt($(this).val());
        });

        // alerts if there aren't enough players
        if (playersCount < initPlayersCount) {
            alert('Veuillez entrer au moins ' + initPlayersCount + ' joueur·se·s.');
        } else if (rolesCount != playersCount) {
            alert("Il n'y a pas autant de rôles que de joueur·se·s.");
        } else {

            // tries to add the players to the PLAYER = {}
            // if ok, asks confirmation -> concatenate -> next phase
            var lastCheck = createFinalPlayers();
            if (lastCheck) {
                if (confirm('Êtes-vous sûr·e de la configuration de votre jeux ? Vous ne pourrez plus revenir en arrière.')) {

                    // FINAL CALCULS ::
                    VALIDATE();

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
    // WORDS is defined in ./0_global_variables.js
    var lenW = lenDic(WORDS);
    var lenPW = lenDic(persoWords);

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
                'role': null,
                'word': null,
                'explanation': null
            };
        }
    });

    return ok;
};

function defineRoles() {
    rolesArray = [];

    flexr.find('div').each(function() {
        // finds each role div, its name & its number
        var ths = $(this);
        var input = ths.find('input').eq(0);
        var name = ths.find('.name').eq(0).html();
        var number = parseInt(input.val());

        for (var i = 0; i < number; i++) {
            rolesArray.push(name);
        }

        // updates number of roles in ROLES
        for (role in ROLES) {
            if (role == name) ROLES[role][0] = number;
            /*if (ROLES[role][0] == name)
                ROLES[role][1] = number;*/
        }
    });
}

function VALIDATE() {
    // choose the total list of words
    setsDefaultWORDS();
    concatenateWords();

    // define the roles given the users choices
    setsDefaultROLES();
    defineRoles();
}

function debugLog() {
    console.log('WORDS');
    console.log(WORDS);
    console.log('PLAYERS');
    console.log(PLAYERS);
    console.log('ROLES');
    console.log(ROLES);
    console.log('GOOD - BAD WOORD');
    console.log(GOODWORDS);
    console.log('------------');
}
