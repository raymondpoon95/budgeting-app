/*Project following the module pattern*/


/************************************************************
 * budget control module, handles the data
 */
const budgetController = (function(){
    const Expenses = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    const calculateTotal = function(type){
        let sum = 0;

        data.allItems[type].forEach(function(current){
            sum += current.value;
        });

        data.totals[type] = sum;
    };

    const data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1,
    };

    return {
        addItem: function (type, description, value) {
            let newItem, ID;

            // creates a new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            // create new item based on inc or exp type
            if (type === 'exp') {
                newItem = new Expenses(ID, description, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }

            // push into our data structure 
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;
        },

        calculateBudget: function(){
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income spent
            if(data.totals.inc > 0)
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalIncome: data.totals.inc,
                totalExpenses: data.totals.exp,
                percentage: data.percentage,
            }
        },

        testing: function() {
            console.log(data)
        }
    }
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
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container:'.container',
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

        displayBudget: function(obj){
            document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
            document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExpenses;

            if(obj.percentage < 0){
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            }
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

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    };

    const updateBudget = function () {
        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        const budget = budgetCtrl.getBudget();

        // 3. display the budget in the UI
        UICtrl.displayBudget(budget);
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

    const ctrlDeleteItem = function(event){
        let itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];
        }
    };

    // public methods 
    return {
        init: function () {
            console.log('Application started');
            UICtrl.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1,
            });
            setUpEventListeners();
        },
    }

})(budgetController, UIController); // variables passed here will be used as arguements 


controller.init(); // calls the function to initalise the app