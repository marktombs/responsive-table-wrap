/**
 * responsive tables plugin for jquery.
 *
 * @author mark.tombs@leanon.se
 * @copyright (c) 2013 LeanOn AB
 *
 * This plugin will, at a certain window width, split the table rows in half and move half of it down. In effect,
 * one row becomes too. Classes are added to enable styling while the table is wrapped. Usually the first column
 * is reserved as a special 'id' column and given double height, but this it optional (option 'headerCount').
 *
 * Options:
 * - breakpoint : 690 - at which window size should the table be wrapped?
 * - splitAt : 'auto' - or number of columns to keep in the first row. If auto, the table is split in half.
 * - classPrefix : 'tw' - in case of class name clashes you can change the prefix prepended to class names.
 * - headerCount : 1 - the number of header columns that should be given rowcount=2 and not wrapped.
 *
 */
'use strict';
(function ($) {

  $.fn.responsiveTableWrap = function (options) {

    // some variables
    var settings, state, elements, classes;

    // for tracking state
    state = {
      wrapped: 'wrapped',
      unwrapped: 'unwrapped'
    };

    // defaults
    settings = $.extend({}, {
      breakpoint: 690,
      classPrefix: 'tw-',
      splitAt: 'auto',
      headerCount: 1
    }, options);

    classes = {
      // put on the whole table when wrapped
      table: settings.classPrefix + 'wrapped',
      // put on the top row
      over: settings.classPrefix + 'over',
      // put on the bottom row
      under: settings.classPrefix + 'under',
      // put on header columns
      header: settings.classPrefix + 'header',
      // put on cells that have their colcount changed
      stretched : settings.classPrefix + 'stretched'
    };

    state.state = state.unwrapped;
    elements = this;

    /**
     * for every row in the table add a new row under it and move half of the row down
     * @param $tables
     */
    function wrapTable($tables) {

      $tables.each(function (i, e) {

        var $table = $(e);
        $table.addClass(classes.table);
        // for every row in the table...
        $table.find('tr').each(function (j, tr) {

          var $tr = $(tr);
          var $trCells = $tr.find('td,th');

          // set up autosplitting if its turned on
          var splitAt = settings.splitAt;
          if (settings.splitAt === 'auto') {
            splitAt = Math.floor(($trCells.length - settings.headerCount) / 2) + settings.headerCount;
            var isEvenColCount = (splitAt / 2 === Math.floor(splitAt / 2));
            if (!isEvenColCount) {
              splitAt = splitAt + 1;
            }
          }

          // make a new row
          var newrow = document.createElement('tr');
          var $newrow = $(newrow);

          $trCells.each(function (k, td) {
            if (k >= splitAt) {
              // remove the cell from the old row
              $(td).detach();
              // and add to the new one
              $(newrow).append(td);
            }
          }).slice(0,settings.headerCount).attr('rowspan', 2).addClass(classes.header);

          $tr.addClass(classes.over);
          // refresh the cells as we've removed a load now
          $trCells = $tr.find('td,th');

          $newrow.addClass(classes.under);
          // if the number of cols in over and under is not the same extend the last
          // col in the shorter row
          var colCountDiff = $trCells.length - $newrow.find('td,th').length;
          if (colCountDiff > 0) {
            // lower
            $newrow.find('td,th').last().attr('colspan', colCountDiff).addClass(classes.stretched);
          }
          if (colCountDiff < 0) {
            // upper
            $trCells.last().attr('colspan', (colCountDiff * -1) + settings.headerCount + 1).addClass(classes.stretched);
          }
          $tr.after(newrow);


        });
      });

    }

    /**
     * for every row in the table, remove any extra added rows and put the cells back where they were before
     * @param $tables
     */
    function unwrapTable($tables) {

      $tables.each(function (i, e) {

        var $table = $(e);
        // go through the under rows and put their cells back on the row above
        $table.find('tr.' + classes.under).each(function (j, tr) {
          var $tr = $(tr);
          var $prev = $tr.prev();
          $tr.find('td,th').each(function (k, td) {
            $(td).detach();
            $prev.append(td);
          });

          // remove header rowspan and class
          $('.' + classes.header).attr('rowspan', 1).removeClass(classes.header);

          // remove classes from rows and the row itself
          $tr.removeClass(classes.under).remove();

        });
        // remove class from table and remove colspans
        $table.find('.' + classes.over).removeClass(classes.over);
        $table.find('.' + classes.under).removeClass(classes.under);
        $table.find('.' + classes.stretched).attr('colspan',1).removeClass(classes.stretched);
        $table.removeClass(classes.table);
      });
    }

    function checkSize() {
      var width = $(window).width();
      if (width <= settings.breakpoint && state.state === state.unwrapped) {
        state.state = state.wrapped;
        wrapTable(elements);
      } else if (width > settings.breakpoint && state.state === state.wrapped) {
        state.state = state.unwrapped;
        unwrapTable(elements);
      }
      return true;
    };

    // set up listening to resize
    $(window).on('resize', function () {
      checkSize();
      return true;
    });
    // run once on startup too
    checkSize();

    return this;

  }
}(jQuery));