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
    // private object DOMStrings so strings are not repeated and for more ease
    const DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
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
    const setUpEventListeners = function () {
        const DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    };

    const ctrlAddItem = function () {
        let input, newItem;

        // 1. get the field input data 
        input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. clear the input fields 
            UICtrl.clearFields();

            // 5. calculate and update budget
            updateBudget();
        }
    }

    // public methods 
    return {
        init: function () {
            console.log('Application started');
            setUpEventListeners();
        },
    }

})(budgetController, UIController); // variables passed here will be used as arguements 


controller.init(); // calls the function to initalise the app