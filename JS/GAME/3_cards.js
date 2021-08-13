var flexc = $('#flex_cards');
var choose = $('#startChoosing');
var playersList = [];
var wordsRemaining = [];

// SET ALL
$(function() {

    // triggers the phase
    $('#realVALIDATE_players').click(function() {
        var l = lenDic(WORDS);
        for (var i = 1; i <= l; i++)
            wordsRemaining.push(i);
        defineWords();
        setPlayersRoles();
        setCards();
        chooseCards();

        // debug:: shows final dictionnaries
        //debugLog();
    });

    debugSet3();
});



////////// DEBUG DEBUG DEBUG //////////

function debugSet3() {
    rolesArray = [
        "Civilian",
        "Undercover",
        "Civilian",
        "Civilian",
        "Mr. White",
        "Civilian",
        "Civilian"
    ]

    PLAYERS = {
            "Albane" : {"points": 0, "role": null, "word": null},
            "Bobby" : {"points": 0, "role": null, "word": null},
            "Caleb" : {"points": 0, "role": null, "word": null},
            "Dylan" : {"points": 0, "role": null, "word": null},
            "Emma" : {"points": 0, "role": null, "word": null},
            "Fred" : {"points": 0, "role": null, "word": null},
            "Gabriel" : {"points": 0, "role": null, "word": null}
        }

    debugLog();

    $('#realVALIDATE_players').click();
}



////////// SET GAME SET GAME SET GAME //////////

function defineWords() {

    // IF WORDS IS EMPTY -> should refresh page
    if (lenDic(WORDS) == 0) {
        return;
    }

    // automatically empties GOODWORDS
    GOODWORDS = ['', ''];

    // find random set of words (WORDS[index])
    var rd = random(0, wordsRemaining.length - 1);
    var index = wordsRemaining[rd];

    // makes sure it's not chosen ever again
    shift(wordsRemaining, rd);

    // verifies if set of words contains at least 2 words
    // if not, deletes it and chooses again
    if (WORDS[index].length <= 1) {
        delete WORDS[index];
        defineWords();
        return;
    }

    // choses right (GOODWORDS[0]) and wrong (GOODWORDS[1]) words
    // then deletes the set of words
    for (var i = 0; i < 2; i++) {
        rd = random(0, WORDS[index].length - 1);
        GOODWORDS[i] = WORDS[index][rd];
        shift(WORDS[index], rd);
    }
    delete WORDS[index];
}

function setPlayersRoles() {
    var rls = copy(rolesArray);
    // updates players roles
    for (player in PLAYERS) {
        var l = rls.length;
        var rd = random(0, l - 1);
        var randomRole = rls[rd];

        // deletes rolesArray[rd]
        shift(rls, rd);

        // attributes role
        PLAYERS[player]["role"] = randomRole;
        PLAYERS[player]["explanation"] = ROLES[randomRole][1];

        // attributes role and word (left null if Mr. White)
        if (randomRole == "Undercover")
            PLAYERS[player]["word"] = GOODWORDS[1];
        else if (randomRole != "Mr. White")
            PLAYERS[player]["word"] = GOODWORDS[0];
    }
}

function setCards() {

    for (player in PLAYERS) {
        // creates the card
        var ppc = popupCard(
            // no name
            '',

            // "available card" image
            './IMG/card1.png',

            // creates template for inner popup
            // <p class="txt"><h2 class="name center-align"></h2></p>
            createHTML('p',
                create('h2').addClass('name center-align')
            ).addClass('txt')
        );

        // binds to the OFF button the
        // function that starts a new player phase
        // (displays general panel -> chooses -> shows)
        ppc.find('.OFF').eq(0).click(function() {
            newPlayerChooses();
        });

        // binds to the ON button the
        // function that modifies card content
        // and makes it unbinded to 'click' event
        ppc.find('.ON').eq(0).click(function() {
            updateCardPlayer($(this))
        });
        flexc.prepend(ppc);
    }
}



////////// CHOOSE CARDS //////////

/*
    BEGGINING OF THE PHASE :
        - init playersList with all players
        - starts a 'player chooses' phase
*/
function chooseCards() {
    for (player in PLAYERS) {
        playersList.push(player);
    }

    newPlayerChooses();
}

