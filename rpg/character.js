$(function () {
    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters/" + window.location.hash.substr(1),
        function (character) {
            // Do something with the character.
            console.log(character);
            $("h1 > em > strong").text(character.name);
        }
    );

	var characterRowTemplate = '<tr>' +
          '<td><a href="character.html#11111"></a></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
          '<td></td>' +
        '</tr>';
	
	
	$.getJSON(
	"http://lmu-diabolical.appspot.com/characters/" + window.location.hash.substr(1),
    function (character) {
    	// Do something with the character.
        var $characterRow = $(characterRowTemplate);
                $characterRow.find("td:nth-child(3)").text(character.classType);
                $characterRow.find("td:nth-child(4)").text(character.gender.substr(0, 1)); 
                $characterRow.find("td:nth-child(5)").text(character.level);
                $characterRow.find("td:nth-child(6)").text(character.money);
                $("#class-table > tbody").append($characterRow);
    }
	);




});

