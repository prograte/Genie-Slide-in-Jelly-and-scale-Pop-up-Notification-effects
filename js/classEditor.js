/*
 * classEditor - It contains class helper functions
 *
 * These functions include:-
 *
 * classEditor.has( element, 'my-current-class' ) -->>> true or false
 * classEditor.add( element, 'my-new-class' )
 * classEditor.remove( element, 'my-unwanted-class' )
 * classEditor.toggle( element, 'my-class' )
 */

(function (window, document) {

    'use strict';

    // class helper functions for the application

    function class_Regex(class_name) {
        return new RegExp("(^|\\s+)" + class_name + "(\\s+|$)");
    }

    // classList support for the management of classes
    // The API accepts only one change at once instead of multiple classes
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
    } /*If not execute this*/
    else {
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
        // The function full names
        removeClass: removesClass,
        toggleClass: togglesClass,
        addClass: addsClass,
        hasClass: hasThisClass,

        // short names for the functions above
        remove: removesClass,
        add: addsClass,
        toggle: togglesClass,
        has: hasThisClass
    };

    // transport
    if (typeof define === 'function') {
        define(classEditor);
    } else {

        // It is found in the browser at a global scope

        window.classEditor = classEditor;
    }

})(window, document);