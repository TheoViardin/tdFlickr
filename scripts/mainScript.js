$(window).on('load', function () {

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

/*
$( "#inputNomDeVille" ).autocomplete({
  source: tags,
  minLength: 3,
  search: function(event, ui) {
    console.log(tags)
    $.get("http://infoweb-ens/~jacquin-c/codePostal/commune.php?commune="+$("#inputNomDeVille").val()+"&maxRows=3", function(response) {
      console.log(response[0].Ville)
      let i = 0
      let sourceArray = [];
      for (ville of response) {
        sourceArray[i] = {label:ville.Ville, value:ville.Ville}
        i++
      }
        console.log(sourceArray)
        $( "#inputNomDeVille" ).autocomplete( "option", "source", sourceArray);
        let valeur = $("#inputNomDeVille").val()
        $( "#inputNomDeVille" ).val("")
        console.log(valeur)
        $( "#inputNomDeVille" ).val(valeur)
    })
      console.log(tags)
  }
});
*/
