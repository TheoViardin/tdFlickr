$(window).on('load', function () {

  for (let j = 1; j < 6; j++) {
    $( "#nombreDePhoto" ).append(("<option value='"+j+"'>"+j+"</option>"))
  }


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

  $("#faireRequete").on("click", function() {
    $.get("http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=56097ac8c6cf97b680539ef25f536f32&text=["+$("#inputNomDeVille").val()+"]&format=json&nojsoncallback=?&per_page="+$("#nombreDePhoto").val(), function (response) {
      console.log(response)
      if (response.photos.pages >= 0) {
        for (photo of response.photos.photo) {
          $("#photos").append("<img src='"+https://farmp+photo.farm+.staticflickr.com/+photo.server+/{+photo.secret+.jpg+"'>")
        }
      }
    })
  })

});



// http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=56097ac8c6cf97b680539ef25f536f32&user_id=140794856@N02&text=[valeur à chercher]&format=json&per_page=[nombre de page]

/*
{ "photos": { "page": 1, "pages": "62027", "perpage": 5, "total": "310132",
    "photo": [
      { "id": "40857408982", "owner": "57660560@N08", "secret": "7a44d65047", "server": "4788", "farm": 5, "title": "C'était l'été !!! Le viaduc de millau, Aveyron, France.", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "27026536408", "owner": "22467272@N03", "secret": "e10f175a76", "server": "800", "farm": 1, "title": "Le printemps s'installe ...!", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "40855167662", "owner": "22467272@N03", "secret": "a287e8e840", "server": "812", "farm": 1, "title": "Jeune  magnolia ...", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "39087592120", "owner": "22467272@N03", "secret": "f27c3554b2", "server": "807", "farm": 1, "title": "vous n'avez pas l'odeur ....huuuum !", "ispublic": 1, "isfriend": 0, "isfamily": 0 },
      { "id": "26023002347", "owner": "61748927@N02", "secret": "3d9cb17fe3", "server": "4795", "farm": 5, "title": "Lieu Unique", "ispublic": 1, "isfriend": 0, "isfamily": 0 }
    ] }, "stat": "ok" }
*/
