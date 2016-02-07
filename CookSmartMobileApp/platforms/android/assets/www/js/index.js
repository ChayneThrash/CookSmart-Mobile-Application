var app = {
    serverIp: null,
    serverPort: 8080,
    
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        $("#ConnectedToHub").hide();
        var hubInit = new HubInitializer( function(ip)  { app.onHubInitialization(ip); });
        hubInit.InitializeHub("");        
    },
    
    onHubInitialization: function(ip) {
        $('#ConnectingToHub').hide();
        $('#ConnectedToHub').show();
        this.serverIp = ip;
        
        $.getJSON('http://' + this.serverIp + ':' + this.serverPort + '/GetCookerList', function(deviceIds) {
            $("#DeviceList").empty();
            $.each(deviceIds.docs, function(i, item) {
                $("#DeviceList").append('<li>' + item._id + '</li>');   
            });
        });
    }
};



