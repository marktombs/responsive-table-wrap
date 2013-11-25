# Responsive Table Wrap
author mark.tombs@leanon.se 2013 LeanOn AB

A plugin for making tables a bit responsive. The idea is that for small devices we wrap infividual rows, so instead of 
one row per item there are two. Then you can fit in twice as much stuff on the little screen.

Classes are added to enable styling while the table is wrapped. Usually the first column
 is reserved as a special 'id' column and given double height, but this it optional (option 'headerCount').

## Options:
 - breakpoint : 690 - at which window size should the table be wrapped?
 - splitAt : 'auto' - or number of columns to keep in the first row. If auto, the table is split in half.
 - classPrefix : 'tw' - in case of class name clashes you can change the prefix prepended to class names.
 - headerCount : 1 - the number of header columns that should be given rowcount=2 and not wrapped.

 ## example usage

 Using defaults. The first column will be used as a 'header' column, and the rest will be split in half.

    $('#myTable').responsiveTableWrap();

 With custom settings

    $('€myTable').responsiveTableWrap({breakpoint:500, splitAt:4, headerCount : 2});