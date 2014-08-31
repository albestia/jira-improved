'use strict';

var page = require('../page');
var $ = page.$;

var previousFilter;
var previousItems;


var debounce = require('../util/debounce');
var sizzleCustomizations = require('../util/sizzle-customizations');

var $filter = $('<input>').addClass('filter').attr('placeholder', 'Filter');

function init() {

    // Add new jQuery filter for finding text anywhere
    sizzleCustomizations.addContainsAnywhere();

    $filter
        .on('keyup change', debounce(filter, 200))
        .replaceAll('#js-quickfilters-label');

    // Hotkey for `f`/ 'F'
    $(window.document).bind('keyup', function(e) {
        var KEY_F = 102;
        var KEY_f = 70;

        var $target = jQuery(e.target);
        if (page.AJS.keyboardShortcutsDisabled || $target.is(':input')) {
            return;
        }

        if (e.which === KEY_F || e.which === KEY_f) {
            $filter.focus();
            e.preventDefault();
            return false;
        }
    });

}

function filter() {

    // need to re-find all the issues incase some filter was changed that altered what tickets are viewable
    var $items = $('.ghx-issue');
    var value = $filter.val().trim();

    if (value === previousFilter && previousItems === $items.length) {
        return;
    }
    console.log('FILTER ON ', value);

    var $matches = $items.has(':containsAnywhere("' + value + '")');

    $items.find('.highlight').removeClass('highlight');

    if (value) {
        var searchFor = value.split(' ');

        searchFor.forEach(function(val){
            $matches.find(':containsAnywhere("' + val + '"):not(:has(*))').addClass('highlight');
        });
    }

    $items.not($matches).hide();
    $matches.show();
    previousFilter = value;
    previousItems = $items.length;

    page.changed(filter);
}

module.exports = {
    init: init,
    filter: filter
};
