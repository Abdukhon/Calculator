let enter = document.getElementById('enter')

function number(value) {
    enter.value += value;
}
function Clear() {
    enter.value = "";
}
function calculating() {
    try {
        enter.value = eval(enter.value);
    } catch {
        enter.value = "Error";
    }
}
function Delete() {
    enter.value = enter.value.slice(0, -1);
}