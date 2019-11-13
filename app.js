/*Project following the module pattern*/


/************************************************************
 * budget control module, handles the data
 */
let budgetController = (function(){


})();




/************************************************************
 * user interface module, handles the UI functions
 */
let UIController = (function(){
    // some code
})();



/************************************************************
 * controller module, handles the link between the UI and budget controller modules
 * the controller module always tells the other controllers what to do
 */
let controller = (function(budgetCtrl, UICtrl){


})(budgetController, UIController); // variables passed here will be used as arguements 
