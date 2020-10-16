function Begin() {
    var e = document.getElementById("inputType");
    var s = e.options[e.selectedIndex].text;
    if (s == "Raw data") {
        var str = document.getElementById("data").value;
        if (str != "") {
            var good = true;
            for (i = 0; i < str.length; i++) {
                var letter = str.charAt(i);
                if (letter >= '0' && letter <= '9') {
                    good = true;
                }
                else {
                    good = false;
                }
            }
            if (good) {
                var list = str.split(/[ ,]+/).map(Number);
            
                list.sort(function(a, b){return a-b});
                
                BoxPlot(list);
            
                SetGraphType();
                $('#graphDistribution').css("display", "flex");

                document.getElementById("n").innerHTML = N(list);
                document.getElementById("mean").innerHTML = Mean(list).toFixed(3);
                document.getElementById("sd").innerHTML = SD(list, Mean(list)).toFixed(3);
                document.getElementById("min").innerHTML = Min(list);
                document.getElementById("q1").innerHTML = Q1(list);
                document.getElementById("med").innerHTML = Med(list);
                document.getElementById("q3").innerHTML = Q3(list);
                document.getElementById("max").innerHTML = Max(list);
                document.getElementById("iqr").innerHTML = Q3(list) - Q1(list);
                $('#summaryStatistics').css("display", "flex");
            }
            else {
                alert("Unsupported data.")
            }
        }
        else {
            alert("No data.")
        }
    }
    else if (s == "Mean and standard deviation") {

    }
    else if (s == "Five-number summary") {
        var min = document.getElementById("minInput").value;
        var q1 = document.getElementById("q1Input").value;
        var med = document.getElementById("medInput").value;
        var q3 = document.getElementById("q3Input").value;
        var max = document.getElementById("maxInput").value;
        if (IsNumeric(min) && IsNumeric(q1) && IsNumeric(med) && IsNumeric(q3) && IsNumeric(max)) {
            if (min <= q1 && q1 <= med && med <= q3 && q3 <= max) {
                BoxPlotFromFive();
                document.getElementById("boxPlot").style.display = "inline";
                $('#graphDistribution').css("display", "flex");
            }
            else {
                alert("Numbers must be increasing.")
            }
        }
        else {
            alert("Unsupported data.")
        }
    }
}
function IsNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
function SetGraphType() {
    var e = document.getElementById("graphType");
    var s = e.options[e.selectedIndex].text;
    if (s == "Boxplot") {
        document.getElementById("boxPlot").style.display = "inline";
    }
}
function SetInputType() {
    $('#graphDistribution').css("display", "none");
    $('#summaryStatistics').css("display", "none");
    var e = document.getElementById("inputType");
    var s = e.options[e.selectedIndex].text;
    if (s == "Raw data") {
        document.getElementById("rawData").style.display = "flex";
        document.getElementById("meanStd").style.display = "none";
        document.getElementById("fiveNumberSum").style.display = "none";
    }
    else if (s == "Mean and standard deviation") {
        document.getElementById("rawData").style.display = "none";
        document.getElementById("meanStd").style.display = "flex";
        document.getElementById("fiveNumberSum").style.display = "none";
    }
    else if (s == "Five-number summary") {
        document.getElementById("rawData").style.display = "none";
        document.getElementById("meanStd").style.display = "none";
        document.getElementById("fiveNumberSum").style.display = "flex";
    }
}
function BoxPlotFromFive() {
    //Make Box Plot
    if (document.getElementById("variable").value != "") {
        document.getElementById("name").innerHTML = document.getElementById("variable").value;
    }
    
    var min = document.getElementById("minInput").value;
    var q1 = document.getElementById("q1Input").value;
    var med = document.getElementById("medInput").value;
    var q3 = document.getElementById("q3Input").value;
    var max = document.getElementById("maxInput").value;

    var range = max - min;
    var mag = Math.round(Math.log10(range));
    mag = Math.pow(10, mag - 1);
    var minRange = Math.round(min / mag) * mag;
    var intervals = Math.ceil(range / mag);
    if (intervals > 10) {
        intervals = Math.ceil(intervals / 2);
        mag *= 2;
    }

    var maxRange = minRange + intervals * mag;

    var dashes = document.getElementsByClassName("dash");
    var dashNums = document.getElementsByClassName("dashNum");

    for (i = 0; i < dashes.length; i++) {
        if (i > intervals) {
            dashes[i].style.display = "none";
            dashNums[i].style.display = "none";
        }
        else {
            dashNums[i].innerHTML = minRange + mag * i;
        }
    }

    var width = 800;

    $("#box-min").css("margin-left", ((min - minRange) / (maxRange - minRange)) * width + "px");
    $("#box-min-q2").css("width", (((q1 - min) / (maxRange - minRange)) * width - 2) + "px");
    $("#box-q2-med").css("width", (((med - q1) / (maxRange - minRange)) * width - 2) + "px");
    $("#box-med-q3").css("width", (((q3 - med) / (maxRange - minRange)) * width - 2) + "px");
    $("#box-q3-max").css("width", (((max - q3) / (maxRange - minRange)) * width - 2) + "px");

}
function BoxPlot(list) {
    if (document.getElementById("variable").value != "") {
        document.getElementById("name").innerHTML = document.getElementById("variable").value;
    }

    var range = Max(list) - Min(list);
    var mag = Math.round(Math.log10(range));
    mag = Math.pow(10, mag - 1);
    var minRange = Math.round(list[0] / mag) * mag;
    var intervals = Math.ceil(range / mag);
    if (intervals > 0) {
        intervals = Math.ceil(intervals / 2);
        mag *= 2;
    }
    var maxRange = minRange + intervals * mag;

    var dashes = document.getElementsByClassName("dash");
    var dashNums = document.getElementsByClassName("dashNum");

    for (i = 0; i < dashes.length; i++) {
        if (i > intervals) {
            dashes[i].style.display = "none";
            dashNums[i].style.display = "none";
        }
        else {
            dashNums[i].innerHTML = minRange + mag * i;
        }
    }

    var width = 800;

    $("#box-min").css("margin-left", ((Min(list) - minRange) / (maxRange - minRange)) * width + "px");
    $("#box-min-q2").css("width", (((Q1(list) - Min(list)) / (maxRange - minRange)) * width - 2) + "px");
    $("#box-q2-med").css("width", (((Med(list) - Q1(list)) / (maxRange - minRange)) * width - 2) + "px");
    $("#box-med-q3").css("width", (((Q3(list) - Med(list)) / (maxRange - minRange)) * width - 2) + "px");
    $("#box-q3-max").css("width", (((Max(list) - Q3(list)) / (maxRange - minRange)) * width - 2) + "px");

}

