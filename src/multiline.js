
/// <reference path="../types/globals.d.ts" />

export function runMultiLineInput(){
    // put the values into an array
    // @ts-ignore
    const inputString = document.getElementById("multilineInput").value
    const inputStringArray = inputString.split("\n")
    console.log(inputStringArray)
    // run code for each one

}