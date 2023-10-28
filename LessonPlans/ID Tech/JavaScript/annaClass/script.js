function display() {
    let image = document.getElementById("image");
    image.style.display = "block";
}

function divide() {
    // grab the input and output from doc
    let myNum = document.getElementById("number").value;
    let output = document.getElementById("output");

    // check if num
    if (typeof(myNum) != "number") {
        output.textContent = "Not a valid number.";
    }

    // check if even
    if (myNum % 2 != 0) {
        output.textContent = "Input number is not even";
    } else {
        // display output
        output.textContent = myNum / 2;
    }
}