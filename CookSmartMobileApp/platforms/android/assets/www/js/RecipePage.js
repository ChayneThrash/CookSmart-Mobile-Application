var RecipePage = {
    
    instructionCount: 1,
    
    onPageLoad: function() {
        $(".recipe-buttons-container").on('click', function() {
            $(".modal").show();
        });
        $(".close").on('click', function() {
           $(".modal").hide(); 
        });
        var recipes = JSON.parse(localStorage.getItem('recipes'));
        $(".recipe-row-container").empty();
        if (recipes) {
            for (var i = 0; i < recipes.length; ++i) {
                $(".recipe-row-container").append("<div class='recipe-row'><a class='recipe-name-link'>"
                                                    + recipes[i].name
                                                    + "</a></div>");
            }
        }
    },
    
    addInstructionRow: function() {
        if (RecipePage.instructionRowValid(this.instructionCount)) {
            $(".modal-content").append(
            "<div class='instruction-row' id='instruction-row-" + instructionCount + "'> \
            <input id='time-" + instructionCount + "' placeholder='minutes' type='text' style='width: 25%;'> \
            <select id='heat-" + instructionCount + "' style='width: 20%;'> \
                <option value='' selected disabled>Heat</option> \
                <option value='Off'>Off</option> \
                <option value='Low'>Low</option> \
                <option value='Med-Low'>Med-Low</option> \
                <option value='Med'>Med</option> \
                <option value='Med-High'>Med-High</option> \
                <option value='High'>High</option> \
            </select> \
            <select multiple id='cartridges-" + instructionCount + "' style='width: 35%;'> \
                <option value='' selected disabled>Cartridges</option> \
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
            <select id='water-" + instructionCount + "' style='width: 25%;'> \
                <option value='' selected disabled>Water</option> \
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
            <span>stir:</span><input id='stir-" + instructionCount + "'  type=checkbox>  \
            </div>");
            ++this.instructionCount;
        } else {
            alert("finish current instruction.");
        }
    },
    
    instructionRowValid: function(rowNum) {
        var instruction = this.formatInstructionFromRow(rowNum);
        return RecipeValidator.isValid([instruction]);
    },
    
    formatInstructionFromRow: function(rowNum) {
        var instruction = {};
        instruction['time'] = 60*parseInt($("#time-" + rowNum).val()); //convert to secs. TODO: verify output of parseInt.
        instruction['heat'] = $("#heat-" + rowNum).val();
        //instruction['cartridges'] = $("#cartridges-" + rowNum) TODO: come back to this.
        instruction['cartridges'] = [1,3, 5]; // temp placeholder for testing.
        instruction['stir'] = document.getElementById("stir-" + rowNum).checked;
        instruction['waterAmount'] = 8*parseFloat($("#water-" + rowNum).val()); //conver to ounces. TODO: verify output of parseFloat.
        return instruction;
    }
    
};

RecipePage.onPageLoad();