// Dom - Copyright 2011 Andrey Petrov <andrey.petrov@shazow.net> (MIT Licensed)
// Based on a tiny subset of jQuery (http://jquery.com/)

var Dom = window.Dom = {
    select: function(selector) {
        return selector.charAt(0) == '#' ? document.getElementById(selector.substr(1)) : document.getElementsByTagName(selector);
    },
    create: function(name, attrs) {
        var e = document.createElement(name);
        for(var k in attrs) {
            e.setAttribute(k, attrs[k]);
        }
        return e;
    }
}
