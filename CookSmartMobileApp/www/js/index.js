var app = {
    
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
        document.removeEventListener("backbutton", function() { navigator.app.exitApp(); }, false);
        document.addEventListener("backbutton", function() { navigator.app.exitApp(); }, false);
        app.drawRefreshButton();
        app.onPageLoad();
    },
    
    onPageLoad: function() {
        $(".list-header").off('click');
        $(".list-header").on('click', function() { $(".device-list-container").toggle(); });
        $(".refresh-button-container").off('click');
        $(".refresh-button-container").on('click', app.updateDeviceStatus);
        $("#ConnectedToHub").hide();
        $("#startCooking").off('click');
        $("#device-status-text").text("Device status: unknown");
        app.connectToDevice();
        Util.getRecipes();        
    },
    
    connectToDevice: function() {
        if (localStorage.getItem('user') == null || !JSON.parse(localStorage.getItem('user')).hasOwnProperty('deviceId') || JSON.parse(localStorage.getItem('user')).deviceId == null) {
            setTimeout(app.connectToDevice, 10000);
        } else {
            $.ajax({
                url: Settings.server + "/IsDeviceConnected",
                type: "POST",
                data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId }),
                contentType: "application/json; charset=utf-8",
                success: function(response) {
                    if (response.status === "ok") {
                        if (!app.deviceConnected) {
                            app.deviceConnected = true;
                            app.onHubInitialization();   
                        } 
                    } else {
                        app.deviceConnected = false;
                        $('#ConnectingToHub').show();
                        $('#ConnectedToHub').hide();
                        $("#device-status-text").text("Device status: unknown");
                        app.setCookButtonProperties("unknown");
                    }
                    setTimeout(app.connectToDevice, 10000);
                },
                error: function(err) {
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
            url: Settings.server + '/GetDeviceStatus',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId, deviceParams: "" }),
            success: function(response) {
                if (response.status === "ok") {
                    var status = app.decodeStatus(response.deviceStatus);
                    $("#device-status-text").text("Device status: " + status);
                    app.setCookButtonProperties(status);
               } else {
                    app.setCookButtonProperties("unknown");
               }
            },
            error: function(err) {
                app.setCookButtonProperties("unknown");
            }
         });
    },
    
    loadRecipe: function() {
        var recipes = JSON.parse(localStorage.getItem('recipes'));
        
        if (recipes) {
            var name = $("#recipeSelect").val();
            for (var i = 0; i < recipes.length; ++i) {
                if (recipes[i].name === name && ReccipeValidator.isValid(recipes[i])) {
                    Util.loadRecipe(function(result){
                        app.updateDeviceStatus(); 
                    });
                    return;
                }
            }
            alert("no recipe selected");
        } else {
            alert("no recipes")
        }
    },
    
    stopDevice: function() {
        Util.stopDevice(function(result){
            if (!result) {
                alert("failed to stop device");
            }
            app.updateDeviceStatus();
        });
    },
    
    drawRefreshButton: function() {
        var buttonDiameter = $(".refresh-button-container").width();
        $(".refresh-button-container").css({height: buttonDiameter + "px"});
    },
    
    decodeStatus: function(status) {
        switch (status) {
            case 0: return "idling";
            case 1: return "stirring";
            case 256: return "heating";
            case 257: return "heating and stirring";
            default: return "unknown";
        }
    },
    
    setCookButtonProperties: function(status) {
        var buttonProperties = {};
        switch (status) {
            case "idling":
                $("#startCooking").text("Load Recipe");
                $("#startCooking").off('click');
                $("#startCooking").on('click', app.loadRecipe);
                break;
            case "unknown": 
                $("#startCooking").text("Start/Stop Cooking");
                $("#startCooking").off('click');
                $("#startCooking").on('click', buttonProperties.onClick);
                break;
            default:
                $("#startCooking").text("Stop");
                $("#startCooking").off('click');
                $("#startCooking").on('click', app.stopDevice);
                break;   
        }
    }
    
}