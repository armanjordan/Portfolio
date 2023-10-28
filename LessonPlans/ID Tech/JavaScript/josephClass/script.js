function showPicture() {
    // find the image tag
    let myImg = document.getElementById("image");
    // display the image tag
    myImg.style.display = "block";
}

function divide() {
    // grab the input and output
    let myNum = document.getElementById("input").value;
    let output = document.getElementById("output");

    // check if number
    if (typeof(myNum) != "number") {
        output.textContent = "That is not a number";
    }

    // check if odd
    if (myNum % 2 != 0) {
        output.textContent = "Input number is not even.";
    } else {
        // if even, divide
        output.textContent = myNum / 2;
    }
}