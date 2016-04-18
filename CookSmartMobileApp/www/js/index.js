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
        $("#ConnectedToHub").hide();
        $("#ConnectingToHub").show();
        app.setCookButtonProperties('unknown');
        app.drawRefreshButton();
        app.connectToDevice();
        app.onPageLoad();
    },
    
    onPageLoad: function() {
        $(".refresh-button-container").off('click');
        $(".refresh-button-container").on('click', app.updateDeviceStatus);
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
                if (recipes[i].name === name && RecipeValidator.isValid(recipes[i].instructions)) {
                    Util.loadRecipe(recipes[i], function(result){
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
        
        if (status === 0) {
            return "idling";
        }
        
        if (status === 0xFFFF) {
            return unknown;
        }
        
        var statuses = [];
        if ((status & 0b00000001)) {
            statuses.push("adding water");
        }
        if ((status & 0b00000010)) {
            statuses.push("stirring");
        }
        if ((status & 0b00000100)){
            statuses.push("heating");
        }
        if ((status & 0b00001000)) {
            statuses.push("dropping a cartridge");
        }
        
        if (statuses.length === 0) {
            return "unknown";
        }
        
        if (statuses.length === 1) {
            return statuses[0];
        }
        
        if (statuses.length === 2) {
            return statuses[0] + " and " + statuses[1];
        }
        
        var statusMsg = statuses[0];
        for (var i = 1; i < (statuses.length -1); ++i) {
            statusMsg += ", " + statuses[i];
        }
        
        statusMsg += ", and " + statuses[(statuses.length - 1)];
        return statusMsg;
    },
    
    setCookButtonProperties: function(status) {
        switch (status) {
            case "idling":
                $("#startCooking").text("Load Recipe");
                $("#startCooking").off('click');
                $("#startCooking").on('click', app.loadRecipe);
                break;
            case "unknown": 
                $("#startCooking").text("Start/Stop Cooking");
                $("#startCooking").off('click');
                break;
            default:
                $("#startCooking").text("Stop");
                $("#startCooking").off('click');
                $("#startCooking").on('click', app.stopDevice);
                break;   
        }
    }
    
}