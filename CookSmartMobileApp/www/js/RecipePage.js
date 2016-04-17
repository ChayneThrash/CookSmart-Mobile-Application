var RecipePage = {
    
    instructionCount: 1,
    server: 'http://cooksmart.ddns.net:8332',
    editRecipe: false,
    selectedRecipeName: "",
    
    onPageLoad: function() {
        $(".recipe-buttons-container").off('click');
        $(".recipe-buttons-container").on('click', function() {
            $(".modal-body").empty();
            $("newRecipeName").prop('disabled', false);
            $("#newRecipeName").val("");
            RecipePage.instructionCount = 0;
            RecipePage.appendInstructionRow();
            $("#addInstructionButton").prop("disabled", false);
            $("#saveRecipeButton").prop("disabled", false);
            $(".modal").show();
        });
        $(".close").off('click');
        $(".close").on('click', function() {
            RecipePage.editRecipe = false;
            $(".modal").hide(); 
        });
        $("#addInstructionButton").off('click');
        $("#addInstructionButton").on('click', RecipePage.addInstructionRow);
        $("#saveRecipeButton").off('click');
        $("#saveRecipeButton").on('click', RecipePage.saveRecipe);
        var recipes = JSON.parse(localStorage.getItem('recipes'));
        $(".recipe-row-container").empty();
        if (recipes) {
            for (var i = 0; i < recipes.length; ++i) {
                var preset = /^.*\(preset\)$/.test(recipes[i].name);
                $(".recipe-row-container").append("<div id='recipe-row' class='recipe-row' data-recipe-name='" + recipes[i].name + "'><a class='recipe-name-link'>"
                                                    + recipes[i].name
                                                    + "</a>"
                                                    + ((preset) ? "" : "<span class='glyphicon glyphicon-trash recipe-delete'></span></div>"));
            }
            $(".recipe-name-link").off('click');
            $(".recipe-name-link").on('click', function() {
                var name = $(this).parent().attr("data-recipe-name");
                
                RecipePage.editRecipe = true;
                RecipePage.selectedRecipeName = name;
                
                for (var i = 0; i < recipes.length; ++i) {
                    if (recipes[i].name === name && RecipeValidator.isValid(recipes[i])) {
                        $(".modal-body").empty();
                        RecipePage.instructionCount = 0;
                        var isPreset = /^.*\(preset\)$/.test(recipes[i].name);
                        RecipePage.appendRecipe(recipes[i], isPreset);
                        if (isPreset) {
                            $("#addInstructionButton").prop("disabled", true);
                            $("#saveRecipeButton").prop("disabled", true);    
                        } else {
                            $("#addInstructionButton").prop("disabled", false);
                            $("#saveRecipeButton").prop("disabled", false);
                        }
                        $(".modal").show();
                        break;
                    }
                }
            });
            $(".recipe-delete").off('click');
            $(".recipe-delete").on('click', function() {
                var name = $(this).parent().attr("data-recipe-name");
                if (confirm("Are you sure want to delete this recipe?")) {
                    RecipePage.deleteRecipe(name);
                }
            });
        }
    },
    
    appendRecipe: function(recipe, isPreset) {
        $("#newRecipeName").prop('disabled', isPreset);
        $("#newRecipeName").val(recipe.name);
        for(var i = 0; i < recipe.instructions.length; ++i) {
            RecipePage.appendInstructionRow(recipe.instructions[i], isPreset);
        }
    },
    
    appendInstructionRow: function(instruction, isPreset) {
        if (instruction == null) {
            $(".modal-body").append(
            "<div class='instruction-row' id='instruction-row-" + RecipePage.instructionCount + "'> \
            <fieldset>\
            <legend style='color: white';>Instruction Information:</legend> \
            <input id='time-" + RecipePage.instructionCount + "' placeholder='minutes' type='text' style='width: 25%;'> \
            <span>Heat:</span> \
            <select id='heat-" + RecipePage.instructionCount + "' style='width: 20%;'> \
                <option value='' selected disabled>Heat</option> \
                <option value='Off'>Off</option> \
                <option value='Low'>Low</option> \
                <option value='Med-Low'>Med-Low</option> \
                <option value='Med'>Med</option> \
                <option value='Med-High'>Med-High</option> \
                <option value='High'>High</option> \
            </select> \
            <br><br>\
            <span>Cartridges</span> \
            <select multiple id='cartridges-" + RecipePage.instructionCount + "' style='width: 35%;'> \
                <option value='1'>1</option> \
                <option value='2'>2</option> \
                <option value='3'>3</option> \
                <option value='4'>4</option> \
                <option value='5'>5</option> \
                <option value='6'>6</option> \
                <option value='7'>7</option> \
                <option value='8'>8</option> \
                <option value='9'>9</option> \
                <option value='10'>10</option> \
                <option value='11'>11</option> \
                <option value='12'>12</option> \ "
          +"</select> \
            <br><br>\
            <span>Water:</span> \
            <select id='water-" + RecipePage.instructionCount + "' style='width: 25%;'> \
                <option value='0'>None</option> \
                <option value='0.125'>1/8 cup</option> \
                <option value='0.25'>1/4 cup</option> \
                <option value='0.5'>1/2 cup</option> \
                <option value='0.75'>3/4 cup</option> \
                <option value='1'>1 cup</option> \
                <option value='1.5'>1 1/2 cups</option> \
                <option value='2'>2 cups</option> \
                <option value='2.5'>2 1/2 cup</option> \
                <option value='3'>3 cups</option> \
                <option value='3.5'>3 1/2 cups</option> \
                <option value='4'>4 cups</option> \
            </select> \
            <span>stir:</span><input id='stir-" + RecipePage.instructionCount + "'  type=checkbox>  \
            <br><br>\
            </fieldset> \
            </div>");
        } else {
            $(".modal-body").append(
        "<div class='instruction-row' id='instruction-row-" + RecipePage.instructionCount + "'> \
        <fieldset>\
        <legend style='color: white';>Instruction Information:</legend> \
        <input " + ((isPreset) ? "disabled='disabled'" : "") + " id='time-" + RecipePage.instructionCount + "' placeholder='minutes' type='text' value='" + instruction.time/60 + "' style='width: 25%;'> \
        <span>Heat:</span> \
        <select id='heat-" + RecipePage.instructionCount + "' style='width: 20%;'> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='Off'" + ((instruction.heat === "Off") ? " selected" : "") +">Off</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='Low'" + ((instruction.heat === "Low") ? " selected" : "") +">Low</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='Med-Low'" + ((instruction.heat === "Med-Low") ? " selected" : "") +">Med-Low</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='Med'" + ((instruction.heat === "Med") ? " selected" : "") +">Med</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='Med-High'" + ((instruction.heat === "Med-High") ? " selected" : "") +">Med-High</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='High'" + ((instruction.heat === "High") ? " selected" : "") +">High</option> \
        </select> \
        <br><br>\
        <span>Cartridges</span> \
        <select multiple id='cartridges-" + RecipePage.instructionCount + "' style='width: 35%;'> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='1'" + (($.inArray(1, instruction.cartridges) !== -1) ? " selected" : "") +">1</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='2'" + (($.inArray(2, instruction.cartridges) !== -1) ? " selected" : "") +">2</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='3'" + (($.inArray(3, instruction.cartridges) !== -1) ? " selected" : "") +">3</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='4'" + (($.inArray(4, instruction.cartridges) !== -1) ? " selected" : "") +">4</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='5'" + (($.inArray(5, instruction.cartridges) !== -1) ? " selected" : "") +">5</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='6'" + (($.inArray(6, instruction.cartridges) !== -1) ? " selected" : "") +">6</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='7'" + (($.inArray(7, instruction.cartridges) !== -1) ? " selected" : "") +">7</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='8'" + (($.inArray(8, instruction.cartridges) !== -1) ? " selected" : "") +">8</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='9'" + (($.inArray(9, instruction.cartridges) !== -1) ? " selected" : "") +">9</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='10'" + (($.inArray(10, instruction.cartridges) !== -1) ? " selected" : "") +">10</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='11'" + (($.inArray(11, instruction.cartridges) !== -1) ? " selected" : "") +">11</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='12'" + (($.inArray(12, instruction.cartridges) !== -1) ? " selected" : "") +">12</option> \ "
      +"</select> \
        <br><br>\
        <span>Water:</span> \
        <select id='water-" + RecipePage.instructionCount + "' style='width: 25%;'> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='0'" + (((instruction.waterAmount === 0)) ? " selected" : "") +">None</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='0.125'" + (((instruction.waterAmount === 1)) ? " selected" : "") +">1/8 cup</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='0.25'" + (((instruction.waterAmount === 2)) ? " selected" : "") +">1/4 cup</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='0.5'" + (((instruction.waterAmount === 4)) ? " selected" : "") +">1/2 cup</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='0.75'" + (((instruction.waterAmount === 6)) ? " selected" : "") +">3/4 cup</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='1'" + (((instruction.waterAmount === 8)) ? " selected" : "") +">1 cup</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='1.5'" + (((instruction.waterAmount === 12)) ? " selected" : "") +">1 1/2 cups</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='2'" + (((instruction.waterAmount === 16)) ? " selected" : "") +">2 cups</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='2.5'" + (((instruction.waterAmount === 20)) ? " selected" : "") +">2 1/2 cup</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='3'" + (((instruction.waterAmount === 24)) ? " selected" : "") +">3 cups</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='3.5'" + (((instruction.waterAmount === 28)) ? " selected" : "") +">3 1/2 cups</option> \
            <option " + ((isPreset) ? "disabled='disabled'" : "") + " value='4'" + (((instruction.waterAmount === 32)) ? " selected" : "") +">4 cups</option> \
        </select> \
        <span>stir:</span><input " + ((isPreset) ? "disabled='disabled'" : "") + " " + ((instruction.stir) ? "checked" : "") + " id='stir-" + RecipePage.instructionCount + "'  type=checkbox>  \
        <br><br>\
        </fieldset> \
        </div>");
        }
        ++RecipePage.instructionCount;
    },
    
    addInstructionRow: function() {
        if (RecipePage.instructionCount === 0 || RecipePage.instructionRowValid(RecipePage.instructionCount - 1)) {
            RecipePage.appendInstructionRow();
        } else {
            alert("finish current instruction.");
        }
    },
    
    instructionRowValid: function(rowNum) {
        var instruction = this.formatInstructionFromRow(rowNum);
        return RecipeValidator.isValid([instruction]);
    },
    
    formatInstructionFromRow: function(rowNum) {
        var timeInMin = parseInt($("#time-" + rowNum).val(), 10);
        var waterAmountInCups = parseFloat($("#water-" + rowNum).val());
        var heat = $("#heat-" + rowNum).val();
        var cartridges = $("#cartridges-" + rowNum).val();
        var stir = document.getElementById("stir-" + rowNum).checked;
        
        if (isNaN(timeInMin) || isNaN(waterAmountInCups) || heat == null) {
            return {};
        } else {
            return {
                time: 60*timeInMin,
                waterAmount: 8*waterAmountInCups,
                heat: heat,
                cartridges: (cartridges == null) ? [] : cartridges,
                stir: stir
            };
        }
    },
    
    saveRecipe: function() {
        
        if ($("#newRecipeName").val() == null || $("#newRecipeName").val().length === 0) {
            alert('recipe must have a name');
        } else {
            var instructions = [];
            for (var i = 0; i < RecipePage.instructionCount; ++i) {
                instructions.push(RecipePage.formatInstructionFromRow(i));
            }
            if (RecipeValidator.isValid(instructions)) {
                if (RecipePage.editRecipe) {
                    Util.editRecipe($("#newRecipeName").val(), RecipePage.selectedRecipeName, instructions, function(result){
                        if (result) {
                            Util.getRecipes();
                            RecipePage.onPageLoad();
                            $(".modal").hide();
                        } else {
                            alert("Failed to edit.");
                        }
                    });
                } else {
                    Util.addNewRecipe($("#newRecipeName").val(), instructions, function(result) {
                        if (result) {
                            Util.getRecipes();
                            RecipePage.onPageLoad();
                            $(".modal").hide();
                        } else {
                            alert("Failed to add.");
                        }
                    });
                }
            } else {
                alert("invalid recipe");
            }
        }
        var instructions = [];
        for(var i = 0; i < RecipePage.instructionCount; ++i) {
            instructions.push(RecipePage.formatInstructionFromRow(i));
        }

    },
    
    deleteRecipe: function(recipeName) {
        $.ajax({
            url: Settings.server + '/DeleteRecipe',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ name: recipeName }),
            success: function(response) {
                if (response.status === "ok") {
                    Util.getRecipes();
                } else {
                    alert ("failed to delete recipe.");
                }
            }, error: function (err) {
                alert ("unable to reach server.");
            }
        });
    }
    
};

RecipePage.onPageLoad();