function ResetAll() {
    document.getElementById("form").reset();
    SetInputType();
    SetGraphType();
    $('#graphDistribution').css("display", "none");
    $('#summaryStatistics').css("display", "none");
}

function SD(list, mean) {
    var n = list.length;
    var sum = 0;
    for (i = 0; i < n; i++) {
        sum += Math.pow((list[i] - mean), 2);
    }
    var sd = Math.sqrt(sum / (n - 1));
    return sd;
}
function N(list) {
    return list.length;
}
function Mean(list) {
    var n = list.length;
    var total = 0;
    for (i = 0; i < n; i++) {
        total += list[i];
    }
    return (total / n);
}
function Min(list) {
    return list[0];
}
function Q1(list) {
    var n = list.length;
    var middle = Math.ceil(n / 2) - 1;
    if (n % 2 == 0) {
        return Med(list.slice(0, middle + 1));
    }
    else {
        return Med(list.slice(0, middle));
    }
}
function Med(list) {
    var n = list.length;
    var middle = Math.ceil(n / 2) - 1;
    if (n % 2 == 0) {
        return (list[middle] + list[middle + 1]) / 2;
    }
    else {
        return list[middle];
    }
}
function Q3(list) {
    var n = list.length;
    var middle = Math.ceil(n / 2) - 1;
    if (n % 2 == 0) {
        return Med(list.slice(middle + 1, n));
    }
    else {
        return Med(list.slice(middle + 1, n));
    }
}
function Max(list) {
    return list[list.length - 1];
}
function Sum(list) {
    var sum = 0;
    for (i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return sum;
}