var newData = {};
var state = {};


d3.queue()
    .defer(tt)
    .await(ready);

function tt(callback){

  d3.csv("w.csv", function(data) {
    readdata(data);
  });

  function readdata(data){

    newData = data.filter(usdata);
    function usdata(d)
    {
      return d.country == "US";
    }

    ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
    "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
    "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
    "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
    "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
      .forEach(function(d){ 
      var a = uStatePaths.filter(function(d1) {return d1.id == d;});
      state[d] = newData.filter(stateData);
        function stateData(data)
        {
          return data.province == a[0].n;
        }
      });
    callback(null);
  }
}


function ready(error){
  if(error) throw error;
  quantityBasedMap(tooltipHtml);
  d3.select("#before").style("display","none");
  
  d3.select("#quality").on("click", function () {
      qualityBasedMap(tooltipHtml); 
      d3.select("#yi").style("display","block")
      d3.select("#er").style("display","none")
  });

    d3.select("#quantity").on("click", function () {
      quantityBasedMap(tooltipHtml); 
      d3.select("#yi").style("display","none")
      d3.select("#er").style("display","block")
    });

    d3.selectAll(".state")
    .on("click",function(d){
      bestwine(d);
      cheapest(d);
    });
    d3.select(self.frameElement).style("height", "600px"); 
}


function tooltipHtml(n, d){ /* function to create html content string in tooltip div. */
    return "<h4>"+n+"</h4><table>"+
      "<tr><td>Production</td><td>"+(d.quantity)+"</td></tr>"+
      "<tr><td>Average Wine Price</td><td>"+"$"+(d.avgPrice) + "</td></tr>"+
      "<tr><td>Average Wine Rating</td><td>"+(d.avgScore)+"</td></tr>"+
      "</table>";
  }


  function quantityBasedMap(toolTip)
  {
    var sampleData ={};
    ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
    "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
    "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
    "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
    "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
    .forEach(function(d){ 

      var propOwn = Object.getOwnPropertyNames(state[d]);
      var qunt = propOwn.length;

  function price(d){
    if (qunt==1)return 0;
    else 
    {  var x = Math.round(d3.mean(state[d],function(d){ return +d.price; }));
      return x}}
  function scores(d){
  if (qunt==1) return 0;
  else{
    var y = Math.round(d3.mean(state[d],function(d){return +d.points}))
    return y; }}
      
      var score = Math.round(d3.mean(state[d],function(d){return +d.points}));

      sampleData[d]={
        quantity: qunt-1, 
        avgPrice: price(d),
        avgScore:scores(d),
        color:QuanMapColor(qunt)}
    });
    uStates.draw("#statesvg", sampleData, tooltipHtml);
      d3.select("#statesvg").selectAll(".state")
      .style("fill",function(d){ return sampleData[d.id].color; });
  }


  function qualityBasedMap(toolTip)
  {
    var sampleData ={};
    ["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
    "ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
    "MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
    "CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
    "WI", "MO", "AR", "OK", "KS", "LS", "VA"]
    .forEach(function(d){ 

      var propOwn = Object.getOwnPropertyNames(state[d]);
      var qunt = propOwn.length;
      var score = Math.round(d3.mean(state[d],function(d){return +d.points}));

      sampleData[d]={quantity:(qunt-1), avgPrice:Math.round(d3.mean(state[d],function(d){return +d.price})), 
          avgScore:score, color:QuaMapColor(score)}; 
    });
      d3.select("#statesvg").selectAll(".state")
        .style("fill",function(d){ return sampleData[d.id].color; });
      d3.select(self.frameElement).style("height", "600px"); 
}

function QuanMapColor(num)
{
  if(num  ==1 )
    return "white";
   else if( num < 50)
    return "#e9cace"
  else if(num < 100)
    return "#d2939a"
  else if(num < 500)
    return "#aa4652";
  else if(num < 1000)
    return "#8e3a44"
  else if(num < 5000)
    return "#722f37"
  else 
    return "#56242a";
}

