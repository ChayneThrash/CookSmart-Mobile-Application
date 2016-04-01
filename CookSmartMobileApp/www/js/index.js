var app = {
    
    server: 'http://192.168.1.33:8080',
    
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
        document.addEventListener("backbutton", function() { navigator.app.exitApp(); }, false);
        app.drawRefreshButton();
        $(".list-header").on('click', function() { $(".device-list-container").toggle(); });
        $("#recipe").on('click',function() { window.location.href="recipe.html"});
        $(".refresh-button-container").on('click', app.updateDeviceList);
        $("#deviceListItem").on('click', app.onDeviceSelection);
        $("#ConnectedToHub").hide();
        $("#startCooking").on('click', function() { onStartCooking});
    },
    
    onHubInitialization: function(ip) {
        $('#ConnectingToHub').hide();
        $('#ConnectedToHub').show();
        this.server = ip;
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



