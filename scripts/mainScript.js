// Evenement lancé au chargement de la page
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
      $.get("https://vicopo.selfbuild.fr/ville/"+$("#inputNomDeVille").val()+"?format=callback", function (reponse) { // Recupere une liste de villes en fonction du string entré
        if (reponse.cities.length>3) {
          let sourceArray = [];
          for (let i = 0; i < 3; i++) { // On ne garde que 3 trois des villes
            sourceArray[i] = {label:reponse.cities[i].city, value:reponse.cities[i].city} // On ajoute les villes dans l'autocomplete
          }
          response(sourceArray)
        }
      })
    },
    select: function () { // Lorsque l'utilisateur clic sur une ville proposée, on simule une clic sur le bouton de recherche
      $("#faireRequete").click()
    },
    minLength: 3 // La source ne se met à jour que si l'utilisateur entre minimum trois caractères
  });


// Fonction qui effectue les differentes requetes et affiche les photos et leurs informations
  $("#faireRequete").on("click", function() { // Lorque l'on clic sur le bouton de recherche
  // On effectue la requete sur l'API de flickr qui renvoie des objects contenant les informations sur les dernieres photos en rapport avec la ville selectionnée
    $.get("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=56097ac8c6cf97b680539ef25f536f32&text=["+$("#inputNomDeVille").val()+"]&format=json&nojsoncallback=?&per_page="+$("#nombreDePhoto").val(), function (response) {
      // Si aucune date n'a été selectionnée, on affiche simplement les photos
      if ($("#date").datepicker("getDate") == null) {
        $("#tableOnglet-2").empty().append("<thead><tr><th>Image</th><th>Titre</th><th>Description</th><th>Propriétaire</th><th>Date</th></tr></thead><tbody></tbody>") // Entete du tableau de l'onglet 2
        $("#onglet-1").empty(); // On vide l'onglet au cas ou une recherche ai deja ete faite
        if (response.photos.photo.length > 0) { // Si il y a bien une ou des photos dans la reponse de l'API
          for (photo of response.photos.photo) { // On traite chaque photo une par une
            // On fait une nouvelle requete par photo qui permet de recupérer plus de détails sur celle-ci en utilisant son ID
            $.get("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=56097ac8c6cf97b680539ef25f536f32&photo_id="+photo.id+"&format=json&nojsoncallback=?", function (response2) {
              // On affiche les images les une à la suite des autres dans l'onglet 1 en stockant les informations dans des attributs data html
              $("#onglet-1").append("<img class='ongl1' data-id="+response2.photo.id+" src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg' data-desc='"+response2.photo.description._content+"' data-owner='"+response2.photo.owner.username+"' data-heure='"+response2.photo.dates.taken+"' data-name='"+response2.photo.title._content+"'>")
              // On ajoute une ligne de tableau par image avec l'image en taille reduite suivie de ses informations
              $("#tableOnglet-2 tbody").append("<tr><td><img class='ongl2' style='width:100px; height:auto;' src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg'></td><td>"+response2.photo.title._content+"</td><td>"+response2.photo.description._content+"</td><td>"+response2.photo.owner.username+"</td><td>"+response2.photo.dates.taken+"</td></tr>")

              $("#tableOnglet-2").DataTable() // On actualise la jQuery UI DataTable à chaque ajout de photos
              $('.ongl1').on("click", function(event) { // Au clique sur les images de l'onglet 1, on affiche une boite de dialogue
                $(".ui-dialog-content").dialog("close"); // On ferme les boites de dialogue deja ouvertes
                $("#info").attr("title","Description") // On change les informations de la boite de dialogue

                  if (event.target.attributes[3].nodeValue == "") { // Si il n'y a pas de description, on affiche le message suivant
                    $("#info").empty().append("<p>Pas de description</p>")
                  } else { // Sinon on affiche les informations de l'image qui sont stockés dans des attributs data html
                    $("#info").empty().append("<p>Description : "+event.target.attributes[3].nodeValue+"<br>Propriétaire : "+event.target.attributes[4].nodeValue+"<br>Date : "+event.target.attributes[5].nodeValue+"<br>Titre : "+event.target.attributes[6].nodeValue+"<br></p>")
                    // On s'assure de bien vider la boite de dialogue avant d'affiche quoi que ce soit dedans
                  }
                $("#info").dialog('open'); // On ouvre la boite de dialogue
              });

              $('.ongl2').on("click", function(event) { // Au clique sur les images de l'onglet 2, on affiche une boite de dialogue avec l'image en taille réelle
                $(".ui-dialog-content").dialog("close"); // On ferme les boites de dialogue deja ouvertes
                $("#image").attr("title","Description") // On change les informations de la boite de dialogue
                $("#image").empty().append("<img src='"+event.target.attributes[2].nodeValue+"'>") // On affiche l'image en taille réelle
                // On s'assure de bien vider la boite de dialogue avant d'affiche quoi que ce soit dedans
                $( "#image" ).dialog( "option", "width", 700 ) // On agrandi un peut la taille de la boite de dialogue pour ne pas avoir besoins de scroller pour voir l'image en entier
                $("#image").dialog('open'); // On ouvre la boite de dialogue
              });
            })
          }
        } else {
          $("#noImage").dialog('open'); // Si il n'y a pas d'image dans la reponse à la requete, on affiche un modal pour le dire
        }
      } else { // Si une date a bien été selectionnée
        let dateString = $("#date").datepicker("getDate") // On recupere la date
        let date = new Date(dateString) // On la met dans un objet de type Date()
        $("#tableOnglet-2").empty().append("<thead><tr><th>Image</th><th>Titre</th><th>Description</th><th>Propriétaire</th><th>Date</th></tr></thead><tbody></tbody>") // Entete du tableau de l'onglet 2
        $("#onglet-1").empty(); // On vide l'onglet au cas ou une recherche ai deja ete faite
        if (response.photos.photo.length > 0) { // Si il y a bien une ou des photos dans la reponse de l'API
          for (photo of response.photos.photo) { // On traite chaque photo une par une
            // On fait une nouvelle requete par photo qui permet de recupérer plus de détails sur celle-ci en utilisant son ID
            $.get("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=56097ac8c6cf97b680539ef25f536f32&photo_id="+photo.id+"&format=json&nojsoncallback=?", function (response2) {
              if (new Date(response2.photo.dates.taken).getTime() > date.getTime()) { // Si les images sont plus récentes que la date selectionnée
                // On affiche les images les une à la suite des autres dans l'onglet 1 en stockant les informations dans des attributs data html
                $("#onglet-1").append("<img class='ongl1' data-id="+response2.photo.id+"   src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg' data-desc='"+response2.photo.description._content+"' data-owner='"+response2.photo.owner.username+"' data-heure='"+response2.photo.dates.taken+"' data-name='"+response2.photo.title._content+"'>")
                // On ajoute une ligne de tableau par image avec l'image en taille reduite suivie de ses informations
                $("#tableOnglet-2 tbody").append("<tr><td><img class='ongl2' style='width:100px; height:auto;' src='https://farm"+response2.photo.farm+".staticflickr.com/"+response2.photo.server+"/"+response2.photo.id+"_"+response2.photo.secret+".jpg'></td><td>"+response2.photo.title._content+"</td><td>"+response2.photo.description._content+"</td><td>"+response2.photo.owner.username+"</td><td>"+response2.photo.dates.taken+"</td></tr>")

                $("#tableOnglet-2").DataTable() // On actualise la jQuery UI DataTable à chaque ajout de photos
                $('.ongl1').on("click", function(event) { // Au clique sur les images de l'onglet 1, on affiche une boite de dialogue
                  $(".ui-dialog-content").dialog("close"); // On ferme les boites de dialogue deja ouvertes
                  $("#info").attr("title","Description") // On change les informations de la boite de dialogue

                    if (event.target.attributes[3].nodeValue == "") { // Si il n'y a pas de description, on affiche le message suivant
                      $("#info").empty().append("<p>Pas de description</p>")
                    } else { // Sinon on affiche les informations de l'image qui sont stockés dans des attributs data html
                      $("#info").empty().append("<p>Description : "+event.target.attributes[3].nodeValue+"<br>Propriétaire : "+event.target.attributes[4].nodeValue+"<br>Date : "+event.target.attributes[5].nodeValue+"<br>Titre : "+event.target.attributes[6].nodeValue+"<br></p>")
                      // On s'assure de bien vider la boite de dialogue avant d'affiche quoi que ce soit dedans
                    }
                  $("#info").dialog('open'); // On ouvre la boite de dialogue
                });

                $('.ongl2').on("click", function(event) { // Au clique sur les images de l'onglet 2, on affiche une boite de dialogue avec l'image en taille réelle
                  $(".ui-dialog-content").dialog("close"); // On ferme les boites de dialogue deja ouvertes
                  $("#image").attr("title","Description") // On change les informations de la boite de dialogue
                  $("#image").empty().append("<img src='"+event.target.attributes[2].nodeValue+"'>") // On affiche l'image en taille réelle
                  // On s'assure de bien vider la boite de dialogue avant d'affiche quoi que ce soit dedans
                  $( "#image" ).dialog( "option", "width", 700 ) // On agrandi un peut la taille de la boite de dialogue pour ne pas avoir besoins de scroller pour voir l'image en entier
                  $("#image").dialog('open'); // On ouvre la boite de dialogue
                });
              }
            })
          }
        } else {
          $("#noImage").dialog('open'); // Si il n'y a pas d'image dans la reponse à la requete, on affiche un modal pour le dire
        }
      }
    })
  })


// Fonction qui ferme toutes les boites de dialogue quand on passe d'un onglet à un autre
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
