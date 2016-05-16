var MapsController = (function () {
    function MapsController() {
        this.refreshTime = 3000; //ms
        this.coordinatesFile = 'coordinates.txt';
        this.commandSetURL = 'https://sarkyb.stud.if.ktu.lt/semestrinis/receiver.php?cmd=';
        this.disableElement($('.control-button-stop'));
        this.initCommands();
    }
    MapsController.prototype.log = function (text) {
        if (!text.length)
            return;
        this.date = new Date();
        var hours = this.date.getHours().toString();
        var minutes = this.date.getMinutes().toString();
        if (minutes.length === 1)
            minutes = "0" + minutes;
        var seconds = this.date.getSeconds().toString();
        if (seconds.length === 1)
            seconds = "0" + seconds;
        var currentTime = "[" + hours + ":" + minutes + ":" + seconds + "] ";
        var $console = $(".console");
        $console.append(currentTime + text + "\n");
        // automatiškai nuvažiuoja į apačią
        $console[0].scrollTop = $console[0].scrollHeight - $console.height();
    };
    MapsController.prototype.initMap = function () {
        this.log("Užkraunamas žemėlapis");
        var startLatLng = { lat: 54.89687210, lng: 23.89242640 };
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: startLatLng,
            zoom: 8
        });
        this.marker = new google.maps.Marker({
            position: startLatLng,
            map: this.map,
            title: 'Dabartinė pozicija'
        });
    };
    MapsController.prototype.start = function () {
        var _this = this;
        if (this.intervalas) {
            this.log("Programa jau veikia");
            return;
        }
        this.log("Programa pradeda darbą");
        this.intervalas = window.setInterval(function () { return _this.refresh(); }, this.refreshTime);
        this.disableElement($('.control-button-start'));
        this.enableElement($('.control-button-stop'));
        this.map.setZoom(20);
    };
    MapsController.prototype.stop = function () {
        if (!this.intervalas) {
            this.log("Programa jau sustabdyta");
            return;
        }
        this.log("Programa sustabdyta");
        window.clearInterval(this.intervalas);
        this.intervalas = null;
        this.map.setZoom(8);
        this.enableElement($('.control-button-start'));
        this.disableElement($('.control-button-stop'));
    };
    MapsController.prototype.disableElement = function (element) {
        if (!element)
            return;
        element.attr('disabled', 'disabled');
    };
    MapsController.prototype.enableElement = function (element) {
        if (!element)
            return;
        element.removeAttr('disabled');
    };
    MapsController.prototype.refresh = function () {
        var _this = this;
        this.log("Siunčiama užklausa į serverį");
        $.ajax({
            url: this.coordinatesFile,
            success: function (data) {
                _this.currentTimestamp = parseInt(data.slice(0, data.indexOf(" ")));
                if (_this.currentTimestamp == _this.previousTimestamp) {
                    _this.log("Naujų koordinačių nėra");
                    return;
                }
                var lat = parseFloat(data.slice(data.indexOf(" ") + 1, data.lastIndexOf(" ")));
                var lng = parseFloat(data.slice(data.lastIndexOf(" ") + 1));
                _this.map.panTo({ lat: lat, lng: lng });
                _this.marker.setPosition({ lat: lat, lng: lng });
                _this.previousTimestamp = _this.currentTimestamp;
                _this.log("Nauja vietos informacija:" + "platuma: " + lat + ", ilguma: " + lng);
            },
            error: function () {
                _this.log("Nepavyko susijungti su serveriu");
            },
            cache: false
        });
    };
    MapsController.prototype.initCommands = function () {
        var _this = this;
        var commandsContainer = $('.commands');
        var commandButtons = commandsContainer.find('.command-button');
        commandButtons.on('click', function (event) {
            var element = event.currentTarget;
            var cmd = $(element).attr('id');
            if (!cmd.trim().length) {
                _this.log("Mygtukas neturi nustatytos komandos");
                return;
            }
            var $btn = $(element).button('loading');
            _this.disableElement(commandButtons);
            setTimeout(function () {
                _this.enableElement(commandButtons);
                $btn.button('reset');
            }, 5000);
            _this.log("Siunčiama komanda vykdymui: " + cmd);
            $.ajax({
                url: _this.commandSetURL + cmd,
                success: function (data) {
                    _this.log("Komanda sėkmingai išsiųsta");
                },
                error: function () {
                    alert("Komandos išsiųsti nepavyko");
                },
                cache: false
            });
        });
    };
    return MapsController;
})();
var mapsController = new MapsController();
