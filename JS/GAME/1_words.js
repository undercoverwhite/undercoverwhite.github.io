var flex = $('#flex_addWords');
var Ctextarea = 'textarea_addWords';
var Cdiv = 'wordPatch_addWords';
var initWordsPatchesCount = 3;
var WORDS = wordsJSON;
var persoWords = {};

$(function() {

    // BEFORE USE
    setFlexAddWords();

    // WHEN USED
    validateAddedWords();
});


/*
    SETS :
        number initWordsPatchesCount of word patches
        function attached to the 2 buttons (add a word patch / delete empty words patches)
*/
function setFlexAddWords() {

    // creates initWordsPatchesCount patches
    for (var i = 0; i < initWordsPatchesCount; i++) {
        var bp = createWordsPatch();
        flex.append(bp);
    }

    // attach adding patches function to the left button
    $('#addToFlex_addWords').click(function() {
        var bp = createWordsPatch();
        flex.append(bp);
    });

    // attach removing all empty patches function to the right button
    $('#removeEmpty_addWords').click(function() {
        deleteEmptyWordsPatches();
    });
}

function createWordsPatch(titleName) {
    // counts how much groups there is already
    var count = flex.find('.' + Cdiv).length;
    count ++;

    // creates the div
    var bp = create('div').addClass('simple light').addClass(Cdiv);
    bp.append(createHTML('h3', 'groupe ' + count));

    // creates the textarea and appends it to div
    var s = "Écrire ici vos mots, séparés d'un retour à la ligne.";
    var textarea = create('textarea').addClass('simple light').addClass(Ctextarea);
    textarea.attr('placeholder', s);
    bp.append(textarea);

    return bp;
}

function deleteEmptyWordsPatches() {
    // finds all empty div and deletes them
    var correctWordsPatchesCount = 0;
    flex.find('.' + Cdiv).each(function() {
        var ths = $(this);
        var txta = ths.find('.' + Ctextarea).eq(0);
        if (txta.val() == '') ths.remove();
        else {
            correctWordsPatchesCount ++;
            ths.find('h3').eq(0).html('Groupe ' + correctWordsPatchesCount);
        }
    });

    var toAdd = initWordsPatchesCount - correctWordsPatchesCount;
    console.log(toAdd);

    if (toAdd > 0) {
        for (var i = 0; i < toAdd; i++) {
            var bp = createWordsPatch();
            flex.append(bp);
        }
    }
};



//////////////
/*

    VALIDATES the changed values of persoWords
    if no word has been added, the basic words are used
    -> the total amount of words (basicWords from word.JSON + persoWords)
    has still to be calculated later on after the characters are chosen.
    It is not calculated here in case the players want to go back
    and change the values of the words, so that the total amount of
    words is only calculated once.

    if user wants to continue without adding words
    but words are detected in the textareas, makes sure
    it is indeed what the user really wants to do

*/
function validateAddedWords() {
    $('#VALIDATE_addWords').click(function() {
        // persoWords is automatically cleaned
        persoWords = {};
        var patches = 0;

        // find all the div elements
        flex.find('.' + Cdiv).each(function() {
            var ths = $(this);
            var txta = ths.find('.' + Ctextarea).eq(0);

            //verifies if textarea is empty
            if (txta.val() == '') return;
            patches ++;

            // creates the array of words
            var words = txta.val().split("\n");
            var correctWords = [];
            for (var i = 0; i < words.length; i++) {
                words[i] = strip(words[i]);
                if (words[i] != '') correctWords.push(words[i]);
            }

            // adds it to persoWords if there are at least 2 words in it
            if (correctWords.length > 1)
                persoWords[patches] = correctWords;
        });

        if (patches == 0) {
            // verifies if persoWords is empty; validates only if user is sure
            if (confirm('Continuer sans ajouter de mot personnel ? Les mots par défaut seront utilisés.')) {
                $('#realVALIDATE_addWords').click();
            }
        } else {
            // goes on and validates the data
            $('#realVALIDATE_addWords').click();
        }
    });


    $('#emptyAll_addWords').click(function() {
        var patches = 0;

        // find all the div elements
        flex.find('.' + Cdiv).each(function() {
            var ths = $(this);
            var txta = ths.find('.' + Ctextarea).eq(0);

            //verifies if textarea is empty
            if (txta.val() == '') return;
            else patches ++;
        });

        if (patches != 0) {
            // verifies if persoWords is empty; validates only if user is sure
            if (confirm('Des mots semblent avoir été entrés. Continuer quand même ? Les mots par défaut seront utilisés.')) {
                // validates and goes to next phase
                cleanAllWords();
                $('#realVALIDATE_addWords').click();
            }
        } else {
            // validates and goes to next phase
            cleanAllWords();
            $('#realVALIDATE_addWords').click();
        }
    });
};

// sets to default :
// clean persoWords and only 3 clean textareas
function cleanAllWords() {
    persoWords = {};
    flex.html('');
    for (var i = 0; i < initWordsPatchesCount; i++) {
        var bp = createWordsPatch();
        flex.append(bp);
    }
}
