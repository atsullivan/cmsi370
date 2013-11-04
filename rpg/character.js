$(function () {
    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters/" + window.location.hash.substr(1),
        function (character) {
            // Do something with the character.
            console.log(character);
            $("h1 > em > strong").text(character.name);
            // JD: Still much to do with the character here...
        }
    );

	var characterRowTemplate = '<tr>' +
          '<td><a href="character.html#11111"></a></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
        '</tr>';
	
	// JD: And here you have another go at it.  But having the second call is superfluous;
    //     you should have extended the prior example instead.  The code in the success
    //     function here should be integrated with the code in the success function at
    //     the beginning of this file.
	$.getJSON(
	"http://lmu-diabolical.appspot.com/characters/" + window.location.hash.substr(1),
    function (character) {
    	// Do something with the character.
        var $characterRow = $(characterRowTemplate);

        // JD: No change of indent level necessary!
                $characterRow.find("td:nth-child(3)").text(character.classType);
                // JD: The nth-child numbers ^^^^^^^ should be shifted to the left.
                $characterRow.find("td:nth-child(4)").text(character.gender.substr(0, 1)); 
                $characterRow.find("td:nth-child(5)").text(character.level);
                $characterRow.find("td:nth-child(6)").text(character.money);
                $("#class-table > tbody").append($characterRow);
    }
	);

    // JD: No additional code for edit or delete.  I'm not looking for Ajax here because
    //     I did say that 2 Ajax calls will suffice.  But even without that, you could
    //     have done things like pre-filling of the character to edit, or some kind of
    //     simulation of deletion.
});

