var MapsController = (function () {
    function MapsController(content) {
        this.refreshTime = 3000; //ms
        this.coordinatesFile = 'coordinates.txt';
        this.commandSetURL = 'http://sarkyb.stud.if.ktu.lt/semestrinis/receiver.php?cmd=';
        this.content = content;
        this.disableElement(content.find('.control-button-stop'));
        this.initCommands();
        this.consoleContainer = content.find('.console-container');
        this.initConsoleAutoScroll();
    }
    MapsController.prototype.initConsoleAutoScroll = function () {
        var _this = this;
        $(document).ready(function () { _this.autoScrollDown = _this.consoleContainer.find('.auto-scroll').is(':checked'); });
        this.consoleContainer.find('.auto-scroll').on('change', function (event) {
            _this.autoScrollDown = $(event.currentTarget).is(':checked');
        });
    };
    MapsController.prototype.log = function (text) {
        if (!text.length)
            return;
        this.date = new Date();
        var currentTime = this.getPrettyDate(this.date);
        var $console = this.consoleContainer.find('.console');
        $console.append(currentTime + text + "\n");
        if (!this.autoScrollDown)
            return;
        // automatiškai nuvažiuoja į apačią
        $console[0].scrollTop = $console[0].scrollHeight - $console.height();
    };
    MapsController.prototype.getPrettyDate = function (date) {
        if (!date)
            return;
        var hours = date.getHours().toString();
        if (hours.length === 1)
            hours = "0" + hours;
        var minutes = date.getMinutes().toString();
        if (minutes.length === 1)
            minutes = "0" + minutes;
        var seconds = date.getSeconds().toString();
        if (seconds.length === 1)
            seconds = "0" + seconds;
        return "[" + hours + ":" + minutes + ":" + seconds + "] ";
    };
    MapsController.prototype.initMap = function () {
        this.log("Užkraunamas žemėlapis");
        var startLatLng = { lat: 54.89687210, lng: 23.89242640 };
        this.map = new google.maps.Map(this.content.find('#map')[0], {
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
        this.disableElement(this.content.find('.control-button-start'));
        this.enableElement(this.content.find('.control-button-stop'));
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
        this.enableElement(this.content.find('.control-button-start'));
        this.disableElement(this.content.find('.control-button-stop'));
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
                var coordinates = _this.parseCoordinates(data);
                _this.currentTimestamp = coordinates.timestamp;
                if (_this.currentTimestamp == _this.previousTimestamp) {
                    _this.log("Naujų koordinačių nėra");
                    return;
                }
                _this.map.panTo({ lat: coordinates.lat, lng: coordinates.lng });
                _this.marker.setPosition({ lat: coordinates.lat, lng: coordinates.lng });
                _this.previousTimestamp = _this.currentTimestamp;
                _this.log("Nauja vietos informacija:" + "platuma: " + coordinates.lat + ", ilguma: " + coordinates.lng);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus === "timeout") {
                    _this.log("Serveris neatsako");
                }
                else {
                    _this.log("Nepavyko susijungti su serveriu");
                }
            },
            cache: false,
            timeout: 3000
        });
    };
    MapsController.prototype.parseCoordinates = function (data) {
        if (!data)
            return;
        var timestamp = parseInt(data.slice(0, data.indexOf(" ")));
        var lat = parseFloat(data.slice(data.indexOf(" ") + 1, data.lastIndexOf(" ")));
        var lng = parseFloat(data.slice(data.lastIndexOf(" ") + 1));
        return {
            timestamp: timestamp,
            lat: lat,
            lng: lng
        };
    };
    MapsController.prototype.initCommands = function () {
        var _this = this;
        var commandButtons = this.content.find('.commands .command-button');
        commandButtons.on('click', function (event) {
            var element = $(event.currentTarget);
            var cmd = element.attr('id');
            if (!cmd) {
                _this.log("Mygtukas neturi nustatytos komandos");
                return;
            }
            var $btn = element.button('loading');
            _this.disableElement(commandButtons);
            setTimeout(function () {
                _this.enableElement(commandButtons);
                $btn.button('reset');
            }, 5000);
            _this.log("Siunčiama komanda vykdymui: " + element.text());
            $.ajax({
                url: _this.commandSetURL + cmd,
                success: function (data) {
                    _this.log("Komanda sėkmingai išsiųsta");
                },
                error: function () {
                    _this.log("Komandos išsiųsti nepavyko");
                },
                cache: false
            });
        });
    };
    return MapsController;
})();
var mapsController = new MapsController($('.maps-content'));
