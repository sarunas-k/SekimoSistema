class MapsController {
    private map;
    private marker;
    private intervalas: number;
    private refreshTime: number = 3000; //ms
    private currentTimestamp: number;
    private previousTimestamp: number;
    private coordinatesFile: string = 'coordinates.txt';

    constructor() {
        this.disableElement($('.control-button-stop'));
        this.initCommands();
    }

    public initMap(): void {
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
    }

    public start(): void {
        if (this.intervalas)
            return;
        this.intervalas = window.setInterval(() => this.refresh(), this.refreshTime);
        this.disableElement($('.control-button-start'));
        this.enableElement($('.control-button-stop'));
        $('#busena').show();

        this.map.setZoom(20);
    }

    public stop(): void {
        if (!this.intervalas)
            return;
        
        window.clearInterval(this.intervalas);
        this.intervalas = null;
        this.map.setZoom(8);
        $('#busena').hide();
        this.enableElement($('.control-button-start'));
        this.disableElement($('.control-button-stop'));
    }

    private disableElement(element): void {
        if (!element)
            return;
        element.attr('disabled', 'disabled');
    }

    private enableElement(element): void {
        if (!element)
            return;
        element.removeAttr('disabled');
    }

    public refresh(): void {
        $.ajax({
            url: this.coordinatesFile,
            success: (data) => {
                this.currentTimestamp = parseInt(data.slice(0, data.indexOf(" ")));
                if (this.currentTimestamp == this.previousTimestamp)
                    return;
                var lat = parseFloat(data.slice(data.indexOf(" ") + 1, data.lastIndexOf(" ")));
                var lng = parseFloat(data.slice(data.lastIndexOf(" ") + 1));
                this.map.panTo({ lat: lat, lng: lng });
                this.marker.setPosition({ lat: lat, lng: lng });
                this.previousTimestamp = this.currentTimestamp;
            },
            cache: false
        });
    }

    private initCommands(): void {
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
    }
}

var mapsController: MapsController = new MapsController();