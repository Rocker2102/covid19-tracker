$(window).on("load", function() {
    loadCountries();
});

$(document).ready(function() {
    $('select').formSelect();
    $(".tooltipped").tooltip({exitDelay: 300});
});

$(".card-panel").hover(function() {
    $(this).removeClass("lighten-2");
}, function() {
    $(this).addClass("lighten-2");
});

function showToast(htmlData, classData = "red white-text", icon = "info") {
    let toastIcon = "<i class='material-icons left'>" + icon + "</i>";
    return M.toast({html: toastIcon + htmlData, classes: classData});
}

function loadCountries() {
    url = "https://covid-193.p.rapidapi.com/countries";

    $.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        timeout: 30000,
        headers: {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
		    "x-rapidapi-key": "f05e1394dfmsh9de926b657cb86ep17efaajsnb2096644dc0d"
        },
        beforeSend: function() {
            
        },
        success: function(receive) {
            let countryArr = receive.response;
            let countryList = "<option selected disabled>Select Country</option>";
            for(i = 0; i < countryArr.length; i++) {
                countryList += "<option value='" + countryArr[i].toLowerCase() + "'>" + countryArr[i] + "</option>";
            }
            $("#countries").html(countryList);
            $("#total-countries").html("Total Countries: " + countryArr.length);

            $('select').formSelect();
        },
        error: function() {
            console.log("Error!");
            showToast("An error occurred!");
            return;
        }
    });
}

function fetchData(country = undefined, callback = myCallback) {
    let url = "https://covid-193.p.rapidapi.com/statistics";

    if(typeof country != "undefined")
        url = "https://covid-193.p.rapidapi.com/statistics?country=" + country;

    $.ajax({
        crossDomain: true,
        url: url,
        method: "GET",
        timeout: 30000,
        headers: {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
		    "x-rapidapi-key": "f05e1394dfmsh9de926b657cb86ep17efaajsnb2096644dc0d"
        },
        beforeSend: function() {
            $("#stats-container").addClass("hide");
            $("#mypreloader").addClass("scale-in");
        },
        success: callback,
        error: function() {
            console.log("Request timed out!");
            showToast("Request timed out!");
            return;
        }
    });
}

function myCallback(data) {
    console.log(data);
}

$("#countries").on("change", function(e) {
    let country = $("#countries").val();

    fetchData(country, function(data) {
        data = data.response[0];
        updateStats(data);
    });
});

function globalUpdate() {
    fetchData(undefined, function(data) {
        data = data.response;
        let myObj = {};
        myObj.cases = {};
        myObj.deaths = {};

        myObj.country = "Global Statistics";
        myObj.cases["total"] = 0;
        myObj.cases["new"] = 0;
        myObj.cases["active"] = 0;
        myObj.cases["critical"] = 0;
        myObj.cases["recovered"] = 0;
        myObj.deaths["total"] = 0;
        myObj.deaths["new"] = 0;
        myObj.day = data[0].day;

        for(i = 0; i < data.length; i++) {
            myObj.cases["total"] += Number(formatText(data[i].cases["total"]));
            myObj.cases["new"] += Number(formatText(data[i].cases["new"]));
            myObj.cases["active"] += Number(formatText(data[i].cases["active"]));
            myObj.cases["critical"] += Number(formatText(data[i].cases["critical"]));
            myObj.cases["recovered"] += Number(formatText(data[i].cases["recovered"]));
            myObj.deaths["total"] += Number(formatText(data[i].deaths["total"]));
            myObj.deaths["new"] += Number(formatText(data[i].deaths["new"]));
        }

        updateStats(myObj);
    });
}

function formatText(data) {
    if(data == "null" || data == null)
        return "0";
    else
        return data;
}

function updateStats(data) {
    $("#mypreloader").removeClass("scale-in");
    $("#stats-container").removeClass("hide");
    $("#info-owner").html(data.country);
    $("#total-cases").html(formatText(data.cases["total"]));
    $("#new-cases").html(formatText(data.cases["new"]));
    $("#active-cases").html(formatText(data.cases["active"]));
    $("#critical-cases").html(formatText(data.cases["critical"]));
    $("#recovered-cases").html(formatText(data.cases["recovered"]));

    $("#total-deaths").html(formatText(data.deaths["total"]));
    $("#new-deaths").html(formatText(data.deaths["new"]));

    $("#last-updated").html("Database Last Updated: " + data.day);
}