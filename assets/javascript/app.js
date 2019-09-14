/**
 * @author Caren Briones <carenpbriones@gmail.com>
 * Train Scheduler functionalities
 * - User can add a train's schedule, which will persist to a firebase database and be displayed in a table
 * - User can update a train's schedule, which will persist to the database
 * - User can delete a train's schedule, which will delete it in the database
 * 
 * September 13, 2019
 */
var firebaseConfig = {
    apiKey: "AIzaSyAEbxh1sjsSiKcznLmvpQWl-CxXXVRkaBc",
    authDomain: "cb-cdc-activities123.firebaseapp.com",
    databaseURL: "https://cb-cdc-activities123.firebaseio.com",
    projectId: "cb-cdc-activities123",
    storageBucket: "",
    messagingSenderId: "1015121208714",
    appId: "1:1015121208714:web:dbe31ef0d1a57dc1531473"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();

// Submits user's input as a train in the table
$("#submit-button").on("click", function (event) {
    event.preventDefault();

    // Push values to database
    database.ref().push({
        trainName: $("#train-name").val(),
        destination: $("#destination").val(),
        firstTrainTime: $("#first-train-time").val(),
        frequency: $("#frequency").val()
    })
})

database.ref().on("child_added", function(data){
    // console.log(data)

    // Retrieved from train-example.html
    var firstTrainMoment = moment(data.val().firstTrainTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTrainMoment), "minutes");
    var tRemainder = diffTime % data.val().frequency;
    var minutesAway = data.val().frequency - tRemainder;

    // Adds all values as a table row on page
    var tableRow = $("<tr>").attr("data-key", data.key);
    tableRow.append($("<button>").addClass("btn btn-outline-primary delete").attr("data-key", data.key).text("X"));
    tableRow.append( $("<td>").html("<span class='train-info' data-key='trainName'>" + data.val().trainName + "</span>"));
    tableRow.append( $("<td>").html("<span class='train-info' data-key='destination'>" + (data.val().destination + "</span>")));
    tableRow.append( $("<td>").html("<span class='train-info' data-key='frequency'>" + data.val().frequency + "</span>"));
    tableRow.append( $("<td>").html("<span>" + moment().add(minutesAway, "minutes").format("HH:mm A") + "</span>"));
    tableRow.append( $("<td>").html("<span>" + minutesAway));

    $("#table-body").append(tableRow);
})

// Deletes row from table and data from firebase
$("#table-body").on("click", ".delete", function(){
    $(this).parent().empty();
    database.ref().child($(this).attr("data-key")).remove();
})

// Allows user to change value of train info
$("#table-body").on("click", ".train-info", function(){
    // Temporarily removes train-info class while user inputs a value
    $(this).removeClass("train-info");

    // Replaces info with input box to update data
    var inputUpdate = $("<input>").attr({
        type: "text",
        id: "update-value",
        class: "form-control"
    })
    $(this).html(inputUpdate);

    // Adds update button for user to update td
    $(this).append($("<button>").addClass("update btn btn-outline-primary").text("Update"));
})

// Updates value in database and current user's table (other users will not see until refresh)
$("#table-body").on("click", ".update", function(){
    // Determines which key value pair needs to be updated
    var updateKey = $(this).parent().attr("data-key");
    var trainKey = $(this).parent().parent().parent().attr("data-key");
    var updateTrain = database.ref().child(trainKey);
    var updateValue = $(this).prev().val();

    // Updates value, adds train-info class to allow user to update value again if they want
    $(this).parent().html(updateValue).addClass("train-info")
    if (updateKey === "trainName"){
        updateTrain.update({trainName: updateValue});
    } else if (updateKey == "destination"){
        updateTrain.update({destination: updateValue});
    } else { // frequency; has to update next train and time until arrival
        updateTrain.update({frequency: updateValue});
    }
})