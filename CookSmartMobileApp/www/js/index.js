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
        app.drawButtons();
        app.drawMenuButton();
        $(".list-header").on('click', function() { $(".device-list-container").toggle(); });
        
        $("#refreshButton").on('click', app.updateDeviceStatus);
        $("#ConnectedToHub").hide();
        var hubInit = new HubInitializer( function(ip)  { app.onHubInitialization(ip); });
        hubInit.InitializeHub("");        
    },
    
    onHubInitialization: function(ip) {
        $('#ConnectingToHub').hide();
        $('#ConnectedToHub').show();
        this.serverIp = ip;
        app.updateDeviceStatus();
    },
    
    updateDeviceStatus: function() {
        if (app.serverIp === null) {
            alert('Please wait until hub has been connected.');
        }
        else{
            $.getJSON('http://' + app.serverIp + ':' + app.serverPort + '/GetDeviceStatus', function(response) {
                if (response.status === "ok") {
                    $("#device-status-text").text("Device status: " + response.deviceStatus);
                    var buttonProperties = {
                        text: (response.deviceStatus === 'idle') ? "Load Recipe" : "Stop",
                        onClick: (response.deviceStatus === 'idle') ? app.openLoadRecipeModal : app.stopDevice
                    };
                    $("#device-button").text(buttonProperties.text);
                    $("#device-button").on('click', buttonProperties.onClick);
                } else {
                    // handle error response.
                }
            }); // TODO: add a failure callback. 
        }
    },
    
    drawButtons: function() {
        var buttonDiameter = $(".refresh-button-container").width();
        $(".refresh-button-container").css({height: buttonDiameter + "px"});
        $(".device-button-container").css({height: buttonDiameter + "px"});
    },
    
    drawMenuButton: function() {
        var buttonDiameter = $(".menu-selection-container").width();
        $(".menu-selection-container").css({ height: buttonDiameter + "px" });
    },
    
    openLoadRecipeModal() {
        // do this
    },
    
    stopDevice() {
        // do this as well
    }
    
};



