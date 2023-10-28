function showPicture() {
    // grab the image
    let myPicture = document.getElementById('image');
    // change the attribute to make the image show
    myPicture.style.display = 'block';
}

// hidePicture()

// button isn't showing until the picture is showing
// and when the picture gets hidden, the button hides as well

// *When the picture is showing, the showPicture() button is hidden

function divide() {
    // grab the input and the output
    let inputNum = document.getElementById('input').value;
    let output = document.getElementById('output');

    // check if my number is odd
    if (inputNum % 2 != 0) {
        // if it is, say "can't divide"
        output.textContent = 'That number isnt even.';
    } else {
        // if its not, divide by 2 and display
        output.textContent = inputNum / 2;
    }
}
