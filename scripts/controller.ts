class MapsController {
    private map;
    private marker;
    private intervalas: number;
    private refreshTime: number = 3000; //ms
    private currentTimestamp: number;
    private previousTimestamp: number;
    private coordinatesFile: string = 'coordinates.txt';
    private commandSetURL: string = 'http://sarkyb.stud.if.ktu.lt/semestrinis/receiver.php?cmd=';
    private date: Date;
    private autoScrollDown: boolean;
    private consoleContainer: JQuery;

    constructor() {
        this.disableElement($('.control-button-stop'));
        this.initCommands();
        this.consoleContainer = $('.console-container');
        this.initConsoleAutoScroll();
    }

    private initConsoleAutoScroll(): void {
        $(document).ready(() => { this.autoScrollDown = this.consoleContainer.find('.auto-scroll').is(':checked'); });
        this.consoleContainer.find('.auto-scroll').on('change', (event) => {
            this.autoScrollDown = $(event.currentTarget).is(':checked');
        });
    }

    private log(text: string): void {
        if (!text.length)
            return;

        this.date = new Date();
        var hours: string = this.date.getHours().toString();
        if (hours.length === 1)
            hours = "0" + hours;
        var minutes: string = this.date.getMinutes().toString();
        if (minutes.length === 1)
            minutes = "0" + minutes;
        var seconds: string = this.date.getSeconds().toString();
        if (seconds.length === 1)
            seconds = "0" + seconds;
        var currentTime: string = "[" + hours + ":" + minutes + ":" + seconds + "] ";
        var $console = $(".console");
        $console.append(currentTime + text + "\n");

        if (!this.autoScrollDown)
            return;
        // automatiškai nuvažiuoja į apačią
        var $console = this.consoleContainer.find('.console');
        $console[0].scrollTop = $console[0].scrollHeight - $console.height();
    }

    public initMap(): void {
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
    }

    public start(): void {
        if (this.intervalas) {
            this.log("Programa jau veikia");
            return;
        }

        this.log("Programa pradeda darbą");
        this.intervalas = window.setInterval(() => this.refresh(), this.refreshTime);
        this.disableElement($('.control-button-start'));
        this.enableElement($('.control-button-stop'));

        this.map.setZoom(20);
    }

    public stop(): void {
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
        this.log("Siunčiama užklausa į serverį");
        $.ajax({
            url: this.coordinatesFile,
            success: (data) => {
                this.currentTimestamp = parseInt(data.slice(0, data.indexOf(" ")));
                if (this.currentTimestamp == this.previousTimestamp) {
                    this.log("Naujų koordinačių nėra");
                    return;
                }
                var lat = parseFloat(data.slice(data.indexOf(" ") + 1, data.lastIndexOf(" ")));
                var lng = parseFloat(data.slice(data.lastIndexOf(" ") + 1));
                this.map.panTo({ lat: lat, lng: lng });
                this.marker.setPosition({ lat: lat, lng: lng });
                this.previousTimestamp = this.currentTimestamp;
                this.log("Nauja vietos informacija:" + "platuma: " + lat + ", ilguma: " + lng);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                if (textStatus === "timeout") {
                    this.log("Serveris neatsako");
                } else {
                    this.log("Nepavyko susijungti su serveriu");
                }
            },
            cache: false,
            timeout: 3000
        });
    }

    private initCommands(): void {
        var commandsContainer = $('.commands');
        var commandButtons = commandsContainer.find('.command-button');
        commandButtons.on('click', (event) => {
            var element = $(event.currentTarget);
            var cmd: string = element.attr('id');
            if (!cmd.trim().length) {
                this.log("Mygtukas neturi nustatytos komandos");
                return;
            }
            var $btn = element.button('loading');
            this.disableElement(commandButtons);
            setTimeout(() => {
                this.enableElement(commandButtons);
                $btn.button('reset');
            }, 5000);
            this.log("Siunčiama komanda vykdymui: " + element.text());
            $.ajax({
                url: this.commandSetURL + cmd,
                success: (data) => {
                    this.log("Komanda sėkmingai išsiųsta");
                },
                error: () => {
                    this.log("Komandos išsiųsti nepavyko");
                },
                cache: false
            });
            
        });
    }
}

var mapsController: MapsController = new MapsController();