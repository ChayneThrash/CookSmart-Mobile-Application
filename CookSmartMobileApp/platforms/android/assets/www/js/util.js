var Util = {
    getRecipes: function() {
        $.ajax({
            url: Settings.server + '/GetRecipes',
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
                   RecipePage.onPageLoad();
               } else {
                    // handle error response.
               }
            }
        });
    },
    
    addNewRecipe: function(recipe) {
        $.ajax({
            url:  Settings.server + 'CreateRecipe',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(recipe),
            success: function(response) {
                this.getRecipes();
            }
        });
    },
    
    stopDevice: function(next) {
        $.ajax({
            url: Settings.server + '/StopDevice',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId, deviceParams: "" }),
            success: function(response) {
                next(response.status === "ok");
            }
        });
    },
    
    loadRecipe: function(recipe, next) {
        if (RecipeValidator.isValid(recipe.instructions)) {
            $.ajax({
                url: Settings.server + '/LoadRecipe',
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId, deviceParams: { recipe: recipe.instructions } }),
                success: function(response) {
                    next(response.status === "ok");
                }
            });
        } else {
            next(false);
        }
    },
    
    setWifiCredentials: function(ssid, password, next) {
        $.ajax({
            url: Settings.server + '/SetWifiCredentials',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ deviceId: JSON.parse(localStorage.getItem('user')).deviceId, deviceParams: { ssid: ssid, password: password } }),
            success: function(response) {
                next(response);
            }
        });
    },
    
    addNewRecipe: function(name, instructions, next) {
        $.ajax({
            url: Settings.server + '/CreateRecipe',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ name: name, instructions: instructions }),
            success: function(response) {
                next(response.status === "ok");
            }
        });
    },
    
    editRecipe: function(newName, name, instructions, next) {
        $.ajax({
            url: Settings.server + '/EditRecipe',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ newName: newName, name: name, instructions: instructions }),
            success: function(response) {
                next(response.status === "ok");
            }
        });
    }
    
};