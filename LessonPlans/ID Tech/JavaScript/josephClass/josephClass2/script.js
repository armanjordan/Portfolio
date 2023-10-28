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
    constructor () {
        const monthString = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];

        // html elements
        const displayElement = document.getElementById('display');
        const nextElement = document.getElementById('next');
        const prevElement = document.getElementById('prev');

        const datesTable = document.createElement('table');
        const date = new Date();
        let month = date.getMonth();

        nextElement.addEventListener('click', nextMonth);
        prevElement.addEventListener('click', prevMonth);
    
        function nextMonth() {
            console.log('call here');
            if (month == 11) {
                month = 0;
                date.setFullYear(date.getFullYear() + 1)
            } else {
                month++;
            }
            
            displayElement.textContent = monthString[month] + ' ' +date.getFullYear();
        }

        function prevMonth() {
            if (month == 0) {
                month = 11;
                date.setFullYear(date.getFullYear() - 1)
            } else {
                month--;
            }
            
            displayElement.textContent = monthString[month] + ' ' +date.getFullYear();
        }
    }
}
