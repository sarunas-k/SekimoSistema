var content = $('<div class="maps-content" style="height: 100%"><div id="map"></div><div class="page-right"><div class="console-container"><textarea class="form-control console" rows="15" readonly></textarea><label for="auto-scroll">Atnaujinus nuvesti žemyn</label><input type="checkbox" class="auto-scroll" name="auto-scroll" checked /></div><div class="control-buttons"><button type="button" class="btn btn-success btn-lg control-button-start full-width" onclick="controller.start()">Pradėti</button><button type="button" class="btn btn-danger btn-lg control-button-stop full-width" onclick="controller.stop()">Stabdyti</button></div><div class="commands"><h4>Valdymo komandos:</h4><button type="button" data-loading-text="Vykdoma..." class="btn btn-primary command-button full-width" autocomplete="off">Įrenginio sustabdymas</button><br><button type="button" id="CMD02" data-loading-text="Vykdoma..." class="btn btn-primary command-button full-width" autocomplete="off">Žalias LED</button><br></div><div class="admin-user-controls"> <a href="users_list.php" class="btn btn-primary full-width" target="_blank">Vartotojų sąrašas</a></div><a href="maps.php?action=logout" class="btn btn-primary full-width" style="margin-top: 50px;">Atsijungti</a></div></div><script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCAqKVybk5Y9IhI9m7DrUONCYD2T5uKpP4&callback=controller.initMap" async defer></script>');
var controller = new MapsController(content);
QUnit.test( "Paleidimo mygtukai", function( assert ) {
  assert.ok( content.find('.control-button-start').attr('disabled') == undefined, "Iš pradžių mygtukas \"Pradėti\" leidžiamas" );
  assert.ok( content.find('.control-button-stop').attr('disabled') == 'disabled', "Iš pradžių mygtukas \"Stabdyti\" neleidžiamas" );
});

QUnit.test( "Komandų valdymo mygtukai", function( assert ) {
  content.find('.command-button').first().trigger('click');
  var console = content.find('.console');
  assert.ok( console.text().indexOf("Mygtukas neturi nustatytos komandos") >= 0, "Komandų mygtukai: pranešimas dėl mygtukui nepriskirtos komandos veikia" );
  
  console.text("");
  
  content.find('.command-button').last().trigger('click');
  assert.ok( console.text().indexOf("Siunčiama komanda vykdymui: Žalias LED") >= 0, "Komandų mygtukai: pranešimas apie komandos išsiuntimą veikia" );
  
  var commandButtons = content.find('.commands .command-button');
  assert.ok( commandButtons.first().attr('disabled') == 'disabled' && commandButtons.last().attr('disabled') == 'disabled', "Komandų mygtukai: mygtukai tampa trumpam neleidžiami po betkurios komandos paspaudimo" );
  
  setTimeout(function() {
	 assert.ok( commandButtons.first().attr('disabled') == undefined && commandButtons.last().attr('disabled') == undefined, "Komandų mygtukai: mygtukai vėl pasidaro leidžiami po 5sek." ); 
  }, 5001);
});

QUnit.test( "Parsiųstų duomenų skaitymas parseCoordinates funkcija", function( assert ) {
  var fakeCoordinatesData = "1464021163 54.907742 23.912878";
  var coordinatesObject = controller.parseCoordinates(fakeCoordinatesData);
  assert.ok( coordinatesObject.timestamp === 1464021163, "Laikas perskaitytas teisingai" );
  assert.ok( coordinatesObject.lat === 54.907742, "Platumos koordinatė perskaityta teisingai" );
  assert.ok( coordinatesObject.lng === 23.912878, "Ilgumos koordinatė perskaityta teisingai" );
  
  coordinatesObject = controller.parseCoordinates(null);
  assert.ok( coordinatesObject === undefined, "Jeigu nepaduoti duomenys, grąžina undefined" );
  
});

