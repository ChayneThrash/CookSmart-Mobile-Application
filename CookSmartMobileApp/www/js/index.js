var app = {
    
    server: 'http://192.168.1.33:8080',
    deviceConnected: false,
    
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    
    onDeviceReady: function() {
        if (window.localStorage.getItem('user') == null) {
             window.location.href = "login.html";
        }
        document.addEventListener("backbutton", function() { navigator.app.exitApp(); }, false);
        app.drawRefreshButton();
        $(".list-header").on('click', function() { $(".device-list-container").toggle(); });
        $("#recipe").on('click',function() { window.location.href="recipe.html"});
        $(".refresh-button-container").on('click', app.updateDeviceList);
        $("#deviceListItem").on('click', app.onDeviceSelection);
        $("#ConnectedToHub").hide();
        $("#startCooking").on('click', function() { onStartCooking});
        app.connectToDevice();
    },
    
    connectToDevice: function() {
        if (JSON.parse(localStorage.getItem('user')).deviceId == null) {
            setTimeout(app.connectToDevice, 10000);
        } else {
            $.ajax({
                url: "http://192.168.1.35:8080/IsDeviceConnected",
                type: "POST",
                data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId }),
                contentType: "application/json; charset=utf-8",
                success: function(response) {
                    if (response.status === "ok") {
                        if (!app.deviceConnected) {
                            app.onHubInitialization();   
                        } 
                    } else {
                        app.deviceConnected = false;
                    }
                    setTimeout(app.connectToDevice, 10000);
                }
            }); 
        }
    },
    
    onHubInitialization: function() {
        $('#ConnectingToHub').hide();
        $('#ConnectedToHub').show();
        app.updateDeviceStatus();
    },
    
    isLoggedIn: function() {
        $.ajax({
            url: "http://192.168.1.33:8080/IsLoggedIn",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function(response) {
               alert(response);
            }
        });
    },
    
    updateDeviceStatus: function() {
        $.ajax({
            url: app.server + '/GetDeviceStatus',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function(response) {
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
            }
        });
    },
    
    drawRefreshButton: function() {
        var buttonDiameter = $(".refresh-button-container").width();
        $(".refresh-button-container").css({height: buttonDiameter + "px"});
    },
    
    /*
    drawMenuButton: function() {
        var buttonDiameter = $(".menu-selection-container").width();
        $(".menu-selection-container").css({height: buttonDiameter + "px"});
    },
    */
    onStartCooking: function() {
        alert('Cooking has Now Begun.');
    }
};



