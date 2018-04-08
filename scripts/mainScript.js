$(window).on('load', function () {

  //Modal information image onglet 1
  jQuery( '#info' ).dialog( { 'autoOpen': false } );

  //Modal grande image onglet 2
  jQuery( '#image' ).dialog( { 'autoOpen': false } );

  //Modal pas d'image trouvée onglet 2
  jQuery( '#noImage' ).dialog( { 'autoOpen': false } );

  //Onglets
  $( "#onglets" ).tabs();

  //Séléction date
  $(function() {
    $("#date").datepicker();
  });

//Liste nombre photo
  for (let j = 1; j < 100; j++) {
    $( "#nombreDePhoto" ).append(("<option value='"+j+"'>"+j+"</option>"))
  }

//Autocomplete
  var tags = [];
  $( "#inputNomDeVille" ).autocomplete({
    source: function (request, response) {
      $.get("https://vicopo.selfbuild.fr/ville/"+$("#inputNomDeVille").val()+"?format=callback", function (reponse) {
        if (reponse.cities.length>3) {
          let sourceArray = [];
          for (let i = 0; i < 3; i++) {
            sourceArray[i] = {label:reponse.cities[i].city, value:reponse.cities[i].city}
          }
          response(sourceArray)
        }
      })
    },
    select: function () {
      $("#faireRequete").click()
    },
    minLength: 3
  });

  $("#faireRequete").on("click", function() {
    $.get("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=56097ac8c6cf97b680539ef25f536f32&text=["+$("#inputNomDeVille").val()+"]&format=json&nojsoncallback=?&per_page="+$("#nombreDePhoto").val(), function (response) {
      if ($("#date").datepicker("getDate") == null) {
        $("#tableOnglet-2").empty().append("<thead><tr><th>Image</th><th>Titre</th><th>Description</th><th>Propriétaire</th><th>Date</th></tr></thead><tbody></tbody>")
        $("#onglet-1").empty();
        if (response.photos.photo.length > 0) {
          for (photo of response.photos.photo) {
            $.get("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=56097ac8c6cf97b680539ef25f536f32&photo_id="+photo.id+"&format=json&nojsoncallback=?", function (response2) {
              $("#onglet-1").append("<img class='ongl1' data-id="+response2.photo.id+"   src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg' data-desc='"+response2.photo.description._content+"' data-owner='"+response2.photo.owner.username+"' data-heure='"+response2.photo.dates.taken+"' data-name='"+response2.photo.title._content+"'>")

              $("#tableOnglet-2 tbody").append("<tr><td><img class='ongl2' style='width:100px; height:auto;' src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg'></td><td>"+response2.photo.title._content+"</td><td>"+response2.photo.description._content+"</td><td>"+response2.photo.owner.username+"</td><td>"+response2.photo.dates.taken+"</td></tr>")

              $("#tableOnglet-2").DataTable()
              $('.ongl1').on("click", function(event) {
                $(".ui-dialog-content").dialog("close");
                  $("#info").attr("title","Description")

                  if (event.target.attributes[3].nodeValue == "") {
                    $("#info").empty().append("<p>Pas de description</p>")
                  } else {
                    $("#info").empty().append("<p>Description : "+event.target.attributes[3].nodeValue+"<br>Propriétaire : "+event.target.attributes[4].nodeValue+"<br>Date : "+event.target.attributes[5].nodeValue+"<br>Titre : "+event.target.attributes[6].nodeValue+"<br></p>")
                  }
                $("#info").dialog('open');
              });

              $('.ongl2').on("click", function(event) {
                $(".ui-dialog-content").dialog("close");
                  $("#image").attr("title","Description")

                  if (event.target.attributes[2].nodeValue == "") {
                    $("#image").empty().append("<p>Pas de description</p>")
                  } else {
                    $("#image").empty().append("<img src='"+event.target.attributes[2].nodeValue+"'>")
                    $( "#image" ).dialog( "option", "width", 700 )
                  }
                $("#image").dialog('open');
              });
            })
          }
        } else {
          $("#noImage").dialog('open');
        }
      } else {
        let dateString = $("#date").datepicker("getDate")
        let date = new Date(dateString)
        $("#tableOnglet-2").empty().append("<thead><tr><th>Image</th><th>Titre</th><th>Description</th><th>Propriétaire</th><th>Date</th></tr></thead><tbody></tbody>")
        $("#onglet-1").empty();
        if (response.photos.photo.length > 0) {
          for (photo of response.photos.photo) {
            $.get("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=56097ac8c6cf97b680539ef25f536f32&photo_id="+photo.id+"&format=json&nojsoncallback=?", function (response2) {
              if (new Date(response2.photo.dates.taken).getTime() > date.getTime()) {
                $("#onglet-1").append("<img class='ongl1' data-id="+response2.photo.id+"   src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg' data-desc='"+response2.photo.description._content+"' data-owner='"+response2.photo.owner.username+"' data-heure='"+response2.photo.dates.taken+"' data-name='"+response2.photo.title._content+"'>")

                $("#tableOnglet-2 tbody").append("<tr><td><img class='ongl2' style='width:100px; height:auto;' src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg'></td><td>"+response2.photo.title._content+"</td><td>"+response2.photo.description._content+"</td><td>"+response2.photo.owner.username+"</td><td>"+response2.photo.dates.taken+"</td></tr>")

                $("#tableOnglet-2").DataTable()
                $('.ongl1').on("click", function(event) {
                  $(".ui-dialog-content").dialog("close");
                    $("#info").attr("title","Description")

                    if (event.target.attributes[3].nodeValue == "") {
                      $("#info").empty().append("<p>Pas de description</p>")
                    } else {
                      $("#info").empty().append("<p>Description : "+event.target.attributes[3].nodeValue+"<br>Propriétaire : "+event.target.attributes[4].nodeValue+"<br>Date : "+event.target.attributes[5].nodeValue+"<br>Titre : "+event.target.attributes[6].nodeValue+"<br></p>")
                    }
                  $("#info").dialog('open');
                });

                $('.ongl2').on("click", function(event) {
                  $(".ui-dialog-content").dialog("close");
                    $("#image").attr("title","Description")

                    if (event.target.attributes[2].nodeValue == "") {
                      $("#image").empty().append("<p>Pas de description</p>")
                    } else {
                      $("#image").empty().append("<img src='"+event.target.attributes[2].nodeValue+"'>")
                      $( "#image" ).dialog( "option", "width", 700 )
                    }
                  $("#image").dialog('open');
                });
              }
            })
          }
        } else {
          $("#noImage").dialog('open');
        }
      }
    })
  })


  $(".onglet").on("click", function() {
    $(".ui-dialog-content").dialog("close");
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
