var app = {
    
    server: 'http://cooksmart.ddns.net:8080',
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
        $(".refresh-button-container").on('click', app.updateDeviceList);
        $("#deviceListItem").on('click', app.onDeviceSelection);
        $("#ConnectedToHub").hide();
        $("#startCooking").on('click', function() { onStartCooking});
        app.connectToDevice();
        app.getRecipes();
    },
    
    connectToDevice: function() {
        if (JSON.parse(localStorage.getItem('user')).deviceId == null) {
            setTimeout(app.connectToDevice, 10000);
        } else {
            $.ajax({
                url: app.server + "/IsDeviceConnected",
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
        $("#device-status-text").text("Device status: unknown");
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
            data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId, deviceParams: "" }),
            success: function(response) {
                if (response.status === "ok") {
                   $("#device-status-text").text("Device status: " + response.deviceStatus);
                   var buttonProperties = {
                       text: (response.deviceStatus === 'idling') ? "Load Recipe" : "Stop",
                       onClick: (response.deviceStatus === 'idling') ? app.openLoadRecipeModal : app.stopDevice
                   };
                   $("#startCooking").text(buttonProperties.text);
                   $("#startCooking").on('click', buttonProperties.onClick);
               } else {
                    // handle error response.
               }
            }
        });
    },
    
    getRecipes: function() {
        $.ajax({
            url: app.server + '/GetRecipes',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId, deviceParams: "" }),
            success: function(response) {
                if (response.status === "ok") {
                    localStorage.removeItem('recipes');
                    $("#recipeSelect").empty();
                    $("#recipeSelect").append('<option value="" selected disabled>Select a recipe</option>'); // need to have a default.
                    var recipes = [];
                    for(var i = 0; i < response.recipes.length; ++i){
                        if (RecipeValidator.isValid(response.recipes[i].instructions)) {
                            var formattedName = response.recipes[i].name + ((response.recipes[i].isDefault) ? " (preset)" : "");
                            $("#recipeSelect").append('<option value="'
                                                      + formattedName
                                                      + '">'
                                                      + formattedName
                                                      + '</option>');
                            recipes.push({ name: formattedName, instructions: response.recipes[i].instructions });
                        }
                   }
                   localStorage.setItem('recipes', JSON.stringify(recipes));
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



