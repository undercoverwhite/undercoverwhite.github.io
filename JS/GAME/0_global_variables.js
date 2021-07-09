var WORDS = {};
var PLAYERS = {};
var ROLES = {};

$(function() {
    // COPIES WORDS AND ROLES
    setsDefaultWORDS();
    setsDefaultROLES();
});

function setsDefaultWORDS() {
    WORDS = {};
    for (words in wordsJSON)
        WORDS[words] = wordsJSON[words];
}

function setsDefaultROLES() {
    ROLES = {};
    for (roles in rolesJSON)
        ROLES[roles] = rolesJSON[roles];
}
