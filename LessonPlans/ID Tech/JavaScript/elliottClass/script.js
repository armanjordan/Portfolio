function showPicture() {
    // grab the image
    let myPicture = document.getElementById('image');
    // make it show
    myPicture.style.display = 'block';

    // make the hideButton show
}

function hidePicture() {

}

// hidePicture()
// have a button that when clicked, hides the picture
// but the button is not showing until the image is showing

function divide() {
    // grab the input and output
    let inputNum = document.getElementById('input').value;
    let output = document.getElementById('output');

    // if my number is odd
    if (inputNum % 2 != 0) {
        // do something
        output.textContent = "That number isn't even.";
    } else {
        // if its even, do something else
        output.textContent = inputNum / 2;
    }   
}
