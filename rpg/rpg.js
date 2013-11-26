// Big things have small beginnings...
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

$(function () {
    // JD: This is orphaned code!  Your page no longer has an element
    //     with id="delete-button".
    $("#delete-button").popover({ placement: 'left' });
    
    var characterRowTemplate = '<tr>' +
          '<td><input type="checkbox" value="0"></td>' +
          '<td><a href="character.html#11111"></a></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
        '</tr>';

     $("#confirm-create-button").click(function () {
        // JD: Ajax not implemented for character creation.
        console.log("Create confirmed!");
        window.location = "character.html#" + $("#createModal input.name").val() +
            "#" + $("#createModal input.level").val() + "#" + $("#createModal select.gender").val() +
            "#" + $("#createModal input.money").val();
    });

    // JD: Nice that you have this, although this is still pretty much
    //     the example that was done in class.
    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters",
        function (characters) {
            // Do something with the character list.
            characters.forEach(function (character) {
                var $characterRow = $(characterRowTemplate);
                $characterRow.find("td:nth-child(2) > a")
                    .attr({ href: "character.html#" + character.id })
                    .text(character.name);
                $characterRow.find("td:nth-child(3)").text(character.classType);
                $characterRow.find("td:nth-child(4)").text(character.gender.substr(0, 1)); 
                $characterRow.find("td:nth-child(5)").text(character.level);
                $characterRow.find("td:nth-child(6)").text(character.money);
                $("#character-table > tbody").append($characterRow);
            });
        }
    );

});
