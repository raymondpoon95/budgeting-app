/*Project following the module pattern*/


/************************************************************
 * budget control module, handles the data
 */
let budgetController = (function(){
    let x = 23;
    let add = function(a){          // this cannot but accessed publicly e.g from console
        return x + a;
    }

    return {
        publicTest: function(b){    // returns an object 
            return add(b);
        }
    }

})();




/************************************************************
 * user interface module, handles the UI functions
 */
let UIController = (function(){
    // some code
})();


/************************************************************
 * controller module, handles the link between the UI and budget controller modules
 */
let controller = (function(budgetCtrl, UICtrl){

    let z = budgetCtrl.publicTest(10);

    return {
        anotherPublicTest: function(){
            return z;
        }
    }

})(budgetController, UIController); // variables passed here will be used as arguements 
