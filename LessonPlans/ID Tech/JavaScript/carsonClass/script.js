function showPicture() {
    // find the image in the html file
    let myPicture = document.getElementById("image");
    // make the image show
    myPicture.style.display = "block";
}

// Create a new function hidePicture()
    // Uses a new button
    // The button only shows when the image is showing
    // The button hides when the image is not showing

// Stretch: also make it so that when the picture is showing, the showPicture() button is hidden


function divide() {
    // grab my document elements
    let inputNum = document.getElementById("input").value;
    let output = document.getElementById("output");

    // check if my number is odd
    if (inputNum % 2 != 0) {
        output.textContent = "That number isn't even.";
    } else {
        output.textContent = inputNum / 2;
    }
}
