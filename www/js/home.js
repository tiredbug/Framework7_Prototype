$$(document).on('page:init', '.page[data-name="home"]', function(e) {

  app.dialog.preloader("Loading...");

  app.request.post(apiUrl + 'balance.php', {
    action: "get",
    userid: userid
  }, function (data) {
    app.dialog.close();

    data = JSON.parse(data);

    //---------------------
    // Getting balances
    var availableBal = data['user_balance']['current'] + " Pounds";
    var weekBal = "One week: " + data['user_balance']['oneweek'] + " pounds";
    var monthBal = "One month: " + data['user_balance']['onemonth'] + " pounds";
    var yearBal = "One year: " + data['user_balance']['oneyear'] + " pounds";

    $$(".available-bal-value").text(availableBal);
    $$(".pre-bal-values li").eq(0).text(weekBal);
    $$(".pre-bal-values li").eq(1).text(monthBal);
    $$(".pre-bal-values li").eq(2).text(yearBal);

    //---------------------
    // Creating a graph
    // making datapoints for graph
    var dataPoints = [];
    for(i=0; i<data.graph_balances.length; i++) {
      dataPoints[i] = { x: new Date(data['graph_balances'][i]['date']), y: parseFloat(data['graph_balances'][i]['current']) };
    }

    var chart = new CanvasJS.Chart("chartContainer", {
      backgroundColor: "rgba(225,255,255,0)",
      animationEnabled: true,
      title:{
        text: "Weekly increment"
      },
      axisX:{
        valueFormatString: "DDD",
      },
      axisY: {
        title: "Balance",
        includeZero: false,
        scaleBreaks: {
          autoCalculate: true
        }
      },
      data: [{
        type: "line",
        xValueFormatString: "DD MMM YYYY",
        color: "#F08080",
        dataPoints: dataPoints
      }]
    });
    chart.render();

  });
});
