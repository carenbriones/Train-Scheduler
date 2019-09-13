// Your web app's Firebase configuration
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

$("#submit-button").on("click", function (event) {
    event.preventDefault();
    console.log($("#train-name").val().trim());
    console.log($("#destination").val().trim());
    console.log($("#first-train-time").val().trim());
    console.log($("#frequency").val().trim());

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
    var tableRow = $("<tr>");
    tableRow.append($("<button>").addClass("btn btn-outline-primary delete").attr("data-key", data.key).text("X"));
    tableRow.append( $("<td>").text(data.val().trainName));
    tableRow.append( $("<td>").text(data.val().destination));
    tableRow.append( $("<td>").text(data.val().frequency));
    tableRow.append( $("<td>").text(moment().add(minutesAway, "minutes").format("HH:mm A")));
    tableRow.append( $("<td>").text(minutesAway));

    $("#table-body").append(tableRow);
})

// Deletes row from table and data from firebase
$("#table-body").on("click", ".delete", function(){
    $(this).parent().empty();
    database.ref().child($(this).attr("data-key")).remove();
})