/*
    PLAYER CHOOSING PHASE :
        if (end : no player left)
            pops up warning -> goes to next game phase
        else
            pops up who chooses next
            -> deletes the player from playersList
*/
function newPlayerChooses() {
    var smallTiming = 500;
    var longTiming = 3000;

    // IF END
    if (playersList.length == 0) {
        // waits smallTiming ms
        setTimeout(function() {
            // warns
            updateCardPlayerGeneralPanel(`Rôles choisis !`);
            choose.find('.POPUP .text').eq(0).html(
                `Le jeu va donc commencer... Let's go !`
            );

            // goes to next & closes panel
            setTimeout(function() {
                $('#GAME_1 .GOTO_JS').eq(0).click();
                choose.find('.OFF').eq(0).click();
                return;
            }, longTiming);
        }, smallTiming);
    }

    // ELSE
    // updates panel -> waits smallTiming ms and displays it
    updateCardPlayerGeneralPanel(playersList[0]);
    setTimeout(function() {
        choose.find('.ON').eq(0).click();
    }, smallTiming);

    // deletes player from playersList
    playersList.shift();
}

/*
    modifies panel title and hidden .name (of player)
*/
function updateCardPlayerGeneralPanel(player) {
    choose.find('.POPUP .name').eq(0).html(player);
    choose.find('.player').eq(0).html(player);
}

/*
    ACTIVATED when .card.popup is clicked on
        - modifies .image[src]
        - modifies name on the outside of the card
        - modifies popup : role name + txt
        - deactivates .ON trigger(click) & style of trigger button
*/
function updateCardPlayer(ths) {

    // finds name of player & .popuptrigger & .ON button
    var name = choose.find('.player').eq(0).html();
    var bp = ths.closest('.popuptrigger');
    var inp = bp.find('.ON').eq(0);

    // modifies .image[src]
    ths.attr('src', './IMG/card0.png');

    // modifies name on the outside of the card
    bp.find('.absolute .name').eq(0).html(name);

    // modifies popup : role name
    var title = "";
    var expl = PLAYERS[name]["explanation"];
    if (PLAYERS[name]["role"] == "Mr. White") {
        title = "Mr. White";
    } else {
        title = PLAYERS[name]["word"];
    }
    bp.find('.POPUP .name').eq(0).html(title);

    // modifies popup : txt
    bp.find('.POPUP .txt').append(expl);

    // deactivates .ON trigger & style of button
    inp.unbind('click');
    inp.removeClass('crosshair');
}



////////// CREATING CARDS CREATING CARDS CREATING CARDS //////////

/*
    creates a card with :
        V image
        X name
        X popup
*/
function imageCard(image) {
    // creates the div
    var bp = createHTML('div');
    bp.addClass('card simple light center-align');

    // creates the image
    bp.append(
        create('img')
            .attr('src', image)
            .addClass('image')
    );

    // creates the name
    bp.append(
        createHTML('div',
            createHTML('table',
                createHTML('tr',
                    createHTML('td',
                        createHTML('ch', '').addClass('name')
                    )
                )
            )
        ).addClass('absolute')
    );

    return bp;
}

/*
    creates a card with :
        X image
        V name
        X popup
*/
function nameCard(name) {
    var bp = imageCard('./IMG/card0.png');
    bp.find('.name').eq(0).html(name);
    return bp;
}

/*
    creates a card with :
        X-V image
        X-V name
        V popup

    (make image = './IMG/card0.png' for only name)
    (make name = '' for only image)
*/
function popupCard(name, image, revealed) {
    var bp = imageCard(image);
    bp.addClass('popuptrigger');
    bp.find('.name').eq(0).html(name);
    bp.find('.image').eq(0).addClass('ON crosshair');

    // creates the popup
    bp.append(
        createHTML('div',
            createHTML('scroll',
                createHTML('table',
                    createHTML('tr',
                        createHTML('td', revealed)
                    )
                )
            )
        ).addClass('POPUP simple light')
    );

    // creates the button
    bp.find('.POPUP td').eq(0).append(
        createHTML('button', 'x')
            .addClass('OFF simple hi1 background')
    );

    return createPOPUP(bp);
}
