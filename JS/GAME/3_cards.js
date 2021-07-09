var flexc = $('#flex_cards');
var choose = $('#startChoosing');
var playersList = [];

// SET ALL
$(function() {
    //debugSet();
    
    // triggers the phase
    $('#realVALIDATE_players').click(function() {
        setCards();
        chooseCards();
    });
});



////////// DEBUG DEBUG DEBUG //////////

function debugSet() {
    names = ["Albane", "Bobby", "Caleb"];
    roles = ["Civilian", "Undercover", "Civilian"]

    for (var i = 0; i < names.length; i++) {
        PLAYERS[names[i]] = {
            "points": 0,
            "role": roles[i]
        }
    }

    console.log(WORDS);
    console.log(PLAYERS);
    console.log(ROLES);

    chooseCards();
}



////////// SET CARDS SET CARDS SET CARDS //////////

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
    var smallTiming = 700;
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
    bp.find('.POPUP .name').eq(0).html(
        PLAYERS[name]["role"]
    );

    // modifies popup : txt
    bp.find('.POPUP .txt').append("Est votre rôle");

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
