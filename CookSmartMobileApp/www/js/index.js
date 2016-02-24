var app = {
    serverIp: null,
    serverPort: 8081,
    
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        //if (!sessionStorage.user) {
        //     window.location.href = "login.html";   
        //}
        document.addEventListener("backbutton", function() { navigator.app.exitApp(); }, false);
        app.drawRefreshButton();
        app.drawMenuButton();
        $(".list-header").on('click', function() { $(".device-list-container").toggle(); });
        
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
                    $("#DeviceList").append('<a class="device-item" href="#" id="deviceListItem">' + item._id + '</a>');
                });
            });    
        }
    },
    
    onDeviceSelection: function() {
        window.sessionStorage.deviceId = $(this).innerHtml;
        window.href = 'app.html';
    },
    
    drawRefreshButton: function() {
        var buttonDiameter = $(".refresh-button-container").width();
        $(".refresh-button-container").css({height: buttonDiameter + "px"});
    },
    
    drawMenuButton: function() {
        var buttonDiameter = $(".menu-selection-container").width();
        $(".menu-selection-container").css({height: buttonDiameter + "px"});
    }
    
};



