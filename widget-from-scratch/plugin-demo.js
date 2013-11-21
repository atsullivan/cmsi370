$(function () {
    $(".swivel-this").twoStateSwivel({
        change: function (oldAngle, newAngle) {
            console.log("Swiveled from " + oldAngle + " to " + newAngle);
        }
    });
});
