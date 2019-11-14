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

    // public methods 
    // grab input
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // will either be a string of type inc or exp
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
            };
        },

        getDOMStrings: function(){ // exposing the DOMStrings to the public 
            return DOMStrings;
        },

        addListItem: function (obj, type) {
            let html, newHTML, element;

            // create HTML string with some placeholder tags

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMStrings.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // replace the palceholder text with some actual data

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            // insert HTML into the DOM

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },

        clearFields: function () {
            let fields, fieldsArray;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, array) {
                current.value = '';
            });

            fieldsArray[0].focus();
        },
        
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