$(function () {
    $.getJSON(
        "http://lmu-diabolical.appspot.com/characters/" + window.location.hash.substr(1),
        function (character) {
            // Do something with the character.
            console.log(character);
            $("h1 > em > strong").text(character.name);
        }
    );
});
