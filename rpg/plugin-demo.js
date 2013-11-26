$(function () {
    $(".swivel-this.sex").twoStateSwivel({
        values: {
            front: "female",
            back: "male"
        },

        change: function (oldAngle, newAngle) {
            console.log("Swiveled from " + oldAngle + " to " + newAngle);
        }
    });

    $(".swivel-this.switch").twoStateSwivel({
        values: {
            front: "off",
            back: "on"
        },

        change: function (oldAngle, newAngle) {
            console.log("Swiveled from " + oldAngle + " to " + newAngle);
        }
    });

    $(".swivel-this.yesno").twoStateSwivel({
        values: {
            front: "yes",
            back: "no"
        },

        change: function (oldAngle, newAngle) {
            console.log("Swiveled from " + oldAngle + " to " + newAngle);
        }
    });
});
