/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9281652224431516, 3000, 5000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8647769516728625, 3000, 5000, "products-dpx-long-es-2"], "isController": false}, {"data": [0.9981412639405205, 3000, 5000, "products-dpx-long-es-1"], "isController": false}, {"data": [0.9972118959107806, 3000, 5000, "products-dpx-long-es-0"], "isController": false}, {"data": [0.8373253493013972, 3000, 5000, "home-1"], "isController": false}, {"data": [0.9955089820359282, 3000, 5000, "home-0"], "isController": false}, {"data": [0.8981395348837209, 3000, 5000, "products-sync"], "isController": false}, {"data": [0.8705991352686844, 3000, 5000, "download-thanks"], "isController": false}, {"data": [0.7909632571996028, 3000, 5000, "home-de"], "isController": false}, {"data": [0.9930102516309413, 3000, 5000, "solutions-0"], "isController": false}, {"data": [0.792368681863231, 3000, 5000, "home-pt"], "isController": false}, {"data": [0.9962721342031687, 3000, 5000, "solutions-1"], "isController": false}, {"data": [0.8741845293569431, 3000, 5000, "solutions-2"], "isController": false}, {"data": [0.9990662931839402, 3000, 5000, "solutions-portals-0"], "isController": false}, {"data": [0.9362790697674419, 3000, 5000, "products-sync-1"], "isController": false}, {"data": [0.9993804213135068, 3000, 5000, "downloads-enterprise-2"], "isController": false}, {"data": [0.9993804213135068, 3000, 5000, "downloads-enterprise-3"], "isController": false}, {"data": [0.9959727385377943, 3000, 5000, "downloads-enterprise-0"], "isController": false}, {"data": [0.9975170701427685, 3000, 5000, "downloads-fixpacks-0"], "isController": false}, {"data": [0.9962790697674418, 3000, 5000, "products-sync-0"], "isController": false}, {"data": [0.9975216852540273, 3000, 5000, "downloads-enterprise-1"], "isController": false}, {"data": [0.9984481688392303, 3000, 5000, "downloads-fixpacks-1"], "isController": false}, {"data": [1.0, 3000, 5000, "solutions-portals-1"], "isController": false}, {"data": [0.8646592709984152, 3000, 5000, "resources-gartner"], "isController": false}, {"data": [0.9084967320261438, 3000, 5000, "solutions-portals-2"], "isController": false}, {"data": [0.7393122676579925, 3000, 5000, "products-dpx-long-es"], "isController": false}, {"data": [1.0, 3000, 5000, "downloads-fixpacks-2"], "isController": false}, {"data": [1.0, 3000, 5000, "downloads-fixpacks-3"], "isController": false}, {"data": [0.9939138576779026, 3000, 5000, "products-dxp-short-0"], "isController": false}, {"data": [0.8368421052631579, 3000, 5000, "downloads-community"], "isController": false}, {"data": [0.9962848297213622, 3000, 5000, "downloads-community-0"], "isController": false}, {"data": [0.7628145386766076, 3000, 5000, "solutions"], "isController": false}, {"data": [0.9003095975232198, 3000, 5000, "downloads-community-1"], "isController": false}, {"data": [0.8773408239700374, 3000, 5000, "products-dxp-short-1"], "isController": false}, {"data": [0.9410304158907511, 3000, 5000, "downloads-en-3"], "isController": false}, {"data": [0.9975323874151758, 3000, 5000, "downloads-en-2"], "isController": false}, {"data": [0.9968963376784605, 3000, 5000, "downloads-fixpacks"], "isController": false}, {"data": [0.9166253101736973, 3000, 5000, "careers"], "isController": false}, {"data": [0.9975323874151758, 3000, 5000, "downloads-en-1"], "isController": false}, {"data": [0.9972239358420728, 3000, 5000, "downloads-en-0"], "isController": false}, {"data": [0.8323996265172736, 3000, 5000, "solutions-portals"], "isController": false}, {"data": [0.8148837209302325, 3000, 5000, "products-platform"], "isController": false}, {"data": [0.9930209371884346, 3000, 5000, "home-root-0"], "isController": false}, {"data": [0.9962940086473132, 3000, 5000, "download-thanks-0"], "isController": false}, {"data": [0.9549256505576208, 3000, 5000, "products-trial-1"], "isController": false}, {"data": [0.9314391599752934, 3000, 5000, "download-thanks-1"], "isController": false}, {"data": [0.9953531598513011, 3000, 5000, "products-trial-0"], "isController": false}, {"data": [0.9975232198142415, 3000, 5000, "download-ide-0"], "isController": false}, {"data": [0.9987616099071207, 3000, 5000, "download-ide-1"], "isController": false}, {"data": [0.82901296111665, 3000, 5000, "home-root-2"], "isController": false}, {"data": [0.996594427244582, 3000, 5000, "download-ide-2"], "isController": false}, {"data": [0.9980059820538385, 3000, 5000, "home-root-1"], "isController": false}, {"data": [0.942472266244057, 3000, 5000, "resources-gartner-2"], "isController": false}, {"data": [0.8852091633466136, 3000, 5000, "subscription-services"], "isController": false}, {"data": [0.9958795562599049, 3000, 5000, "resources-gartner-0"], "isController": false}, {"data": [0.997147385103011, 3000, 5000, "resources-gartner-1"], "isController": false}, {"data": [0.8516674962667994, 3000, 5000, "our-story"], "isController": false}, {"data": [0.8000927643784786, 3000, 5000, "products-dxp-short"], "isController": false}, {"data": [0.9939534883720931, 3000, 5000, "products-platform-0"], "isController": false}, {"data": [0.8606713109563014, 3000, 5000, "resources-home"], "isController": false}, {"data": [0.9976765799256505, 3000, 5000, "products-dxp-long-1"], "isController": false}, {"data": [0.9972118959107806, 3000, 5000, "products-dxp-long-2"], "isController": false}, {"data": [0.995817843866171, 3000, 5000, "products-dxp-long-0"], "isController": false}, {"data": [0.875703564727955, 3000, 5000, "products-dxp-long-3"], "isController": false}, {"data": [0.7681592039800995, 3000, 5000, "home-fr"], "isController": false}, {"data": [0.8950770760815515, 3000, 5000, "gartner"], "isController": false}, {"data": [0.8257248611967921, 3000, 5000, "downloads-en"], "isController": false}, {"data": [0.7100371747211895, 3000, 5000, "products-dxp-long"], "isController": false}, {"data": [0.9950617283950617, 3000, 5000, "downloads-es-0"], "isController": false}, {"data": [0.9829721362229102, 3000, 5000, "download-ide"], "isController": false}, {"data": [0.946604938271605, 3000, 5000, "downloads-es-2"], "isController": false}, {"data": [0.7082922013820335, 3000, 5000, "home-root"], "isController": false}, {"data": [0.7391304347826086, 3000, 5000, "home"], "isController": false}, {"data": [0.9981481481481481, 3000, 5000, "downloads-es-1"], "isController": false}, {"data": [0.9158921933085502, 3000, 5000, "products-trial"], "isController": false}, {"data": [0.9944237918215614, 3000, 5000, "downloads-enterprise"], "isController": false}, {"data": [0.998139534883721, 3000, 5000, "products-platform-1"], "isController": false}, {"data": [0.998139534883721, 3000, 5000, "products-platform-2"], "isController": false}, {"data": [0.9108121574489287, 3000, 5000, "partners"], "isController": false}, {"data": [0.9404651162790698, 3000, 5000, "products-platform-3"], "isController": false}, {"data": [0.8688271604938271, 3000, 5000, "downloads-es"], "isController": false}, {"data": [0.8847619047619047, 3000, 5000, "blog-awesome-examples"], "isController": false}, {"data": [0.7857852882703777, 3000, 5000, "home-it"], "isController": false}, {"data": [0.7801980198019802, 3000, 5000, "home-es"], "isController": false}, {"data": [0.7863545816733067, 3000, 5000, "home-zh"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 122211, 0, 0.0, 1570.5085466938451, 3, 89653, 3598.800000000003, 5014.700000000004, 33304.660000002135, 33.748626841716614, 5774.411384595401, 14.023753282393695], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["products-dpx-long-es-2", 1076, 0, 0.0, 2460.7973977695183, 799, 47470, 4477.5, 5919.199999999999, 11934.130000000008, 0.30355049700751685, 123.19618178488962, 0.09248804205697778], "isController": false}, {"data": ["products-dpx-long-es-1", 1076, 0, 0.0, 308.2518587360596, 144, 13265, 402.30000000000007, 464.5999999999999, 1296.4100000000012, 0.3036413825954791, 0.11890643986404993, 0.05811885838741593], "isController": false}, {"data": ["products-dpx-long-es-0", 1076, 0, 0.0, 658.8754646840148, 293, 34263, 840.9000000000002, 1250.4499999999998, 2312.6600000000008, 0.3036297297526095, 0.1114890413935363, 0.0969598844034212], "isController": false}, {"data": ["home-1", 1002, 0, 0.0, 2749.9790419161723, 915, 57295, 4733.700000000002, 6398.049999999999, 11332.840000000002, 0.2797669055853704, 136.52895939319131, 0.08305580009565683], "isController": false}, {"data": ["home-0", 1002, 0, 0.0, 632.918163672654, 307, 11931, 837.7, 1263.6999999999998, 2441.820000000003, 0.283212454564469, 0.06831394167717172, 0.0832489734608449], "isController": false}, {"data": ["products-sync", 1075, 0, 0.0, 2539.418604651163, 1032, 45871, 3715.0, 5128.199999999999, 9155.64000000001, 0.30015532689148816, 81.41577506719291, 0.19375260847194695], "isController": false}, {"data": ["download-thanks", 1619, 0, 0.0, 2743.9944410129688, 1063, 54392, 4201.0, 5514.0, 11521.799999999928, 0.45069346664283755, 134.07786629579104, 0.2909261537606598], "isController": false}, {"data": ["home-de", 1007, 0, 0.0, 3194.5223435948296, 1132, 48443, 5366.000000000002, 7484.799999999994, 14330.079999999945, 0.2803710475547719, 136.14023810422466, 0.0832351547428229], "isController": false}, {"data": ["solutions-0", 1073, 0, 0.0, 770.7110904007461, 298, 37758, 858.6, 1403.7999999999997, 2855.419999999999, 0.30063896286562447, 0.07398536976771226, 0.08983937757507919], "isController": false}, {"data": ["home-pt", 1009, 0, 0.0, 3409.454905847371, 1110, 58603, 5159.0, 7912.5, 41336.29999999999, 0.279994827449372, 135.4835721633076, 0.08312346439903232], "isController": false}, {"data": ["solutions-1", 1073, 0, 0.0, 199.51817334575975, 75, 21339, 215.60000000000002, 334.29999999999814, 939.0799999999995, 0.2999325501171079, 0.20913265701524905, 0.09050699022088508], "isController": false}, {"data": ["solutions-2", 1073, 0, 0.0, 2427.6663560111833, 812, 53084, 4251.400000000001, 5945.799999999996, 9596.279999999995, 0.2991823927955318, 121.6075182759524, 0.09407883835953247], "isController": false}, {"data": ["solutions-portals-0", 1071, 0, 0.0, 655.3081232493001, 293, 39406, 849.8000000000001, 1393.999999999999, 2311.4399999999996, 0.3030132417635427, 0.07693695591652452, 0.09291616983764885], "isController": false}, {"data": ["products-sync-1", 1075, 0, 0.0, 1887.7637209302316, 719, 44115, 2876.0, 4118.199999999996, 8357.720000000008, 0.3001813095109446, 81.34220763745373, 0.09732440894300158], "isController": false}, {"data": ["downloads-enterprise-2", 1614, 0, 0.0, 88.70508054522925, 24, 24414, 120.0, 162.0, 270.7999999999993, 0.4515289037247498, 0.13789212585626834, 0.10294645689689419], "isController": false}, {"data": ["downloads-enterprise-3", 1614, 0, 0.0, 119.66109045848835, 63, 31984, 139.0, 157.0, 337.84999999999263, 0.44953609212203316, 2.2665574644785718, 0.1163350238401746], "isController": false}, {"data": ["downloads-enterprise-0", 1614, 0, 0.0, 688.0018587360605, 291, 39959, 832.5, 1183.5, 2262.2999999999984, 0.4524945232462753, 0.17984889742308013, 0.15200987890304563], "isController": false}, {"data": ["downloads-fixpacks-0", 1611, 0, 0.0, 253.0235878336437, 71, 8578, 638.1999999999996, 752.3999999999999, 1484.919999999996, 0.45617595989502574, 0.18576696804318918, 0.15770145488558507], "isController": false}, {"data": ["products-sync-0", 1075, 0, 0.0, 651.6027906976752, 301, 28524, 822.0, 976.5999999999995, 2268.16, 0.3003067598632613, 0.08064878804921567, 0.09648527733887985], "isController": false}, {"data": ["downloads-enterprise-1", 1614, 0, 0.0, 146.172242874845, 24, 50409, 132.0, 175.0, 330.29999999999836, 0.4515395147432967, 0.23988036720737638, 0.0731987885228391], "isController": false}, {"data": ["downloads-fixpacks-1", 1611, 0, 0.0, 70.4866542520174, 3, 36280, 49.799999999999955, 68.0, 151.75999999999976, 0.4561828061274044, 0.2423471157551836, 0.07840641980314764], "isController": false}, {"data": ["solutions-portals-1", 1071, 0, 0.0, 157.94864612511662, 75, 2243, 212.80000000000007, 268.4, 767.5599999999993, 0.3030104126939578, 0.2154214652746106, 0.09380302814842248], "isController": false}, {"data": ["resources-gartner", 3155, 0, 0.0, 2769.751505546747, 1141, 51834, 4269.8, 5464.199999999999, 10535.960000000003, 0.877384476551865, 227.8645734660893, 0.950214242671893], "isController": false}, {"data": ["solutions-portals-2", 1071, 0, 0.0, 2070.6900093370677, 713, 48305, 3509.600000000002, 4944.999999999999, 9955.839999999993, 0.29898646102204796, 89.89313424814885, 0.09810493252285948], "isController": false}, {"data": ["products-dpx-long-es", 1076, 0, 0.0, 3428.026951672862, 1274, 49470, 5610.5, 7232.0, 13844.850000000019, 0.30351145262104423, 123.41063676388953, 0.24749224896344918], "isController": false}, {"data": ["downloads-fixpacks-2", 1611, 0, 0.0, 20.838609559279984, 4, 790, 43.0, 58.0, 136.75999999999976, 0.4561813851943514, 0.13899276580140396, 0.10424457435105296], "isController": false}, {"data": ["downloads-fixpacks-3", 1611, 0, 0.0, 100.91309745499692, 63, 1019, 140.0, 160.79999999999973, 256.7999999999988, 0.45615994309751573, 2.299954869348119, 0.11804920402425945], "isController": false}, {"data": ["products-dxp-short-0", 1068, 0, 0.0, 688.4859550561797, 301, 30928, 883.0, 1388.7999999999984, 2602.5899999999897, 0.30248376557168294, 0.07532554709060466, 0.09127683941567387], "isController": false}, {"data": ["downloads-community", 1615, 0, 0.0, 2873.339938080491, 965, 46336, 4714.600000000002, 6234.599999999992, 10561.799999999981, 0.4514470765657037, 127.74180257323086, 0.2799500914250213], "isController": false}, {"data": ["downloads-community-0", 1615, 0, 0.0, 655.5102167182662, 74, 37762, 866.4000000000001, 1361.0, 2328.0, 0.45667161889099206, 0.11684371498968742, 0.1409260073921421], "isController": false}, {"data": ["solutions", 1073, 0, 0.0, 3398.027958993477, 1197, 53652, 5550.0, 7271.399999999999, 20025.919999999747, 0.2991486947442669, 121.8760258841684, 0.27373274118689267], "isController": false}, {"data": ["downloads-community-1", 1615, 0, 0.0, 2217.77770897833, 872, 42794, 3784.8, 5057.59999999999, 9775.799999999988, 0.45145742476944223, 127.62922109416299, 0.1406395688490743], "isController": false}, {"data": ["products-dxp-short-1", 1068, 0, 0.0, 2362.270599250936, 806, 45391, 4277.1, 5662.499999999998, 10962.62999999999, 0.2986922147328537, 121.22393595574307, 0.09100778417641635], "isController": false}, {"data": ["downloads-en-3", 1611, 0, 0.0, 1832.3209186840484, 685, 59331, 2925.6, 4059.7999999999984, 7851.719999999962, 0.45093007476874086, 107.9401530344816, 0.14311745537093828], "isController": false}, {"data": ["downloads-en-2", 1621, 0, 0.0, 270.06662553979004, 77, 28399, 652.1999999999998, 769.7999999999997, 1620.56, 0.45723589197385994, 0.7810999298068158, 0.14336055705068465], "isController": false}, {"data": ["downloads-fixpacks", 1611, 0, 0.0, 445.4779639975165, 146, 42359, 795.8, 912.0, 1767.2799999999993, 0.45614883533395134, 2.866966703329405, 0.45837612456898036], "isController": false}, {"data": ["careers", 2015, 0, 0.0, 2300.8327543424284, 648, 61257, 3422.400000000001, 4612.399999999995, 11418.279999999968, 0.5597827098539259, 124.6270533425348, 0.1657731210400235], "isController": false}, {"data": ["downloads-en-1", 1621, 0, 0.0, 337.69833436150566, 144, 17179, 416.0, 557.8999999999999, 1407.1399999999996, 0.45722789580958106, 0.18351627458763461, 0.09188222951063359], "isController": false}, {"data": ["downloads-en-0", 1621, 0, 0.0, 596.5206662553996, 74, 34074, 821.8, 1154.8999999999999, 2227.499999999998, 0.4572117753609392, 0.18306330849412605, 0.13620906160033147], "isController": false}, {"data": ["solutions-portals", 1071, 0, 0.0, 2884.1251167133505, 1106, 49088, 4593.400000000001, 6313.799999999999, 10883.559999999998, 0.2989471533448167, 90.1697533121621, 0.2823065403168338], "isController": false}, {"data": ["products-platform", 1075, 0, 0.0, 3088.933953488368, 1307, 48608, 4732.2, 5817.799999999998, 14535.080000000038, 0.30051697305886305, 77.54727741319323, 0.3492335917383272], "isController": false}, {"data": ["home-root-0", 1003, 0, 0.0, 748.0239282153545, 303, 41924, 844.0, 1351.7999999999986, 2652.4000000000033, 0.2800588598281673, 0.0661857852328286, 0.08122800914938055], "isController": false}, {"data": ["download-thanks-0", 1619, 0, 0.0, 711.2625077208166, 83, 48184, 853.0, 1306.0, 2281.199999999998, 0.4572199951143262, 0.12278857290667938, 0.14689978358653644], "isController": false}, {"data": ["products-trial-1", 1076, 0, 0.0, 1670.1626394052037, 685, 45843, 2616.6000000000004, 3545.0499999999997, 6166.250000000002, 0.30019632728207096, 71.86136051814277, 0.09527715465495418], "isController": false}, {"data": ["download-thanks-1", 1619, 0, 0.0, 2032.6590487955568, 740, 53892, 3129.0, 4355.0, 8589.399999999969, 0.450734496779573, 133.96902558636899, 0.1461365751277522], "isController": false}, {"data": ["products-trial-0", 1076, 0, 0.0, 713.5659851301126, 299, 46316, 846.0, 1246.0499999999997, 2486.6000000000004, 0.30219108193675276, 0.07908907222563451, 0.09502493006214295], "isController": false}, {"data": ["download-ide-0", 1615, 0, 0.0, 667.25386996904, 296, 37287, 854.0, 1305.1999999999998, 2244.5199999999995, 0.45670274194145893, 0.17750751102802798, 0.149409588428114], "isController": false}, {"data": ["download-ide-1", 1615, 0, 0.0, 94.67182662538696, 23, 19331, 138.0, 184.0, 364.079999999999, 0.4567223735989016, 0.2899116629289903, 0.07002481704592534], "isController": false}, {"data": ["home-root-2", 1003, 0, 0.0, 2779.9092721834477, 919, 50709, 5015.400000000001, 6615.199999999998, 11453.360000000037, 0.2799474714714547, 136.79369025516598, 0.08584326761917654], "isController": false}, {"data": ["download-ide-2", 1615, 0, 0.0, 867.4625386996902, 460, 39662, 1252.8000000000002, 1612.0, 2532.479999999984, 0.4566548322846766, 20.9239823476222, 0.13351222544865277], "isController": false}, {"data": ["home-root-1", 1003, 0, 0.0, 183.63010967098703, 76, 28962, 208.0, 252.5999999999999, 703.2800000000007, 0.28004212637689707, 0.23847337324282641, 0.08177011307294163], "isController": false}, {"data": ["resources-gartner-2", 3155, 0, 0.0, 1752.876386687797, 663, 51213, 2805.8, 3909.5999999999995, 8654.24000000001, 0.8774964844514854, 227.1249965625014, 0.3084948578149753], "isController": false}, {"data": ["subscription-services", 2008, 0, 0.0, 2503.418824701195, 993, 54451, 3899.7000000000007, 5221.449999999999, 9070.30000000001, 0.5617416452819717, 171.57692334793265, 0.1744471124996748], "isController": false}, {"data": ["resources-gartner-0", 3155, 0, 0.0, 692.0624405705234, 292, 39520, 856.0, 1306.999999999999, 2340.2000000000003, 0.8790428658079072, 0.3845812537909594, 0.4335123508134699], "isController": false}, {"data": ["resources-gartner-1", 3155, 0, 0.0, 324.68431061806604, 143, 16600, 410.0, 483.1999999999998, 1380.0, 0.8780938544562915, 0.38502357485437, 0.2092333012571632], "isController": false}, {"data": ["our-story", 2009, 0, 0.0, 2775.580388252867, 1016, 62534, 4315.0, 6185.5, 11119.400000000005, 0.5614535974950617, 211.33351220525782, 0.17216448204438417], "isController": false}, {"data": ["products-dxp-short", 1078, 0, 0.0, 3044.5853432282006, 1143, 46548, 5244.6, 6877.799999999997, 12590.290000000005, 0.29991405987653447, 121.79740905020932, 0.18062082123452752], "isController": false}, {"data": ["products-platform-0", 1075, 0, 0.0, 783.5953488372086, 300, 39485, 867.1999999999999, 1299.7999999999977, 2835.880000000001, 0.30374851092590455, 0.11598209743362177, 0.09551466847474734], "isController": false}, {"data": ["resources-home", 3158, 0, 0.0, 2774.5490816972797, 930, 57622, 4298.0, 5918.499999999992, 10368.33999999999, 0.8755788094401702, 294.1348774869814, 0.26123601998970264], "isController": false}, {"data": ["products-dxp-long-1", 1076, 0, 0.0, 311.7304832713756, 145, 12789, 405.0, 467.0, 1349.6000000000004, 0.3037629339208342, 0.11806410908251173, 0.05725219360031348], "isController": false}, {"data": ["products-dxp-long-2", 1076, 0, 0.0, 216.54925650557612, 77, 24054, 218.30000000000007, 495.1999999999998, 1205.3000000000002, 0.3037669644392211, 1.222170854307887, 0.09166405469894463], "isController": false}, {"data": ["products-dxp-long-0", 1076, 0, 0.0, 713.1143122676573, 299, 56921, 828.6000000000001, 1177.75, 2271.5200000000004, 0.3037551304552064, 0.11064517935526562, 0.09611002174559265], "isController": false}, {"data": ["products-dxp-long-3", 1066, 0, 0.0, 2376.9287054408996, 815, 42414, 4270.700000000002, 5628.099999999999, 11013.579999999918, 0.3023518206628255, 122.7091777445093, 0.09212282035820465], "isController": false}, {"data": ["home-fr", 1005, 0, 0.0, 3160.8298507462678, 1187, 43687, 5452.599999999999, 7499.199999999999, 11720.8, 0.2799247183553462, 137.2807719323628, 0.08310265076174339], "isController": false}, {"data": ["gartner", 2011, 0, 0.0, 2403.086524117352, 728, 51924, 3762.3999999999987, 5181.4, 9297.839999999953, 0.5615945823297378, 160.84361691451113, 0.19524186651307293], "isController": false}, {"data": ["downloads-en", 1621, 0, 0.0, 3025.510795805057, 1132, 60389, 4660.4, 5552.899999999996, 11495.399999999965, 0.4518623082721187, 108.63024538165222, 0.5096237233182415], "isController": false}, {"data": ["products-dxp-long", 1076, 0, 0.0, 3596.434014869889, 1386, 64623, 5744.4000000000015, 7306.3, 15531.750000000022, 0.30354792798917835, 123.49952513333118, 0.33648180264024635], "isController": false}, {"data": ["downloads-es-0", 1620, 0, 0.0, 652.704320987655, 82, 22544, 835.0, 1282.4999999999982, 2293.1099999999997, 0.4573933828729895, 0.18447604211576626, 0.13802202666772825], "isController": false}, {"data": ["download-ide", 1615, 0, 0.0, 1629.5368421052628, 794, 40062, 2280.8, 2687.199999999999, 3942.7599999999966, 0.45661170927716244, 21.389319992160555, 0.3528872747617844], "isController": false}, {"data": ["downloads-es-2", 1620, 0, 0.0, 1754.274074074075, 709, 54794, 2765.8, 3729.0999999999967, 8953.699999999995, 0.4504295346089757, 107.82033467392307, 0.1429585925272628], "isController": false}, {"data": ["home-root", 1013, 0, 0.0, 3698.886475814414, 1197, 51492, 6291.400000000001, 7776.599999999997, 36748.12000000009, 0.2811890103673528, 137.67115540951238, 0.2478110438302329], "isController": false}, {"data": ["home", 1012, 0, 0.0, 3367.9990118577084, 1227, 58054, 5791.0, 7434.699999999998, 12792.730000000001, 0.2811052547516371, 137.21774269676675, 0.16525805885988487], "isController": false}, {"data": ["downloads-es-1", 1620, 0, 0.0, 315.90432098765467, 144, 14664, 409.9000000000001, 464.0, 1336.2199999999993, 0.45737749905983516, 0.1849162935652068, 0.09335146221045464], "isController": false}, {"data": ["products-trial", 1076, 0, 0.0, 2383.7936802973986, 1023, 47843, 3488.6000000000004, 4650.749999999999, 7608.730000000009, 0.3001674354040237, 71.93300379135741, 0.189656572955472], "isController": false}, {"data": ["downloads-enterprise", 1614, 0, 0.0, 1042.7571251548945, 419, 57105, 1105.0, 1452.5, 2514.7, 0.44947349777268336, 2.820937244490747, 0.44265553011834463], "isController": false}, {"data": ["products-platform-1", 1075, 0, 0.0, 314.59999999999985, 144, 12671, 410.4, 581.5999999999998, 1362.88, 0.3037603554024415, 0.12340264438224186, 0.06259124510733902], "isController": false}, {"data": ["products-platform-2", 1075, 0, 0.0, 197.95162790697663, 77, 31892, 221.39999999999998, 427.5999999999991, 792.1600000000001, 0.30373958526408107, 0.08097744802450599, 0.09699496521616652], "isController": false}, {"data": ["partners", 2007, 0, 0.0, 2290.2605879422044, 959, 61070, 3544.0000000000005, 4864.599999999998, 9233.080000000034, 0.5588385736167493, 136.2132683978179, 0.1713626094879485], "isController": false}, {"data": ["products-platform-3", 1075, 0, 0.0, 1792.5888372093, 758, 47284, 2921.8, 3942.1999999999966, 8221.720000000005, 0.30056242919308357, 77.24200776104615, 0.09686093909542731], "isController": false}, {"data": ["downloads-es", 1620, 0, 0.0, 2723.0617283950614, 1178, 55904, 4199.000000000001, 5129.799999999999, 10980.799999999974, 0.4503659223118784, 108.16883091426715, 0.37076022705948586], "isController": false}, {"data": ["blog-awesome-examples", 3150, 0, 0.0, 2498.040952380951, 924, 89653, 4021.8, 5421.849999999998, 10519.219999999983, 0.876907029203231, 276.768692987124, 0.30400585485072956], "isController": false}, {"data": ["home-it", 1006, 0, 0.0, 3397.554671968193, 1180, 68337, 5103.900000000003, 7277.949999999999, 41044.06999999989, 0.28022042149496756, 133.94231103523202, 0.0831904376313185], "isController": false}, {"data": ["home-es", 1010, 0, 0.0, 3182.7445544554494, 1115, 51616, 5089.7, 7150.549999999997, 13399.87999999999, 0.2805830682841956, 138.68237434766172, 0.08329809839687058], "isController": false}, {"data": ["home-zh", 1004, 0, 0.0, 3193.6882470119554, 1160, 45595, 5358.0, 7586.75, 12997.000000000004, 0.2798802870612793, 136.584296685701, 0.08308946022131729], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 122211, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
