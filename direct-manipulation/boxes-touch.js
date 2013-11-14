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
    
    
    
    //============================================================================================
    /**
     * Starts a box creation
     */
    /*startCreate: function (event) {
    	$.each(event.changedTouches, function (index, touch) {
    		// Sets the initial X and Y coordinates
    		touch.target.initialX = touch.pageX;
    		touch.target.initialY = touch.pageY;
    		
    		// Creates a new box
    		var newtemp = '<div class="box" style="width: 0px; height: 0px; left:' + touch.pageX + 'px; top:' + touch.pageY + 'px">' + '</div>';
    		var newbox = newtemp;    		
    		$("#drawing-area").append(newbox);
    		(touch.target.creatingbox) = $( "div div:last-child" );
    		(touch.target.creatingbox).addClass("create-highlight");
    		$("#drawing-area").find("div.box").each(function (index, element) {
    			element.addEventListener("touchstart", BoxesTouch.startMove, false);
    			element.addEventListener("touchend", BoxesTouch.unhighlight, false);
    		});
    	});
   		// Eat up the event so that the drawing area does not
        // deal with it.
   		event.stopPropagation();
    },*/
    //============================================================================================
    
    
    
    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    trackDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            event.preventDefault();
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });
            
            
	            // Deletion Warning and Class
	            if (!((touch.target.movingBox).hasClass("delete-box")) &&
			            (touch.pageX - touch.target.deltaX > 512 || touch.pageY - touch.target.deltaY > 512 || touch.pageX - touch.target.deltaX < 0 || touch.pageY - touch.target.deltaY < 0))
			            {
			            	(touch.target.movingBox).addClass("delete-box delete-highlight");
			            }
		        if (((touch.target.movingBox).hasClass("delete-box")) &&
		            (touch.pageX - touch.target.deltaX < 512 && touch.pageY - touch.target.deltaY < 512 && touch.pageX - touch.target.deltaX > 0 && touch.pageY - touch.target.deltaY > 0))
		            {
		            	(touch.target.movingBox).removeClass("delete-box delete-highlight");
		            }
            }
          
            //============================================================================================
            // For creating a box
		    /*if (touch.target.creatingbox) {
		    	if (touch.pageX < touch.target.initialX){
		    		touch.target.creatingbox.offset({
		    			left: touch.pageX,
		    		});
		    		touch.target.creatingbox.width(touch.target.initialX - touch.pageX):
		    	}
		    	else{
		    		touch.target.creatingbox.offset({
		    			left: touch.target.initialX,
		    		});
		    		touch.target.creatingbox.width(touch.pageX - touch.target.initialX);
		    	}
		    	if(touch.pageY < touch.target.initialY){
		    		touch.target.creatingbox.offset({
		    			top: touch.pageY,
		    		});
		    		touch.target.creatingbox.height(touch.target.initialY - touch.pageY);
		    	}
		    	else{
		    		touch.target.creatingbox.offset({
		    			top: touch.target.intialY,
		    		});
		    		touch.target.creatingbox.height(touch.pageY - touch.target.initialY);
		    	}
		    }*/
		    //============================================================================================
		    

            
	                 
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
            
            //============================================================================================
            if (touch.target.creatingbox) {
            	touch.target.creatingbox.removalClass("create-highlight");
            	touch.target.creatingbox = null;
            }
            //============================================================================================
            
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
