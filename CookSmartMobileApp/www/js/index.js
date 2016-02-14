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
        if (!sessionStorage.user) {
             window.location.href = "login.html";   
        }
        
        $("#refreshButton").on('click', app.updateDeviceList);
        $("#deviceListItem").on('click', app.onDeviceSelection);
        $("#ConnectedToHub").hide();
        var hubInit = new HubInitializer( function(ip)  { app.onHubInitialization(ip); });
        hubInit.InitializeHub("");        
    },
    
    onHubInitialization: function(ip) {
        $('#ConnectingToHub').hide();
        $('#ConnectedToHub').show();
        this.serverIp = ip;
        app.updateDeviceList();
    },
    
    updateDeviceList: function() {
        if (app.serverIp === null) {
            alert('Please wait until hub has been connected.');
        }
        else{
            $.getJSON('http://' + app.serverIp + ':' + app.serverPort + '/GetCookerList', function(deviceIds) {
                $("#DeviceList").empty();
                $.each(deviceIds.docs, function(i, item) {
                    $("#DeviceList").append('<a class="list-group-item" href="#" id="deviceListItem">' + item._id + '</a>');
                });
            });    
        }
    },
    
    onDeviceSelection: function() {
        window.sessionStorage.deviceId = $(this).innerHtml;
        window.href = 'app.html';
    }
    
};



