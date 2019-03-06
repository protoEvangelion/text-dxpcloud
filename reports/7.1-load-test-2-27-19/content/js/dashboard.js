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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9777420446851727, 3000, 5000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9538784067085954, 3000, 5000, "products-dpx-long-es-2"], "isController": false}, {"data": [0.9996505939902166, 3000, 5000, "products-dpx-long-es-1"], "isController": false}, {"data": [0.9986023759608665, 3000, 5000, "products-dpx-long-es-0"], "isController": false}, {"data": [0.9486326681448632, 3000, 5000, "home-1"], "isController": false}, {"data": [0.9985218033998522, 3000, 5000, "home-0"], "isController": false}, {"data": [0.967436974789916, 3000, 5000, "products-sync"], "isController": false}, {"data": [0.949636803874092, 3000, 5000, "download-thanks"], "isController": false}, {"data": [0.9414580265095729, 3000, 5000, "home-de"], "isController": false}, {"data": [0.9985974754558204, 3000, 5000, "solutions-0"], "isController": false}, {"data": [0.930514705882353, 3000, 5000, "home-pt"], "isController": false}, {"data": [1.0, 3000, 5000, "solutions-1"], "isController": false}, {"data": [0.9631837307152875, 3000, 5000, "solutions-2"], "isController": false}, {"data": [0.9989473684210526, 3000, 5000, "solutions-portals-0"], "isController": false}, {"data": [0.978641456582633, 3000, 5000, "products-sync-1"], "isController": false}, {"data": [0.9987858183584264, 3000, 5000, "downloads-enterprise-2"], "isController": false}, {"data": [0.9995143273433705, 3000, 5000, "downloads-enterprise-3"], "isController": false}, {"data": [0.9985429820301117, 3000, 5000, "downloads-enterprise-0"], "isController": false}, {"data": [1.0, 3000, 5000, "downloads-fixpacks-0"], "isController": false}, {"data": [0.9992997198879552, 3000, 5000, "products-sync-0"], "isController": false}, {"data": [0.9995143273433705, 3000, 5000, "downloads-enterprise-1"], "isController": false}, {"data": [0.999757045675413, 3000, 5000, "downloads-fixpacks-1"], "isController": false}, {"data": [1.0, 3000, 5000, "solutions-portals-1"], "isController": false}, {"data": [0.9566010211524435, 3000, 5000, "resources-gartner"], "isController": false}, {"data": [0.9652631578947368, 3000, 5000, "solutions-portals-2"], "isController": false}, {"data": [0.926974143955276, 3000, 5000, "products-dpx-long-es"], "isController": false}, {"data": [0.999514091350826, 3000, 5000, "downloads-fixpacks-2"], "isController": false}, {"data": [0.999514091350826, 3000, 5000, "downloads-fixpacks-3"], "isController": false}, {"data": [0.9989473684210526, 3000, 5000, "products-dxp-short-0"], "isController": false}, {"data": [0.9476490547746, 3000, 5000, "downloads-community"], "isController": false}, {"data": [0.9990305380513815, 3000, 5000, "downloads-community-0"], "isController": false}, {"data": [0.9431977559607293, 3000, 5000, "solutions"], "isController": false}, {"data": [0.9580707707222491, 3000, 5000, "downloads-community-1"], "isController": false}, {"data": [0.9557894736842105, 3000, 5000, "products-dxp-short-1"], "isController": false}, {"data": [0.9795719844357976, 3000, 5000, "downloads-en-3"], "isController": false}, {"data": [0.9995159728944821, 3000, 5000, "downloads-en-2"], "isController": false}, {"data": [0.999271137026239, 3000, 5000, "downloads-fixpacks"], "isController": false}, {"data": [0.9727619047619047, 3000, 5000, "careers"], "isController": false}, {"data": [0.9990319457889641, 3000, 5000, "downloads-en-1"], "isController": false}, {"data": [0.9978218780251694, 3000, 5000, "downloads-en-0"], "isController": false}, {"data": [0.9449122807017544, 3000, 5000, "solutions-portals"], "isController": false}, {"data": [0.9551820728291317, 3000, 5000, "products-platform"], "isController": false}, {"data": [0.9985239852398524, 3000, 5000, "home-root-0"], "isController": false}, {"data": [0.999273607748184, 3000, 5000, "download-thanks-0"], "isController": false}, {"data": [0.9668280871670702, 3000, 5000, "download-thanks-1"], "isController": false}, {"data": [0.9776223776223776, 3000, 5000, "products-trial-1"], "isController": false}, {"data": [0.9989510489510489, 3000, 5000, "products-trial-0"], "isController": false}, {"data": [0.9963680387409201, 3000, 5000, "download-ide-0"], "isController": false}, {"data": [0.9995157384987894, 3000, 5000, "download-ide-1"], "isController": false}, {"data": [0.997820823244552, 3000, 5000, "download-ide-2"], "isController": false}, {"data": [0.9549815498154982, 3000, 5000, "home-root-2"], "isController": false}, {"data": [1.0, 3000, 5000, "home-root-1"], "isController": false}, {"data": [0.974106491611962, 3000, 5000, "resources-gartner-2"], "isController": false}, {"data": [0.9642857142857143, 3000, 5000, "subscription-services"], "isController": false}, {"data": [0.9990274738633601, 3000, 5000, "resources-gartner-0"], "isController": false}, {"data": [0.99975686846584, 3000, 5000, "resources-gartner-1"], "isController": false}, {"data": [0.947348340328119, 3000, 5000, "our-story"], "isController": false}, {"data": [0.9421602787456446, 3000, 5000, "products-dxp-short"], "isController": false}, {"data": [0.9992997198879552, 3000, 5000, "products-platform-0"], "isController": false}, {"data": [0.9574829931972789, 3000, 5000, "resources-home"], "isController": false}, {"data": [0.9986033519553073, 3000, 5000, "products-dxp-long-1"], "isController": false}, {"data": [0.9986033519553073, 3000, 5000, "products-dxp-long-2"], "isController": false}, {"data": [0.9993016759776536, 3000, 5000, "products-dxp-long-0"], "isController": false}, {"data": [0.9567510548523207, 3000, 5000, "products-dxp-long-3"], "isController": false}, {"data": [0.9520648967551623, 3000, 5000, "home-fr"], "isController": false}, {"data": [0.9685474647350362, 3000, 5000, "gartner"], "isController": false}, {"data": [0.9564375605033882, 3000, 5000, "downloads-en"], "isController": false}, {"data": [0.9305167597765364, 3000, 5000, "products-dxp-long"], "isController": false}, {"data": [0.9975786924939467, 3000, 5000, "downloads-es-0"], "isController": false}, {"data": [0.9915254237288136, 3000, 5000, "download-ide"], "isController": false}, {"data": [0.9794188861985472, 3000, 5000, "downloads-es-2"], "isController": false}, {"data": [0.936996336996337, 3000, 5000, "home-root"], "isController": false}, {"data": [0.9343360234776229, 3000, 5000, "home"], "isController": false}, {"data": [0.997820823244552, 3000, 5000, "downloads-es-1"], "isController": false}, {"data": [0.9685314685314685, 3000, 5000, "products-trial"], "isController": false}, {"data": [0.9963574550752793, 3000, 5000, "downloads-enterprise"], "isController": false}, {"data": [0.9989495798319328, 3000, 5000, "products-platform-1"], "isController": false}, {"data": [0.9992997198879552, 3000, 5000, "products-platform-2"], "isController": false}, {"data": [0.9738149847094801, 3000, 5000, "partners"], "isController": false}, {"data": [0.9793417366946778, 3000, 5000, "products-platform-3"], "isController": false}, {"data": [0.9619854721549637, 3000, 5000, "downloads-es"], "isController": false}, {"data": [0.9633909024568231, 3000, 5000, "blog-awesome-examples"], "isController": false}, {"data": [0.9414148857774502, 3000, 5000, "home-it"], "isController": false}, {"data": [0.9468085106382979, 3000, 5000, "home-es"], "isController": false}, {"data": [0.9372693726937269, 3000, 5000, "home-zh"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 159516, 0, 0.0, 1058.31431956668, 2, 257938, 2206.0, 3635.0, 16073.830000000027, 44.28372498983936, 7644.289971717475, 18.4017462898229], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["products-dpx-long-es-2", 1431, 0, 0.0, 1645.1174004192862, 840, 31410, 2357.3999999999996, 3374.399999999996, 9853.520000000015, 0.4013492739953437, 162.89691541933917, 0.12228610692045627], "isController": false}, {"data": ["products-dpx-long-es-1", 1431, 0, 0.0, 202.50663871418567, 144, 4947, 243.0, 286.39999999999986, 721.6400000000094, 0.40150760353270576, 0.1572310048990381, 0.07685106473868196], "isController": false}, {"data": ["products-dpx-long-es-0", 1431, 0, 0.0, 438.053109713488, 293, 34018, 499.5999999999999, 627.3999999999999, 1399.0, 0.40149273371099653, 0.1474231131595065, 0.1282110585190389], "isController": false}, {"data": ["home-1", 1353, 0, 0.0, 1824.3754619364388, 953, 47400, 2319.2000000000057, 3741.0999999999995, 10722.340000000004, 0.38107115637774547, 185.96642205623235, 0.11313049954964317], "isController": false}, {"data": ["home-0", 1353, 0, 0.0, 421.3776792313381, 301, 8047, 501.2000000000003, 635.2999999999995, 1322.9000000000024, 0.38119322777689973, 0.09194797584071703, 0.11204996246176446], "isController": false}, {"data": ["products-sync", 1428, 0, 0.0, 1734.4404761904755, 1118, 37966, 2108.3, 2986.2999999999997, 6056.190000000007, 0.40142703374938754, 108.87083115354892, 0.2591242864339308], "isController": false}, {"data": ["download-thanks", 2065, 0, 0.0, 1913.2702179176758, 1121, 82973, 2471.4000000000005, 3541.699999999996, 9708.039999999983, 0.5794718247609855, 172.37799522391745, 0.374053590006847], "isController": false}, {"data": ["home-de", 1358, 0, 0.0, 2086.6413843888054, 1189, 38066, 2758.900000000008, 3979.999999999999, 11240.870000000017, 0.38047368693851763, 184.74410565000272, 0.11295312580987242], "isController": false}, {"data": ["solutions-0", 1426, 0, 0.0, 420.3036465638151, 296, 9263, 513.0, 645.6499999999999, 1356.38, 0.40131234201492566, 0.09876045916773561, 0.11992341470367895], "isController": false}, {"data": ["home-pt", 1360, 0, 0.0, 2145.960294117646, 1199, 39163, 2804.3000000000043, 4697.200000000001, 9004.820000000003, 0.3807533653278147, 184.23849380521625, 0.11303615533169498], "isController": false}, {"data": ["solutions-1", 1426, 0, 0.0, 107.06872370266485, 76, 1674, 131.29999999999995, 163.0, 428.1200000000008, 0.40134103067528865, 0.2798413045919493, 0.12110779148307049], "isController": false}, {"data": ["solutions-2", 1426, 0, 0.0, 1594.3267882187945, 830, 37983, 2063.8999999999996, 3049.6499999999996, 7674.17, 0.40123928352057364, 163.09888592350032, 0.12617094657580538], "isController": false}, {"data": ["solutions-portals-0", 1425, 0, 0.0, 416.96421052631507, 295, 3555, 500.0, 637.1000000000001, 1401.9800000000002, 0.40155945968413476, 0.10195845656042483, 0.12313444369220539], "isController": false}, {"data": ["products-sync-1", 1428, 0, 0.0, 1293.5602240896308, 766, 37637, 1642.6000000000008, 2274.55, 5256.340000000006, 0.40146280902515386, 108.77271902951988, 0.1301617701136241], "isController": false}, {"data": ["downloads-enterprise-2", 2059, 0, 0.0, 68.94560466245754, 22, 13536, 80.0, 105.0, 261.0000000000009, 0.5797894792566868, 0.17697359325022546, 0.13225446538566699], "isController": false}, {"data": ["downloads-enterprise-3", 2059, 0, 0.0, 99.81981544439034, 61, 11596, 129.0, 152.0, 220.4000000000001, 0.5797834386367232, 2.9232635680482444, 0.1500416125378239], "isController": false}, {"data": ["downloads-enterprise-0", 2059, 0, 0.0, 419.9961146187467, 293, 9913, 506.0, 640.0, 1401.8000000000006, 0.5797527477014028, 0.23042907061960052, 0.19476068868094001], "isController": false}, {"data": ["downloads-fixpacks-0", 2058, 0, 0.0, 114.92954324586977, 71, 1755, 145.0, 313.0, 523.6100000000017, 0.579706879019287, 0.2360720396006276, 0.20040647966096442], "isController": false}, {"data": ["products-sync-0", 1428, 0, 0.0, 440.8417366946786, 302, 36599, 518.5000000000007, 650.3999999999996, 1312.2300000000005, 0.4015990843090907, 0.107851316586914, 0.1290293932985262], "isController": false}, {"data": ["downloads-enterprise-1", 2059, 0, 0.0, 70.61049052938316, 23, 30812, 80.0, 113.0, 266.0, 0.5797917649294972, 0.30801437511879537, 0.0939896806428677], "isController": false}, {"data": ["downloads-fixpacks-1", 2058, 0, 0.0, 15.836248785228376, 2, 4345, 26.0, 40.0, 87.0, 0.5797155337565989, 0.3079738773081932, 0.09963860736441545], "isController": false}, {"data": ["solutions-portals-1", 1425, 0, 0.0, 104.9073684210527, 76, 696, 133.4000000000001, 163.70000000000005, 396.4000000000001, 0.4015857140320812, 0.28550234356968274, 0.12431901498844701], "isController": false}, {"data": ["resources-gartner", 4113, 0, 0.0, 1845.7362022854343, 1142, 69384, 2316.7999999999997, 3336.899999999999, 8192.720000000007, 1.1495746741404391, 298.5547913836751, 1.2449983531462376], "isController": false}, {"data": ["solutions-portals-2", 1425, 0, 0.0, 1378.1333333333314, 761, 22867, 1908.0000000000005, 2819.200000000003, 7861.18, 0.40148320574619667, 120.71806192513944, 0.13173667688547078], "isController": false}, {"data": ["products-dpx-long-es", 1431, 0, 0.0, 2285.803633822503, 1330, 36184, 3111.2, 4379.799999999999, 11033.320000000018, 0.4012979506883059, 163.18058516010134, 0.3272302625241557], "isController": false}, {"data": ["downloads-fixpacks-2", 2058, 0, 0.0, 25.575801749271122, 3, 24397, 22.0, 36.0, 97.41000000000008, 0.5797153704572766, 0.17663202693620145, 0.1324740202021511], "isController": false}, {"data": ["downloads-fixpacks-3", 2058, 0, 0.0, 100.66958211856168, 61, 8240, 138.0, 157.0999999999999, 235.23000000000025, 0.579695775206485, 2.9228215697178532, 0.150018926200897], "isController": false}, {"data": ["products-dxp-short-0", 1425, 0, 0.0, 423.383859649123, 92, 8592, 530.4000000000001, 642.7, 1346.6200000000001, 0.40168023547200105, 0.10002779301304714, 0.12121014918051594], "isController": false}, {"data": ["downloads-community", 2063, 0, 0.0, 1920.929714008726, 989, 35926, 2494.0, 3620.7999999999993, 9891.319999999978, 0.5790648005229828, 163.8452103544814, 0.3590880354805606], "isController": false}, {"data": ["downloads-community-0", 2063, 0, 0.0, 261.0261754726133, 74, 33685, 441.0, 546.8, 1362.4399999999996, 0.5794924286772067, 0.14826857061858217, 0.17882774166210674], "isController": false}, {"data": ["solutions", 1426, 0, 0.0, 2121.8597475455817, 1241, 38565, 2716.0999999999995, 3832.5999999999995, 9234.900000000001, 0.40114966230006166, 163.44088428270447, 0.36706761091324003], "isController": false}, {"data": ["downloads-community-1", 2063, 0, 0.0, 1659.846340281143, 890, 18612, 2129.0, 3149.5999999999976, 9468.919999999986, 0.5790782914972893, 163.70086498854897, 0.18039645994886258], "isController": false}, {"data": ["products-dxp-short-1", 1425, 0, 0.0, 1677.2778947368424, 837, 54352, 1973.4, 3333.5, 11017.16, 0.40143807796519065, 162.93193048023898, 0.12231316438001903], "isController": false}, {"data": ["downloads-en-3", 2056, 0, 0.0, 1222.2485408560333, 740, 47364, 1533.2999999999995, 2320.749999999999, 6629.630000000022, 0.5794087269212288, 138.68392087942746, 0.18389437133730407], "isController": false}, {"data": ["downloads-en-2", 2066, 0, 0.0, 123.63213939980658, 78, 15256, 142.0, 176.0, 623.9499999999989, 0.5766615094631381, 0.8054397104194864, 0.18091869526286247], "isController": false}, {"data": ["downloads-fixpacks", 2058, 0, 0.0, 257.2089407191448, 147, 33687, 323.0, 474.0999999999999, 878.4800000000023, 0.5796814061978026, 3.6433882131729076, 0.5825118818140028], "isController": false}, {"data": ["careers", 2625, 0, 0.0, 1444.7428571428572, 640, 84509, 1792.8000000000002, 2525.7, 6878.219999999923, 0.7330878722410761, 163.2102940757563, 0.2172209183342903], "isController": false}, {"data": ["downloads-en-1", 2066, 0, 0.0, 214.5140367860598, 143, 10357, 252.0, 309.0, 981.8399999999892, 0.5766524959758531, 0.23144939047468327, 0.11590813731753875], "isController": false}, {"data": ["downloads-en-0", 2066, 0, 0.0, 447.61084220716305, 74, 31635, 505.5999999999999, 651.6499999999999, 1617.5599999999977, 0.5766299634903361, 0.23087723147562286, 0.17189895501867627], "isController": false}, {"data": ["solutions-portals", 1425, 0, 0.0, 1900.155087719298, 1189, 23464, 2492.8000000000006, 3768.500000000002, 9238.800000000007, 0.4014372863402864, 121.0915791244336, 0.37909165614361034], "isController": false}, {"data": ["products-platform", 1428, 0, 0.0, 2041.5917366946783, 1316, 82583, 2438.1000000000004, 3338.1, 8553.090000000004, 0.40142567960552333, 103.57196238317403, 0.466500545635325], "isController": false}, {"data": ["home-root-0", 1355, 0, 0.0, 414.7542435424352, 91, 8685, 502.0, 581.8000000000002, 1096.5600000000013, 0.38109723942159845, 0.09006399603518245, 0.11053308604317845], "isController": false}, {"data": ["download-thanks-0", 2065, 0, 0.0, 429.29297820823297, 301, 8249, 522.4000000000001, 681.3999999999996, 1445.4799999999982, 0.5796037306832672, 0.155655298767479, 0.1862203392527294], "isController": false}, {"data": ["download-thanks-1", 2065, 0, 0.0, 1483.9263922518178, 783, 82099, 1875.0000000000005, 2833.8999999999933, 8878.219999999981, 0.5795256533415056, 172.23837351433406, 0.18789308291931628], "isController": false}, {"data": ["products-trial-1", 1430, 0, 0.0, 1196.2034965034993, 727, 43225, 1475.8000000000002, 2222.800000000003, 5799.840000000018, 0.40149276695338304, 96.09538408038713, 0.12742690357407177], "isController": false}, {"data": ["products-trial-0", 1430, 0, 0.0, 445.5468531468534, 301, 44740, 504.9000000000001, 645.0500000000004, 1382.8700000000013, 0.4015772155759165, 0.1051002868890094, 0.12627721036664563], "isController": false}, {"data": ["download-ide-0", 2065, 0, 0.0, 471.0179176755453, 79, 34326, 527.4000000000001, 702.5999999999985, 1411.2199999999973, 0.5798737475850294, 0.22538061673715012, 0.18970479046971178], "isController": false}, {"data": ["download-ide-1", 2065, 0, 0.0, 73.93075060532688, 23, 33471, 79.40000000000009, 120.0, 304.75999999999885, 0.5799162505451634, 0.36811090122495727, 0.08891294075741275], "isController": false}, {"data": ["download-ide-2", 2065, 0, 0.0, 607.1859564164656, 454, 5866, 726.8000000000002, 970.6999999999998, 1945.6399999999962, 0.5798392286930845, 26.56797783762859, 0.16960330344797958], "isController": false}, {"data": ["home-root-2", 1355, 0, 0.0, 1849.1874538745396, 954, 80868, 2271.4, 3356.4000000000005, 8431.840000000002, 0.38100026206069687, 186.1721833874642, 0.11683015848345588], "isController": false}, {"data": ["home-root-1", 1355, 0, 0.0, 103.37638376383768, 74, 992, 132.0, 160.20000000000005, 372.28000000000065, 0.38109681068376083, 0.32452775284789004, 0.1112772914008247], "isController": false}, {"data": ["resources-gartner-2", 4113, 0, 0.0, 1220.7768052516392, 694, 68534, 1472.6, 2412.699999999995, 7074.120000000005, 1.1497196003571315, 297.585302590814, 0.40419829700055404], "isController": false}, {"data": ["subscription-services", 2618, 0, 0.0, 1739.860198624902, 1016, 82349, 1991.1, 3090.699999999996, 8120.9999999999945, 0.7374020576277736, 225.3554894546647, 0.22899790461487501], "isController": false}, {"data": ["resources-gartner-0", 4113, 0, 0.0, 419.6151227814248, 292, 33546, 505.0, 621.0, 1334.7200000000003, 1.1502591369113206, 0.5032383723987028, 0.5672664688869307], "isController": false}, {"data": ["resources-gartner-1", 4113, 0, 0.0, 205.21030877704843, 144, 15899, 249.0, 297.0, 742.8600000000001, 1.1502948452080137, 0.5043773295882794, 0.274093693584722], "isController": false}, {"data": ["our-story", 2621, 0, 0.0, 1892.6482258679891, 1070, 38160, 2446.0, 3745.3000000000006, 9316.380000000045, 0.737286795843289, 277.51787348210627, 0.22608208388163353], "isController": false}, {"data": ["products-dxp-short", 1435, 0, 0.0, 2112.1756097560965, 1129, 54705, 2555.0000000000005, 4136.400000000002, 11812.200000000015, 0.39955561619272223, 162.270904570161, 0.24104696753645424], "isController": false}, {"data": ["products-platform-0", 1428, 0, 0.0, 424.5805322128855, 289, 25504, 486.0, 623.7499999999998, 1374.3900000000003, 0.40158112726184664, 0.15333810621033403, 0.12627844040851038], "isController": false}, {"data": ["resources-home", 4116, 0, 0.0, 1961.0930515063167, 982, 96897, 2344.3, 3360.0, 9179.859999999982, 1.1445863374321723, 384.503197415212, 0.34162181084904336], "isController": false}, {"data": ["products-dxp-long-1", 1432, 0, 0.0, 218.23324022346387, 144, 14760, 242.70000000000005, 291.6999999999998, 787.230000000005, 0.4014795305717411, 0.15604380192143844, 0.07566948183627542], "isController": false}, {"data": ["products-dxp-long-2", 1432, 0, 0.0, 127.11312849162016, 76, 15946, 134.0, 163.0, 925.4000000000015, 0.4014857214631127, 1.2387681863639524, 0.12115145305869318], "isController": false}, {"data": ["products-dxp-long-0", 1432, 0, 0.0, 429.4483240223461, 295, 32162, 512.1000000000001, 631.0, 1335.0300000000007, 0.4014651234182849, 0.14623680765138697, 0.1270260742065667], "isController": false}, {"data": ["products-dxp-long-3", 1422, 0, 0.0, 1702.9789029535875, 821, 80545, 2121.1000000000013, 3271.9499999999957, 10509.65, 0.4009496472658166, 162.73368738774397, 0.12216434565130352], "isController": false}, {"data": ["home-fr", 1356, 0, 0.0, 2131.7514749262514, 1214, 76257, 2526.3, 3747.5999999999995, 10176.720000000001, 0.3806903521947248, 186.6899286644254, 0.11301744830780894], "isController": false}, {"data": ["gartner", 2623, 0, 0.0, 1610.7140678612284, 767, 80326, 2093.5999999999995, 2882.7999999999997, 7034.079999999993, 0.7375145506587863, 211.22801206325178, 0.2564015430024687], "isController": false}, {"data": ["downloads-en", 2066, 0, 0.0, 2002.2909002904166, 1121, 48270, 2560.5, 3461.099999999998, 8372.969999999941, 0.5764594175081272, 138.57747864775553, 0.650645477248966], "isController": false}, {"data": ["products-dxp-long", 1432, 0, 0.0, 2466.0761173184355, 1390, 81555, 3013.8, 4358.549999999997, 12769.360000000022, 0.401235536467603, 163.2526010918468, 0.4450506251653135], "isController": false}, {"data": ["downloads-es-0", 2065, 0, 0.0, 448.9012106537529, 293, 26869, 525.8000000000002, 642.6999999999998, 1455.34, 0.5795032099987737, 0.23372541575145853, 0.17486962098595807], "isController": false}, {"data": ["download-ide", 2065, 0, 0.0, 1152.2663438256661, 635, 53158, 1384.6000000000004, 1766.199999999999, 3363.879999999989, 0.5797832256499468, 27.15878369788198, 0.44815464422507834], "isController": false}, {"data": ["downloads-es-2", 2065, 0, 0.0, 1222.044067796608, 731, 67648, 1433.8000000000006, 2164.0999999999995, 6965.339999999963, 0.5793962214387824, 138.68093546404657, 0.1838904023121136], "isController": false}, {"data": ["home-root", 1365, 0, 0.0, 2389.3919413919425, 1288, 81861, 2877.0000000000005, 4197.6, 10811.439999999999, 0.37910843139928785, 185.62506014701077, 0.3348281239715122], "isController": false}, {"data": ["home", 1363, 0, 0.0, 2241.437270726342, 1299, 47720, 2843.0000000000036, 4421.4, 11134.319999999974, 0.3813713925008338, 186.17254358691338, 0.2244913003498376], "isController": false}, {"data": ["downloads-es-1", 2065, 0, 0.0, 225.75641646489106, 144, 16487, 247.4000000000001, 305.6999999999998, 1175.6799999999998, 0.5795193104814697, 0.23429784622981295, 0.1182807967681906], "isController": false}, {"data": ["products-trial", 1430, 0, 0.0, 1641.806993006991, 1035, 46473, 2012.5000000000014, 2912.05, 6565.510000000009, 0.40145692367209, 96.19187396573959, 0.25365491173422094], "isController": false}, {"data": ["downloads-enterprise", 2059, 0, 0.0, 659.5614375910632, 422, 31325, 781.0, 948.0, 1938.8000000000006, 0.5797187955588867, 3.638280842187254, 0.5709903600105808], "isController": false}, {"data": ["products-platform-1", 1428, 0, 0.0, 207.54971988795512, 144, 10348, 241.0, 288.0999999999999, 673.2700000000013, 0.40159592194527666, 0.16314834329026864, 0.08275072219770838], "isController": false}, {"data": ["products-platform-2", 1428, 0, 0.0, 118.62885154061638, 78, 12102, 137.10000000000014, 172.54999999999995, 380.6800000000003, 0.4016030373338958, 0.10706799725796246, 0.1282462824298671], "isController": false}, {"data": ["partners", 2616, 0, 0.0, 1527.4048165137608, 992, 108885, 1849.800000000001, 2733.15, 5808.729999999998, 0.7372719135475405, 179.70551246298845, 0.2260775203651638], "isController": false}, {"data": ["products-platform-3", 1428, 0, 0.0, 1290.6540616246507, 783, 81572, 1555.2000000000003, 2244.8499999999995, 6736.500000000009, 0.4014893342446504, 103.16494015387472, 0.12938621123118615], "isController": false}, {"data": ["downloads-es", 2065, 0, 0.0, 1896.8305084745766, 1195, 85211, 2292.4, 3162.2999999999984, 8130.479999999981, 0.579322425613177, 139.1311428691862, 0.4769226609295979], "isController": false}, {"data": ["blog-awesome-examples", 4111, 0, 0.0, 1650.0437849671584, 970, 84105, 1977.0, 3032.199999999999, 7432.120000000005, 1.1504443104917947, 363.10959984700855, 0.39883567404744835], "isController": false}, {"data": ["home-it", 1357, 0, 0.0, 2204.247605011054, 1204, 113466, 2690.8, 4163.0999999999985, 9851.620000000019, 0.38078476456866517, 182.00914303908192, 0.11304547698132246], "isController": false}, {"data": ["home-es", 1363, 0, 0.0, 2097.7776962582557, 1188, 82116, 2580.2000000000007, 4088.399999999997, 8838.79999999997, 0.38143745671048673, 188.52254039042768, 0.11323924496092576], "isController": false}, {"data": ["home-zh", 1355, 0, 0.0, 2327.8929889298943, 1203, 257938, 2744.6000000000017, 4200.800000000001, 10260.6, 0.3808532292840437, 185.8600641436417, 0.11306580244370047], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 159516, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
