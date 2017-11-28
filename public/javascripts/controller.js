//application controller
var todoCtrl = function($scope, $http){
  loadEvents();
  $scope.checkAll = false;
  $scope.manageOff = true;
  $scope.createOff = false;
  $scope.updateOff = false;
  $scope.orderList = [
    {
      "value": "id",
      "name": "Oldest"
    },
    {
      "value": "-id",
      "name": "Latest"
    },
    {
      "value": "title",
      "name": "Title"
    },
    {
      "value": "priority",
      "name": "Low Priority"
    },
    {
      "value": "-priority",
      "name": "High Priority"
    },
    {
      "value": "completed",
      "name": "Uncompleted"
    }
  ];

  $scope.main = {
    selectedOrder:$scope.orderList[0]
  };

  $scope.refreshEvents = function(){
    loadEvents();
  };

  $scope.switchCondition = function(val){
    switch (val) {
      case "new":
        $scope.createOff = !$scope.createOff;
        break;
      case "update":
        $scope.updateOff = !$scope.updateOff;
        break;
      case "manage":
        $scope.manageOff = !$scope.manageOff;
        if($scope.manageOff){
          $scope.checkAll = false;
          $scope.events.forEach(function(item){
            item.checked = false;
          });
        }
        break;
      case "all":{
        $scope.checkAll = !$scope.checkAll;
        $scope.events.forEach(function(item){
          item.checked = $scope.checkAll;
        });
        break;
      };
      default:{
        var data = {
          "cols": ["completed"],
          "vals": [!val.completed],
          "id": val.id
        }
        $http.put("./events/update_event", data).then(
          function(response){
            val.completed = !val.completed;
          },
          function(response){
            alert("Failed to check the task. Please try again later.");
          }
        );
        break;
      }
    };
  };

  function loadEvents(){
    $http.get("/events/query_events").then(function(response) {
       $scope.events = response.data;
       console.log($scope.events);
    });
  };
};
todoCtrl.$inject = ["$scope", "$http"];


//sub controller for creating event
var newTodoCtrl = function($scope, $http){
  $scope.newTitle = "";
  $scope.newDetail = "";
  $scope.newPriority = "1";

  $scope.createEvent = function(){
    var events = {
      "title": $scope.newTitle,
      "detail": $scope.newDetail,
      "priority": parseInt($scope.newPriority)
    };
    $http.post("./events/create_event", events).then(
      function(response){
        console.log(response.data.insertId);
        $scope.events.push({
          "id": response.data.insertId,
          "title": events.title,
          "detail": events.detail,
          "completed": false,
          "priority": events.priority,
          "checked": false
        });
      },
      function(response){
        console.log("failed");
      }
    );
    $scope.switchCondition('new');
  };
}
newTodoCtrl.$inject = ["$scope", "$http"];


//sub controller for managing event
var manageTodoCtrl = function($scope, $http, updateFormService){
  $scope.checkEvent = function(item){
    if(!$scope.manageOff){
      item.checked = !item.checked;
    }
  };

  $scope.updateEventForm = function(item){
    updateFormService.getUpdatedItem(item);
    $scope.switchCondition('update');
  };

  $scope.deleteEvent = function(item){
    if (confirm("Are you sure you want to delete?")) {
      $http({
        url: "./events/delete_events",
        method: 'DELETE',
        data: {
            "eventId": item.id
        },
        headers: {
          "Content-Type": "application/json;charset=utf-8"
        }
      }).then(
        function(response){
          $scope.events.splice($scope.events.indexOf(item), 1);
        },
        function(response){
          alert("Failed to delete task. Please try again later.");
        }
      );
    };
  };

  $scope.deleteEvents = function(){
    var data = getSelectedEvent();
    if(data.length > 0){
      if (confirm("Are you sure you want to delete?")) {
        $http({
          url: "./events/delete_events",
          method: 'DELETE',
          data: {
              "eventId": data
          },
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          }
        }).then(
          function(response){
            $scope.events = $scope.events.filter(function(item){
              return !item.checked;
            });
          },
          function(response){
            alert("Failed to delete tasks. Please try again later.");
          }
        );
      };
    }
  };

  function getSelectedEvent(){
    var data = [];
    $scope.events.forEach(function(item){
      if(item.checked){
        data.push(parseInt(item.id));
      };
    });
    return data;
  };
}
manageTodoCtrl.$inject = ["$scope", "$http", "updateFormService"];

var updateTodoCtrl = function($scope, $http, updateFormService){
  $scope.$on("handleUpdate", function(){
    $scope.updateTitle = updateFormService.item.title;
    $scope.updateDetail = updateFormService.item.detail;
    $scope.updatePriority = ""+updateFormService.item.priority;
    $scope.updateCompleted = updateFormService.item.completed;
    console.log(updateFormService.item);
  });

  $scope.updateEvent = function(item){
    var data = {
      "cols": ["title", "detail", "priority", "completed"],
      "vals": [$scope.updateTitle, $scope.updateDetail, parseInt($scope.updatePriority), $scope.updateCompleted],
      "id": updateFormService.item.id
    }

    $http.put("./events/update_event", data).then(
      function(response){
        $scope.refreshEvents();
      },
      function(response){
        alert("Failed to check the task. Please try again later.");
      }
    );

    $scope.switchCondition('update');
  };
}
updateTodoCtrl.$inject = ["$scope", "$http", "updateFormService"];
