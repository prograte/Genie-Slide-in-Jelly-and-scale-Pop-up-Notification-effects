/*!
 * classEditor - It contains class helper functions
 *
 * These functions include:-
 *
 * classEditor.has( element, 'my-current-class' ) -> true/false
 * classEditor.add( element, 'my-new-class' )
 * classEditor.remove( element, 'my-unwanted-class' )
 * classEditor.toggle( element, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

(function (window, document) {

    'use strict';

    // class helper functions

    function class_Regex(class_name) {
        return new RegExp("(^|\\s+)" + class_name + "(\\s+|$)");
    }

    // classList support for class management
    // To be fair, the api won't accept at once multiple classes
    let hasThisClass, addsClass, removesClass;

    if ('classList' in document.documentElement) {
        hasThisClass = function (element, Class) {
            return element.classList.contains(Class);
        };
        addsClass = function (element, Class) {
            element.classList.add(Class);
        };
        removesClass = function (element, Class) {
            element.classList.remove(Class);
        };
    } else {
        hasThisClass = function (element, Class) {
            return class_Regex(Class).test(element.className);
        };
        addsClass = function (element, Class) {
            if (!hasThisClass(element, Class)) {
                element.className = element.className + ' ' + Class;
            }
        };
        removesClass = function (element, Class) {
            element.className = element.className.replace(class_Regex(Class), ' ');
        };
    }

    function togglesClass(element, Class) {
        let functionFn = hasThisClass(element, Class) ? removesClass : addsClass;
        functionFn(element, Class);
    }

    let classEditor = {
        // full names
        hasClass: hasThisClass,
        addClass: addsClass,
        removeClass: removesClass,
        toggleClass: togglesClass,
        // short names
        has: hasThisClass,
        add: addsClass,
        remove: removesClass,
        toggle: togglesClass
    };

    // transport
    if (typeof define === 'function') {
        define(classEditor);
    } else {
        // browser global
        window.classEditor = classEditor;
    }

})(window, document);