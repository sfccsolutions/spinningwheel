/* <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script> */
import * as $ from 'jquery'
import { identity, indexOf } from 'lodash';
$("#btn-accept").hide();
$("#btn-decline").hide();
$("#walletIcon").hide();
//import $ from 'jquery' ;
var padding = { top: 20, right: 40, bottom: 0, left: 0 },
    w = 400 - padding.left - padding.right,
    h = 400 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();//category20c()
var dataValue = $('#mySpinerData').val();
var spinOptions = $('#mySpinerOptions').val();
console.log("anber");
console.log(spinOptions);
if (spinOptions === "Products") {
    var data = JSON.parse(dataValue);
}
else {
    dataValue = dataValue.substring(1, dataValue.length - 1);
    var data = dataValue.split(',');
    console.log(data);
}
var svg = d3.select('#chart')
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .style({ "margin-left": "-12%" });

var container = svg.append("g")
    .attr("class", "chartholder")
    .attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
var vis = container
    .append("g");

var pie = d3.layout.pie().sort(null).value(function (d) { return 1; });
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice")
    .attr("title", data[1].productName);

arcs.append("path")
    // .attr("fill", function (d, i) { return color(i); })
    .attr("fill", "#aec7e8")
    .attr("d", function (d) { return arc(d); })
    .attr("title", data[1].productName);

// add the text
if (spinOptions === "Points") {
    $("#walletIcon").show();
    arcs.append("text").attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 35) + ")";
    })
        .attr("text-anchor", "end")
        .style({ "fill": "white" })
        .text(function (d, i) {
            return data[i];
        })

}

if (spinOptions === "Products") {
    $("#walletIcon").show();
    arcs.append("image").attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return "rotate(" + (d.angle * 180 / Math.PI - 100) + ")translate(" + (d.outerRadius - 70) + ")";
    })
        .attr("href", function (d, i) {
            return data[i].productImage;
        })
        .attr("id", "wheelImages")
        .attr("title", "Images")
        // .attr("href", data[2].productImage)
        .attr("alt", "images");

}

container.on("click", spin);

function spin(d) {
        updateSpinCount().then(
            function (value) {
                console.log(value);
                console.log("hello");
                // if (value.error === true) {
                //     $("#question h1")
                //         .text("The daily limit has been reached!");
                //     // return;
                // }
    
                var enable = $('#enableSpinningWheel').val();
                console.log(enable);
                // if(enable === "false"){
                //     $("#question h1")
                //     .text("No offers are available at the moment.");
                //     return;
                // }
    
                var spin_wheel_duration = $('#spinWheelDuration').val();
                console.log(spin_wheel_duration);
                if (enable === "true" && spin_wheel_duration === "true") {
                    console.log("Wheel Enabled");
    
                    container.on("click", null);
    
                    //all slices have been seen, all done
                    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
                    if (oldpick.length == data.length) {
                        console.log("done");
                        container.on("click", null);
                        return;
                    }
                    var ps = 360 / data.length,
                        pieslice = Math.round(1440 / data.length),
                        rng = Math.floor((Math.random() * 1440) + 360);
    
                    rotation = (Math.round(rng / ps) * ps);
    
                    picked = Math.round(data.length - (rotation % 360) / ps);
                    picked = picked >= data.length ? (picked % data.length) : picked;
                    if (oldpick.indexOf(picked) !== -1) {
                        d3.select(this).call(spin);
                        return;
                    } else {
                        oldpick.push(picked);
                    }
                    rotation += 90 - Math.round(ps / 2);
                    vis.transition()
                        .duration(3000)
                        .attrTween("transform", rotTween)
                        .each("end", function () {
                            //mark question as seen
                            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                            $('#selectedProduct').val(JSON.stringify(data[picked]));
    
                            if (spinOptions === "Products") {
    
                                // .attr("fill", "#111")
                                //populate question
                                d3.select("#question h1")
                                    .text(data[picked].productName)
                                document.getElementById('img').src = data[picked].productImage;
                                d3.select("#question p")
                                    .text(data[picked].description)
    
                                console.log("Helloooo");
    
                                /* Get the result value from object "data" */
                                console.log(data[picked].productID)
    
                                /* Comment the below line for restrict spin to sngle time */
    
                                $("#btn-accept").show();
                                $("#btn-decline").show();
    
                            }
                            else {
    
                                $("#question h1")
                                    .text("Congratulations!! You have earned " + data[picked] + " Points.")
    
                                addSpinnerPoints(data[picked]);
    
    
                            }
                            oldrotation = rotation;
                            container.on("click", spin);
    
                        });
                }
    
                else {
                    if (enable === "false" && spin_wheel_duration === "false") {
                        $("#question h1")
                            .text("The wheel is not enabled & the daily limit is up!");
    
                    }
                    else if (enable === "false") {
                        $("#question h1")
                            .text("No offers are available at the moment.");
                    }
    
                    else {
                        $("#question h1")
                            .text("You can spin wheel only 3 times a day.");
    
                    }
    
    
                }
    
            },
    
            function (error) {
                console.log(error);
                console.log("in hell");
            }
        );
    



}



//make arrow
svg.append("g")
    .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h / 2) + padding.top) + ")")
    .append("path")
    .attr("d", "M-" + (r * .15) + ",0L0," + (r * .05) + "L0,-" + (r * .05) + "Z")
// .style({ "fill": "black" });
//draw spin circle
container.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 30)
    .style({ "fill": "white", "cursor": "pointer" });
//spin text
container.append("text")
    .attr("x", 0)
    .attr("y", 7)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "15px" });


function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}


function getRandomNumbers() {
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if (window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function") {
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        //no support for crypto, get crappy random numbers
        for (var i = 0; i < 1000; i++) {
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}

function addSpinnerPoints(points) {

    var walletUrl = $('#walletUrl').val();
    console.log(walletUrl);

    $.ajax({
        url: walletUrl,
        type: 'post',
        data: { points },
        dataType: 'json',
        context: this,
        success: function (data) {
            console.log("getting products");
            console.log(data);
            if (data.success) {
                $("#walletIcon")
                    .html(`<span class='fa fa-database ' id="coins" title="Points" aria-hidden="true"></span>
                    ${data.rewards}`)
                $("#loyaltyPointsIcon").html(`${data.earned_dollar}`);

                console.log("inside successs");


            }

        },

        error: function (error) {
            console.log("In error");
            console.log(error);
        }

    });

}

async function updateSpinCount() {

    var updateSpinCountUrl = $('#updateSpinCountUrl').val();
    console.log(updateSpinCountUrl);

    return $.ajax({
        url: updateSpinCountUrl,
        type: 'post',
        dataType: 'json',
        context: this,
        // beforeSend: function () {
        //     this.attr('disabled', true).html("Processing...");
        //     console.log(this);
        // },
        success: function (data) {
            console.log("updating count");
            if (data.success) {
                // this.attr('disabled', false);
                return true;

            }
            else {
                return false;
            }

        },

        error: function (error) {
            console.log("In error");
            console.log(error);
            return false;
        }
    });

}







