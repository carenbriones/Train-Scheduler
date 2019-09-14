# Train-Scheduler
Train scheduler that allows a user to input a train schedule with the use of Firebase.

# Functionalities
* User inputs a train name, destination, first train time, and frequency, and a train schedule will be added to the page. Data will be saved to a firebase database.
* Time until next train and time of arrival of next train will be calculated and displayed as well.
* Users can delete train schedules on the page, which will also delete the corresponding data in the database.
* Users can update train schedules on the page by clicking on a train's name, destination, or frequency to change the value

### Unfinished
* Update function only displays locally on the user's page. Other users have to refresh the page to see the updated values
* Update function does not change "Next Arrival" and "Minutes Away" values on the page if frequency is updated; user has to refresh page to see updated values