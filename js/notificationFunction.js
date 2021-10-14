(function (window, document) {

    /** This enables you to avoid using undeclared variables */
    'use strict';


    /** Get the root element and link the animation end event names*/
    let support = {animations: Modernizr.cssanimations},
        animEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'OAnimation': 'oAnimationEnd',
            'msAnimation': 'MSAnimationEnd',
            'animation': 'animationend'
        },
        // animation end event name
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')];

    /**
     * extend object function
     */
    function extend(obj_a, obj_b) {
        for (let key in obj_b) {
            if (obj_b.hasOwnProperty(key)) {
                obj_a[key] = obj_b[key];
            }
        }
        return obj_a;
    }

    /**
     * NotificationFunction function
     */
    function NotificationFunction(options) {
        this.options = extend({}, this.options);
        extend(this.options, options);
        this._init();
    }

    /**
     * NotificationFunction options
     */
    NotificationFunction.prototype.options = {
        // element to which the notification will be appended
        // defaults to the document.body
        notificationWrapper: document.body,
        // the notificationMessage
        notificationMessage: 'Hello!!!',
        // notification Layout type: growl|attached|bar|other
        notificationLayout: 'growl',
        // effects for the specified notification Layout:
        // for growl notification Layout: scale|slide|genie|jelly
        notificationEffect: 'slide',
        // notice, warning, error, success
        // will add class notification-type-warning, notification-type-error or notification-type-success
        notificationType: 'error',
        // if the user does not close the notification then we remove it
        // after the following time
        totalTimeToLeave: 6000,
        // callbacks
        onClose: function () {
            return false;
        },
        onOpen: function () {
            return false;
        }
    };

    /**
     * init function
     * initialize and cache some vars
     */
    NotificationFunction.prototype._init = function () {
        // create HTML structure
        this.ntf = document.createElement('div');
        this.ntf.className = 'ns-box ns-' + this.options.notificationLayout + ' ns-effect-' + this.options.notificationEffect + ' ns-type-' + this.options.notificationType;
        let innerString = '<div class="ns-box-inner">';
        innerString += this.options.notificationMessage;
        innerString += '</div>';
        innerString += '<span class="ns-close"></span></div>';
        this.ntf.innerHTML = innerString;

        // append to body or the element specified in options.notificationWrapper
        // This creates the notification before the first child in the HTML file.
        this.options.notificationWrapper.insertBefore(this.ntf, this.options.notificationWrapper.firstChild);

        // dismiss after [options.totalTimeToLeave]ms
        let notification_self = this;

        if (this.options.totalTimeToLeave) { // checks to make sure totalTimeToLeave is not set to false in notification initialization
            this.dismisstotalTimeToLeave = setTimeout(function () {
                if (notification_self.active) {
                    notification_self.dismiss();
                }
            }, this.options.totalTimeToLeave);
        }

        // init events
        this._initEvents();
    };

    /**
     * initialize the notification events
     */
    NotificationFunction.prototype._initEvents = function () {
        let notification_self = this;
        // dismiss notification
        this.ntf.querySelector('.ns-close')
            .addEventListener('click',
                function () {
                    notification_self.dismiss();
                });
    };

    /**
     * show the notification
     */
    NotificationFunction.prototype.show = function () {
        this.active = true;
        classEditor.remove(this.ntf, 'ns-hide');
        classEditor.add(this.ntf, 'ns-show');
        if (typeof this.options.onOpen === 'function')
            this.options.onOpen();
    };

    /**
     * dismisses the notification
     */
    NotificationFunction.prototype.dismiss = function () {
        let notification_self = this;
        this.active = false;
        clearTimeout(this.dismisstotalTimeToLeave);
        classEditor.remove(this.ntf, 'ns-show');
        setTimeout(function () {
            classEditor.add(notification_self.ntf, 'ns-hide');

            // callback
            if (typeof notification_self.options.onClose === 'function')
                notification_self.options.onClose();
        }, 25);

        // after animation ends remove ntf from the DOM
        let onEndAnimationFn = function (ev) {
            if (support.animations) {
                if (ev.target !== notification_self.ntf) return false;
                this.removeEventListener(animEndEventName, onEndAnimationFn);
            }
            notification_self.options.notificationWrapper.removeChild(notification_self.ntf);
        };

        if (support.animations) {
            this.ntf.addEventListener(animEndEventName, onEndAnimationFn);
        } else {
            onEndAnimationFn();
        }
    };

    /**
     * add to global namespace
     */
    window.NotificationFunction = NotificationFunction;

})(window, document);