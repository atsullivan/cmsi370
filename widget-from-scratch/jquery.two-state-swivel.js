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
                        newAngle = event.screenX - anchorX,
                        newCss = "perspective(500px) rotateY(" + newAngle + "deg)";

                    $current.css({
                        '-moz-transform': newCss,
                        '-webkit-transform': newCss
                    }).data({
                        'swivel-angle': newAngle
                    });

                    var clippedAngle = Math.abs(newAngle % 360);
                    $current.text(clippedAngle < 270 && clippedAngle > 90 ? back : front);

                    // Invoke the callback.
                    if ($.isFunction(options.change)) {
                        options.change.call($current, currentAngle, newAngle);
                    }
                }
            })
            .mouseup(function (event) {
                $current = null;
            });
    };
}(jQuery));
