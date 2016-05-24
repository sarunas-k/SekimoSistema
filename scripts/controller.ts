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
    private content: JQuery;

    constructor(content: JQuery) {
        this.content = content;
        this.disableElement(content.find('.control-button-stop'));
        this.initCommands();
        this.consoleContainer = content.find('.console-container');
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
        var currentTime = this.getPrettyDate(this.date);
        var $console = this.consoleContainer.find('.console');
        $console.append(currentTime + text + "\n");

        if (!this.autoScrollDown)
            return;
        // automatiškai nuvažiuoja į apačią
        $console[0].scrollTop = $console[0].scrollHeight - $console.height();
    }

    public getPrettyDate(date: Date): string {
        if (!date)
            return;

        var hours: string = date.getHours().toString();
        if (hours.length === 1)
            hours = "0" + hours;
        var minutes: string = date.getMinutes().toString();
        if (minutes.length === 1)
            minutes = "0" + minutes;
        var seconds: string = date.getSeconds().toString();
        if (seconds.length === 1)
            seconds = "0" + seconds;
        return "[" + hours + ":" + minutes + ":" + seconds + "] ";
    }

    public initMap(): void {
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
    }

    public start(): void {
        if (this.intervalas) {
            this.log("Programa jau veikia");
            return;
        }

        this.log("Programa pradeda darbą");
        this.intervalas = window.setInterval(() => this.refresh(), this.refreshTime);
        this.disableElement(this.content.find('.control-button-start'));
        this.enableElement(this.content.find('.control-button-stop'));

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
        this.enableElement(this.content.find('.control-button-start'));
        this.disableElement(this.content.find('.control-button-stop'));
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
                var coordinates: ICoordinates = this.parseCoordinates(data);
                this.currentTimestamp = coordinates.timestamp;
                if (this.currentTimestamp == this.previousTimestamp) {
                    this.log("Naujų koordinačių nėra");
                    return;
                }
                this.map.panTo({ lat: coordinates.lat, lng: coordinates.lng });
                this.marker.setPosition({ lat: coordinates.lat, lng: coordinates.lng });
                this.previousTimestamp = this.currentTimestamp;
                this.log("Nauja vietos informacija:" + "platuma: " + coordinates.lat + ", ilguma: " + coordinates.lng);
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

    public parseCoordinates(data: string): ICoordinates {
        if (!data)
            return;

        var timestamp: number = parseInt(data.slice(0, data.indexOf(" ")));
        var lat = parseFloat(data.slice(data.indexOf(" ") + 1, data.lastIndexOf(" ")));
        var lng = parseFloat(data.slice(data.lastIndexOf(" ") + 1));

        return {
            timestamp: timestamp,
            lat: lat,
            lng: lng
        };
    }

    

    private initCommands(): void {
        var commandButtons = this.content.find('.commands .command-button');
        commandButtons.on('click', (event) => {
            var element = $(event.currentTarget);
            var cmd: string = element.attr('id');
            if (!cmd) {
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
interface ICoordinates {
    lat: number;
    lng: number;
    timestamp: number;
}
var mapsController: MapsController = new MapsController($('.maps-content'));