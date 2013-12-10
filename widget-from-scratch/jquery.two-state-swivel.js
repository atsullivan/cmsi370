// JD: Well, I really can't say much about this code, can I, *because it's
//     exactly where I left it!*  I hope you remembered that the plugin was
//     not completely finished: there was that upside-down/rightside-up bug
//     which I wasn't able to clean up, and you probably realized when
//     integrating this into your RPG web app that it would be nice to set
//     the value of the widget programmatically.
/*
  A sample jQuery plug-in: this one converts the selected elements into a 3D
  “swivel” control.

  This plugin's options object can include:

    values: {
        front: "front value",
        back: "back value"
    }
    - An object with the given properties indicating the text to display
      on the "front" and "back" of the widget.

    change: function () { }
    - Callback for whenever the control has been manipulated.

   For example:
   
   $(selector).twoStateWidget({
       values: {
           front: "male",
           back: "female"
       },

       change: function () {
       }
   });
*/
(function ($) {
    // Private plugin helpers.
    var setSwivelValues = function ($element, angle) {
            // JD: This function definitely needs that adjustment to accommodate
            //     the text orientation issue.
            var newCss = "rotate(180deg) perspective(500px) rotateY(" + angle + "deg)";
            $element.css({
                '-moz-transform': newCss,
                '-webkit-transform': newCss
            }).data({
                'swivel-angle': angle
            });
        };

    $.fn.twoStateSwivel = function (options) {
        var $this = this,
            $current = null,
            anchorX = 0,
            front = options.values ?
                (options.values.front || "front") :
                "front",
            back = options.values ?
                (options.values.back || "back") :
                "back";

        $this.addClass("two-state-swivel")
            .text(front)
            .mousedown(function (event) {
                $current = $(this);
                anchorX = event.screenX - ($current.data('swivel-angle') || 0);
            });

        // Other mouse events go at the level of the document because
        // they might leave the element's bounding box.
        $(document)
            .mousemove(function (event) {
                if ($current) {
                    var currentAngle = $current.data('swivel-angle') || 0,
                        newAngle = event.screenX - anchorX;

                    setSwivelValues($current, newAngle);

                    var clippedAngle = Math.abs(newAngle % 360);
                    $current.text(clippedAngle < 270 && clippedAngle > 90 ? back : front);

                    // Invoke the callback.
                    if ($.isFunction(options.change)) {
                        options.change.call($current, currentAngle, newAngle);
                    }
                }
            })
            .mouseup(function (event) {
                if ($current) {
                    var clippedAngle = Math.abs(($current.data('swivel-angle') || 0) % 360);
                    setSwivelValues($current, (clippedAngle < 270 && clippedAngle > 90) ? -180 : 0);
                    // JD: Note also that you want to invoke the callback here too,
                    //     because the value likely "snapped" to 0 or -180.
                }

                $current = null;
            });
    };
}(jQuery));
