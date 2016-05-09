var MapsController = (function () {
    function MapsController() {
        this.refreshTime = 3000; //ms
        this.coordinatesFile = 'coordinates.txt';
        this.disableElement($('.control-button-stop'));
        this.initCommands();
    }
    MapsController.prototype.initMap = function () {
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
        if (this.intervalas)
            return;
        this.intervalas = window.setInterval(function () { return _this.refresh(); }, this.refreshTime);
        this.disableElement($('.control-button-start'));
        this.enableElement($('.control-button-stop'));
        $('#busena').show();
        this.map.setZoom(20);
    };
    MapsController.prototype.stop = function () {
        if (!this.intervalas)
            return;
        window.clearInterval(this.intervalas);
        this.intervalas = null;
        this.map.setZoom(8);
        $('#busena').hide();
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
        $.ajax({
            url: this.coordinatesFile,
            success: function (data) {
                _this.currentTimestamp = parseInt(data.slice(0, data.indexOf(" ")));
                if (_this.currentTimestamp == _this.previousTimestamp)
                    return;
                var lat = parseFloat(data.slice(data.indexOf(" ") + 1, data.lastIndexOf(" ")));
                var lng = parseFloat(data.slice(data.lastIndexOf(" ") + 1));
                _this.map.panTo({ lat: lat, lng: lng });
                _this.marker.setPosition({ lat: lat, lng: lng });
                _this.previousTimestamp = _this.currentTimestamp;
            },
            cache: false
        });
    };
    MapsController.prototype.initCommands = function () {
        var commandsContainer = $('.commands');
        var commandButtons = commandsContainer.find('.command-button');
        commandButtons.on('click', function () {
            var $btn = $(this).button('loading');
            this.disableElement(commandsContainer.find('.command-button'));
            setTimeout(function () {
                this.enableElement(commandsContainer.find('.command-button'));
                $btn.button('reset');
            }, 5000);
        });
    };
    return MapsController;
})();
var mapsController = new MapsController();