function QuaMapColor(num)
{
  if(num == 82)
    return "#e9cace";
  else if(num == 83)
    return "#d2939a";
  else if(num == 84)
    return "#c77781";
  else if(num == 85)
    return "#b64d5a";
  else if(num == 86)
    return "#aa4652";
  else if(num == 87)
    return "#8e3a44";
  else if(num == 88)
    return "#722f37";
  else if(num == 89)
    return "#56242a";
  else 
    return "#faf4f5";
} 


 function cheapest(d){
      var cheap = state[d.id];
       cheap.sort(function(a, b){
        if(a.price === ""){
          return 1;
        }
         if(b.price === ""){
          return -1;
        }
        if(a.title === ""){
          return 1;
        }
         if(b.title === ""){
          return -1;
        }else if(a.price === b.price){
          return 0;
        }
        else 
          return a.price - b.price;
        
      });
       var single=[];
       for(i = 0; i <5;i++){
        single[i] = cheap[i];
      }  
      single.sort(function(a, b){return a.points-b.points});

        var chart = new CanvasJS.Chart("cheapchart", {
        
          title:{
            text:"Cheapest wine in "+d.n+" ranked by rating",
            fontSize:20,
          },
          toolTip:{
            contentFormatter:function(e){
              var name = e.entries[0].dataPoint.label;
              for(i = 0; i < 5; i++){
                if (single[i].title == name)
                break;
              }
              return winehtml(single[i]);
            }
          },
          axisX:{
            interval: 1,
            labelFontSize:11
          },
          axisY2:{
            interlacedColor: "white",
            gridColor: "rgba(1,77,101,.1)",
            title: "Wine rating",
            titleFontColor:"rgb(182,77,90)",
            minimum:70,
            maximum:100,
            interval:5,
            labelFontColor:"rgb(182,77,90)"
          },
          dataPointWidth: 10,
          data: [{
            type: "bar",
            name: "wine titles",
            axisYType: "secondary",
            color: "rgb(182,77,90)",
            dataPoints: []
          }]
        });

          if(cheap.length == 1){
          chart.options.data[0].dataPoints = [{y: parseInt(single[0].points), label: single[0].title}];

        }
        else if(cheap.length==2)
         chart.options.data[0].dataPoints = [{ y: parseInt(single[0].points), label: single[0].title },
          { y: parseInt(single[1].points), label: single[1].title }];
        
        else if(cheap.length == 4)
         chart.options.data[0].dataPoints =[ { y: parseInt(single[0].points), label: single[0].title },
          { y: parseInt(single[1].points), label: single[1].title },
          { y: parseInt(single[2].points), label: single[2].title },
          { y: parseInt(single[3].points), label: single[3].title }];
          else
            chart.options.data[0].dataPoints=[{ y: parseInt(single[0].points), label: single[0].title },
          { y: parseInt(single[1].points), label: single[1].title },
          { y: parseInt(single[2].points), label: single[2].title },
          { y: parseInt(single[3].points), label: single[3].title },
          { y: parseInt(single[4].points), label: single[4].title }];
        
      chart.render();
      
  }


  function bestwine(d){
    var best = state[d.id];
      best.sort(function(a, b){
        if(a.title === ""){
          return 1;
        }
         if(b.title === ""){
          return -1;
        }else if(a.points === b.points){
          return 0;
        }
        else 
          return b.points - a.points;
      });
      //if(best.length<5){

      //}
      var arr=[];
      for(i = 0; i <5;i++){
        arr[i] = best[i];
      }
      arr.sort(function(a,b){
        return b.price - a.price;
      })
      var chart = new CanvasJS.Chart("bestchart", {
        animationEnabled: true,
        zoomEnabled: true,
        title:{
          text:"Best wine in "+d.n+" ranked by price",
          fontSize:20
        }, 
        axisX:{
          interval: 1,
          labelFontSize:11

        },
        axisY2:{
          interlacedColor: "white",
          gridColor: "rgba(1,77,101,.1)",
          title: "Wine Price($)",
          titleFontColor:"#009933",
          maximum:arr[0].price,
          interval:15,
          labelFontColor:"#009933"
        },
        dataPointWidth: 10,
        data: [{
          type: "bar",
          name: "wine titles",
          axisYType: "secondary",
          color: "#009933",
          dataPoints: [ ]   
        }],
        toolTip:{
          contentFormatter:function(e){
            var name = e.entries[0].dataPoint.label; 
            for(j = 0; j < 5; j++){
              if (arr[j].title == name){
                  console.log("hi");
                  break; 
              }
            }
            return winehtml(arr[j]);
          }
        }
      });
      console.log(best.length);
      if(best.length == 1)
          chart.options.data[0].dataPoints = [{y: parseInt(arr[0].points), label: arr[0].title}];
        else if(best.length==2)
          chart.options.data[0].dataPoints = [{ y: parseInt(arr[0].points), label: arr[0].title },
          { y: parseInt(arr[1].points), label: arr[1].title }];
        
        else if(best.length == 4)
          chart.options.data[0].dataPoints =[ { y: parseInt(arr[0].points), label: arr[0].title },
          { y: parseInt(arr[1].points), label: arr[1].title },
          { y: parseInt(arr[2].points), label: arr[2].title },
          { y: parseInt(arr[3].points), label: arr[3].title }];
        else
          chart.options.data[0].dataPoints = [{ y: parseInt(arr[0].price), label: arr[0].title },
            { y: parseInt(arr[1].price), label: arr[1].title },
            { y: parseInt(arr[2].price), label: arr[2].title },
            { y: parseInt(arr[3].price), label: arr[3].title },
            { y: parseInt(arr[4].price), label: arr[4].title }];
      chart.render();
    }
  
function winehtml(myobj){
    return "<div id = 'wine'><h4>"+(myobj.title)+"</h4><table>"+
      "<tr><td>Description: </td><td>"+(myobj.description)+"</td></tr>"+
      "<tr><td >Price:  </td><td id ='hi'>"+"$"+(myobj.price) + "</td></tr>"+
      "<tr><td>Score:  </td><td id ='score'>"+(myobj.points)+"</td></tr>"+
     // "</table></div>";
      "<tr><td>Winery:  </td><td>"+(myobj.winery)+"</td></tr>"+
      "</table></div>";
  }