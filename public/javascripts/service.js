var updateFormService = function($rootScope){
    var updateForm = {};

    updateForm.item = {};

    updateForm.getUpdatedItem = function(item){
        this.item = item;
        this.broadcastItem();
    };

    updateForm.broadcastItem = function(){
        $rootScope.$broadcast('handleUpdate');
        $rootScope.$on("handleUpdate", function(){
          console.log("handle");
        });
    };

    return updateForm;
}
