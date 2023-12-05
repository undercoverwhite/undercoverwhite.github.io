const body = $('body');
const color = 'var(--col0)';
const reload = $('.js-reload');
let colorIsRight = false;
const yes = $('.js-yes');
const no = $('.js-no');
const result = $('.js-result');
const game = $('.js-game');
const start = $('.js-start');
const options = $('.js-options');

$(function() {

    start.on('click', () => {
        game.removeClass('hidden');
        start.addClass('hidden');
    });
    
    reload.on('click', () => {
        options.removeClass('hidden');
        yes.removeAttr('disabled');
        no.removeAttr('disabled');
        yes.removeClass('selected');
        no.removeClass('selected');
        result.html('');
        colorIsRight = changeRandomBackground();
    });

    yes.on('click', () => {
        yes.addClass('selected');
        checkAnswer(true);
    });

    no.on('click', () => {
        no.addClass('selected');
        checkAnswer(false);
    });
});


function changeRandomBackground() {
    result.removeClass('hidden');
    let rand = random(0, 9);
    let col = `var(--col${rand})`;
    body.css('background', col);
    if (col == color) return true;
    else return false;
}

function checkAnswer(answer) {
    yes.attr('disabled', 'true');
    no.attr('disabled', 'true');
    console.log(`color : ${colorIsRight} - answer : ${answer}`);
    if (colorIsRight && answer) {
        result.html(`La bonne couleur (aka #FF6600) est trouvée !`);
    } else if ((!colorIsRight) && (!answer)) {
        result.html(`Effectivement, ce n'est pas ça. On recommence ?`);
    } else {
        result.html(`Réponse fausse. On recommence ?`);
    }
}