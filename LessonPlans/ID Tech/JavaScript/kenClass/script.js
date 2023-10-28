function showPicture() {
    // grab the image
    let myPicture = document.getElementById('image');
    // make it show
    myPicture.style.display = 'block';
}

function divide() {
    // grab the input and output tags
    let inputNum = document.getElementById('input').value;
    let output = document.getElementById('output');

    // conditional: if odd display text, if even divide by 2
    if (inputNum % 2 != 0) {
        output.textContent = "That number is odd.";
    } else {
        output.textContent = inputNum / 2;
    }
}

class Picker {
    constructor() {
        const monthString = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
        const numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        // grabs the html elements necessary
        const displayElement = document.getElementById('display');
        const nextElement = document.getElementById('next');
        const prevElement = document.getElementById('prev');

        // initializes date values
        const datesTable = document.createElement('table');
        const date = new Date();
        let month = date.getMonth();

        // current day variables
        let todaysDate = date;
        let todaysDay = date.getDate();
        let todaysMonth = month;
        let todaysYear = date.getFullYear();

        displayElement.textContent = monthString[month] + ' ' +
                date.getFullYear();

        // connects the html arrow element to the function
        nextElement.addEventListener('click', nextMonth);
        prevElement.addEventListener('click', prevMonth);
        displayElement.addEventListener('click', reset);

        makeCalendar();

        function reset() {
            const todaysResetDate = new Date();
            month = todaysResetDate.getMonth();
            date.setFullYear(todaysResetDate.getFullYear(), month, todaysResetDate.getDate());

            todaysDate = date;
            todaysDay = date.getDate();
            todaysMonth = month;
            todaysYear = date.getFullYear();

            displayElement.textContent = monthString[month] + ' ' +
                date.getFullYear();

            makeCalendar();
        }

        // calculates the proper month when clicking next
        function nextMonth() {
            if (month == 11) {
                month = 0;
                date.setFullYear(date.getFullYear() + 1);
            } else {
                month++;
            }
            
            displayElement.textContent = monthString[month] + ' ' +
                date.getFullYear();
            makeCalendar();
        }

        function prevMonth() {
            if (month == 0) {
                month = 11;
                date.setFullYear(date.getFullYear() - 1);
            } else {
                month--;
            }
            displayElement.textContent = monthString[month] + ' ' +
                date.getFullYear();
            makeCalendar();
        }

        function makeCalendar() {
            // display current date
            displayElement.textContent = monthString[month] + ' ' +
                date.getFullYear();

            datesTable.innerHTML = '<tr><tr>';

            const pickerTag = document.getElementById('center');
            pickerTag.appendChild(datesTable)

            //    < Month >
            //  0 1 2 3 4 5 6
            //  7 8 9 10

            for (let a = 0; a < 6; a++) {
                const trElement = document.createElement('tr');
                datesTable.append(trElement);

                for (let b = 0; b < 7; b++) {
                    // create new entries
                    const dateElement = document.createElement('th');
                    dateElement.id = (a * 7) + b;
                    trElement.append(dateElement);
                }
            }

            let idNum = 0;
            const numberOfDays = numDays[month];

            // populating entries with text
            for (let d = 0; d < numberOfDays; d++) {
                const targetElement = document.getElementById(idNum);
                targetElement.textContent = (d + 1);
                idNum++;

                if (todaysDay == (d + 1) && todaysMonth == month && todaysYear == date.getFullYear()) {
                    targetElement.id = 'today';
                } else {
                    targetElement.style.color = 'black';
                }

                // event for selecting a day
                const mouseClick = function (event) {
                    todaysDate.setDate(targetElement.textContent);
                    todaysMonth = month;
                    todaysYear = date.getFullYear();
                    todaysDay = targetElement.textContent;
                    makeCalendar();
                }

                targetElement.addEventListener('click', mouseClick)
            }
        }
    }
}
