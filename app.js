/*Project following the module pattern*/


/************************************************************
 * budget control module, handles the data
 */
const budgetController = (function(){


})();




/************************************************************
 * user interface module, handles the UI functions
 */
const UIController = (function(){
    // private object DOMStrings so strings are not repeated and for ease
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
    }

    // grab input
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMStrings.inputType).value, // will either be type inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
            };
        },
        getDOMStrings: function(){ // exposing the DOMStrings to the public 
            return DOMStrings;
        }  
    }
})();



/************************************************************
 * controller module, handles the link between the UI and budget controller modules
 * the controller module always tells the other controllers what to do
 */
const controller = (function(budgetCtrl, UICtrl){


})(budgetController, UIController); // variables passed here will be used as arguements 
