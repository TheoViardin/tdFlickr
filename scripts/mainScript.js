$(window).on('load', function () {

  //Onglets
  $( "#onglets" ).tabs();

  $('img').on("click", function() {
    $("#info").dialog();
  });

//Liste nombre photo
  for (let j = 1; j < 6; j++) {
    $( "#nombreDePhoto" ).append(("<option value='"+j+"'>"+j+"</option>"))
  }

//Autocomplete
  var tags = [];
  $( "#inputNomDeVille" ).autocomplete({
    source: function (request, response) {
      $.get("http://infoweb-ens/~jacquin-c/codePostal/commune.php?commune="+$("#inputNomDeVille").val()+"&maxRows=3", function (reponse) {
        let i = 0
        let sourceArray = [];
        for (ville of reponse) {
          sourceArray[i] = {label:ville.Ville, value:ville.Ville}
          i++
        }
        response(sourceArray)
      })
    },
    minLength: 3
  });
});
