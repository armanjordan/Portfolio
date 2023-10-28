function showPicture() {
    // grab the image
    let myPicture = document.getElementById("image");
    // make it show
    myPicture.style.display = "block";
}

function divide() {
    // grab the input, grab an output as well
    let inputNum = document.getElementById("input").value;
    let output = document.getElementById("output");

    // if my number is odd
    if (inputNum % 2 != 0) {
        output.textContent = "That number isn't even";
    } else {
        output.textContent = inputNum / 2;
    }
}

class Picker {
    constructor() {
        const monthString = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        const displayElement = document.getElementById('display');
        const nextElement = document.getElementById('next');
        const prevElement = document.getElementById('prev');

        const datesTable = document.createElement('table');
        const date = new Date();
        let month = date.getMonth();

        // variables for storing date
        let todaysDate = date;
        let todaysDay = date.getDate();
        let todaysMonth = month;
        let todaysYear = date.getFullYear();

        nextElement.addEventListener('click', nextMonth);
        prevElement.addEventListener('click', prevMonth);

        displayElement.addEventListener('click', reset);

        makeCalendar();


        function reset() {
            console.log('Right here');
            const todaysResetDate = new Date();
            month = todaysResetDate.getMonth();
            date.setFullYear(todaysResetDate.getFullYear(), month, todaysResetDate.getDate());

            // added code for storing date
            todaysDate = date;
            todaysDay = date.getDate();
            todaysMonth = month;
            todaysYear = date.getFullYear();

            displayElement.textContent = monthString[month] + ' ' +
                date.getFullYear();
            makeCalendar();
        }

        function nextMonth() {
            if (month == 11) {
                month = 0;
                date.setFullYear(date.getFullYear() + 1);
            } else {
                month++;
            }
            displayElement.textContent = monthString[month] +
                ' ' + date.getFullYear();
            makeCalendar();
        }

        function prevMonth() {
            if (month == 0) {
                month = 11;
                date.setFullYear(date.getFullYear() - 1);
            } else {
                month--;
            }
            displayElement.textContent = monthString[month] +
                ' ' + date.getFullYear();
            makeCalendar();
        }

        function makeCalendar() {
            // display current date
            displayElement.textContent = monthString[month] +
                ' ' + date.getFullYear();

            // write out the weekdays
            datesTable.innerHTML = '<tr></tr>';

            // grab the html table
            const pickerTag = document.getElementById('center');
            pickerTag.appendChild(datesTable);

            // iterate through rows
            for (let a = 0; a < 6; a++) {
                // create new tr
                const trElement = document.createElement('tr');
                datesTable.append(trElement);

                // iterate through the columns
                for (let b = 0; b < 7; b++) {
                    // create new entries
                    const dateElement = document.createElement('th');
                    dateElement.id = (a * 7) + b
                    trElement.append(dateElement);
                }
            }

            // iterate through and write the numbers in the created entries
            let idNum = 0;
            const numberOfDays = numDays[month];

            for (let d = 0; d < numberOfDays; d++) {
                const targetElement = document.getElementById(idNum);
                targetElement.textContent = (d + 1);
                idNum++;

                // when setting CSS, check if selected date is here
                if (todaysDay == (d + 1) && todaysMonth == month && todaysYear == date.getFullYear()) {
                    targetElement.id = ('today');
                } else {
                    targetElement.style.color = 'black';
                }

                // add event for clicking
                const mouseClick = function (event) {
                    todaysDate.setDate(targetElement.textContent);
                    todaysMonth = month;
                    todaysYear = date.getFullYear();
                    todaysDay = targetElement.textContent;
                    makeCalendar();
                };

                targetElement.addEventListener('click', mouseClick);
            }
        }
    }
}