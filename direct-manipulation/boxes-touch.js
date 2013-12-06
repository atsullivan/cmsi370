var BoxesTouch = {
    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    setDrawingArea: function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startCreate, false);
                element.addEventListener("touchmove", BoxesTouch.trackDrag, false);
                element.addEventListener("touchend", BoxesTouch.endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startMove, false);
                element.addEventListener("touchend", BoxesTouch.unhighlight, false);
            });
    },
 
    /**
     * Starts a box creation
     */
    startCreate: function (event) {
    	$.each(event.changedTouches, function (index, touch) {
    		touch.initialX = touch.pageX;
    		touch.initialY = touch.pageY;
    		// Creates a new box
            // JD: Alternatively, you can define this "template" as a standalone
            //     string at the top, then set its attributes via jQuery, e.g.:
            //
            //     ...
            //     TEMP_BOX_TEMPLATE: '<div class="box"></div>';
            //
            //     ...
            //
            //     var newbox = $(BoxesTouch.TEMP_BOX_TEMPLATE).css({
            //         width: "0px",
            //         height: "0px",
            //         left: touch.pageX + "px",
            //         top: touch.pageY + "px"
            //     });
            //
            //     ...
            //
            //     You may find this approach to be a little more readable and
            //     less error-prone.
            //
    		var newbox = '<div class="box" style="width: 0px; height: 0px; left:' + touch.pageX + 'px; top: ' + touch.pageY + 'px">' + '</div>';
            // JD: Ack---you hardcoded #drawing-area!
    		$("#drawing-area").append(newbox);
    		touch.creation = $("div div:last-child");
            // JD: Note, your CSS does not have a selector for .creation-highlight.
    		touch.creation.addClass("creation-highlight");
    		$("#drawing-area").find("div.box").each(function (index, element) {
    			element.addEventListener("touchstart", BoxesTouch.startMove, false);
    			element.addEventListener("touchend", BoxesTouch.unhighlight, false);
    		});
    	});
   		event.stopPropagation();
    },

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    trackDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            event.preventDefault();
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                var boxParent = $(touch.target.movingBox).parent(),
                    parentWidth = boxParent.width(),
                    parentHeight = boxParent.height();
                    parentLeft = boxParent.offset().left,
                    parentTop = boxParent.offset().top,
                    parentRight = parentLeft + parentWidth,
                    parentBottom = parentTop + parentHeight;

                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });
            
	            // Deletion Warning and Class
                // JD: Unhardcoded drawing area bounds duly noted.  Good job!
	            if (touch.pageX - touch.target.deltaX > parentRight || 
			        touch.pageY - touch.target.deltaY > parentBottom || 
			        touch.pageX - touch.target.deltaX < parentLeft || 
			        touch.pageY - touch.target.deltaY < parentTop)
                    { // JD: Even with a multiline if condition I would stick the
                      //     opening { on the prior line.  This lets your preserve
                      //     the single-level indenting.
			            touch.target.movingBox.addClass("delete-box delete-highlight");
			        }
		        if (touch.pageX - touch.target.deltaX <= parentRight && 
		            touch.pageY - touch.target.deltaY <= parentBottom && 
		            touch.pageX - touch.target.deltaX >= parentLeft && 
		            touch.pageY - touch.target.deltaY >= parentTop)
		            {
		                touch.target.movingBox.removeClass("delete-box delete-highlight");
		            }
            }
          
            // For creating a box
            // JD: As you probably noticed, in principle this approach initially works.
            //     However, eventually the box "stops" rubberbanding.  The reason is that
            //     custom properties assigned to the touch object, like creation...well,
            //     mainly creation...are fragile.  The web browser sometimes clears out
            //     these custom properties.
            //
            //     Thus, to get this going 100%, you need a different mechanism for
            //     associating a touch with the created box that it is rubberbanding.
            //     Hint: All touch objects have a guaranteed-unique and stable identifier.
		    if (touch.creation) {
                var createLeft, createTop, createWidth, createHeight;

                if (touch.pageX < touch.initialX) {
                    createLeft = touch.pageX;
                    createWidth = touch.initialX - touch.pageX;
                    if (touch.pageY < touch.initialY) {
                        createTop = touch.pageY;
                        createHeight = touch.initialY - touch.pageY;
                    } else {
                        createTop = touch.initialY;
                        createHeight = touch.pageY - touch.initialY;
                    }
                } else {
                    createLeft = touch.initialX;
                    createWidth = touch.pageX - touch.initialX;
                    if (touch.pageY < touch.initialY) {
                        createTop = touch.pageY;
                        createHeight = touch.initialY - touch.pageY;
                    } else {
                        createTop = touch.initialY;
                        createHeight = touch.pageY - touch.initialY;
                    }
                }

                // JD: This still needs to be indented.
            touch.creation
                    .offset({
                        left: createLeft,
                        top: createTop
                    })
                    .width(createWidth)
                    .height(createHeight);
            }           
        });
        
        // Don't do any touch scrolling.
        event.preventDefault();
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                touch.target.movingBox = null;
            }
            if (touch.target.creatingbox) {
                // JD: The function is called removeClass, not removalClass.
            	touch.creation.removalClass("create-highlight");
            	touch.creation = null;
            }
        });
    },

    /**
     * Indicates that an element is unhighlighted.
     */
    unhighlight: function () {
        $(this).removeClass("box-highlight");
        // Deletes box if it has "delete-box" class
        if ($(this).hasClass("delete-box")){
        	$(this).remove();
        }
        // JD: Why is this here?  Copy-paste artifact...?
        $(this).removeClass("box-highlight");
    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    }

};
