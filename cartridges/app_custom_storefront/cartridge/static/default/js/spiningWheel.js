!function(t){var e={};function n(r){if(e[r])return e[r].exports;var a=e[r]={i:r,l:!1,exports:{}};return t[r].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)n.d(r,a,function(e){return t[e]}.bind(null,a));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e){var n=20,r=40,a=0,o=0,l=400-o-r,u=400-n-a,i=Math.min(l,u)/2,s=0,c=0,d=1e5,f=[],p=d3.scale.category20(),g=[{label:"Dell LAPTOP",value:1,question:"You Won Dell Laptop..Congratulations!"},{label:"IMAC PRO",value:2,question:"You Won IMAC PRO..Congratulations!"},{label:"FREE VOUCHER",value:3,question:"You Won Free Voucher..Congratulations!"},{label:"BONUS POINTS",value:4,question:"You Won Bonus Points..Congratulations!"},{label:"FERRARI",value:5,question:"You Won FERRARI..Congratulations!"},{label:"APARTMENT",value:6,question:"You Won APARTMENT..Congratulations!"},{label:"FREE SHIPPING",value:7,question:"You Won Free Shipping..Congratulations!"},{label:"JEWELLERY",value:8,question:"You Won pair of Earrings..Congratulations!"}],h=d3.select("#chart").append("svg").data([g]).attr("width",l+o+r).attr("height",u+n+a).style({"margin-left":"-13%"}),v=h.append("g").attr("class","chartholder").attr("transform","translate("+(l/2+o)+","+(u/2+n)+")"),b=v.append("g"),y=d3.layout.pie().sort(null).value((function(t){return 1})),P=d3.svg.arc().outerRadius(i),R=b.selectAll("g.slice").data(y).enter().append("g").attr("class","slice");function M(t){var e=d3.interpolate(c%360,s);return function(t){return"rotate("+e(t)+")"}}R.append("path").attr("fill",(function(t,e){return p(e)})).attr("d",(function(t){return P(t)})),R.append("text").attr("transform",(function(t){return t.innerRadius=0,t.outerRadius=i,t.angle=(t.startAngle+t.endAngle)/2,"rotate("+(180*t.angle/Math.PI-90)+")translate("+(t.outerRadius-10)+")"})).attr("text-anchor","end").text((function(t,e){return g[e].label})),v.on("click",(function t(e){if(v.on("click",null),console.log("OldPick: "+f.length,"Data length: "+g.length),f.length==g.length)return console.log("done"),void v.on("click",null);var n=360/g.length,r=(Math.round(1440/g.length),Math.floor(1440*Math.random()+360));if(s=Math.round(r/n)*n,d=(d=Math.round(g.length-s%360/n))>=g.length?d%g.length:d,-1!==f.indexOf(d))return void d3.select(this).call(t);f.push(d);s+=90-Math.round(n/2),b.transition().duration(3e3).attrTween("transform",M).each("end",(function(){d3.select(".slice:nth-child("+(d+1)+") path"),d3.select("#question h1").text(g[d].question),c=s,console.log(g[d].value),v.on("click",t)}))})),h.append("g").attr("transform","translate("+(l+o+r)+","+(u/2+n)+")").append("path").attr("d","M-"+.15*i+",0L0,"+.05*i+"L0,-"+.05*i+"Z"),v.append("circle").attr("cx",0).attr("cy",0).attr("r",40).style({fill:"white",cursor:"pointer"}),v.append("text").attr("x",0).attr("y",7).attr("text-anchor","middle").text("SPIN").style({"font-weight":"bold","font-size":"20px"})}]);