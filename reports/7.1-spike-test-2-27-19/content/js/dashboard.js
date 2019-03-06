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

    var data = {"OkPercent": 99.99876124940386, "KoPercent": 0.0012387505961487244};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.732900596458412, 3000, 5000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4800280308339173, 3000, 5000, "products-dpx-long-es-2"], "isController": false}, {"data": [0.9943938332165382, 3000, 5000, "products-dpx-long-es-1"], "isController": false}, {"data": [0.975823405746321, 3000, 5000, "products-dpx-long-es-0"], "isController": false}, {"data": [0.4125523012552301, 3000, 5000, "home-1"], "isController": false}, {"data": [0.9807531380753138, 3000, 5000, "home-0"], "isController": false}, {"data": [0.5177304964539007, 3000, 5000, "products-sync"], "isController": false}, {"data": [0.4745338790359254, 3000, 5000, "download-thanks"], "isController": false}, {"data": [0.35200327064595255, 3000, 5000, "home-de"], "isController": false}, {"data": [0.972636815920398, 3000, 5000, "solutions-0"], "isController": false}, {"data": [0.3780587275693312, 3000, 5000, "home-pt"], "isController": false}, {"data": [0.9975124378109452, 3000, 5000, "solutions-1"], "isController": false}, {"data": [0.43674484719260837, 3000, 5000, "solutions-2"], "isController": false}, {"data": [0.9671663097787295, 3000, 5000, "solutions-portals-0"], "isController": false}, {"data": [0.9956461961503208, 3000, 5000, "downloads-enterprise-2"], "isController": false}, {"data": [0.626241134751773, 3000, 5000, "products-sync-1"], "isController": false}, {"data": [0.9967919340054996, 3000, 5000, "downloads-enterprise-3"], "isController": false}, {"data": [0.9711274060494959, 3000, 5000, "downloads-enterprise-0"], "isController": false}, {"data": [0.9694954128440367, 3000, 5000, "downloads-fixpacks-0"], "isController": false}, {"data": [0.9928964252978918, 3000, 5000, "downloads-enterprise-1"], "isController": false}, {"data": [0.9961009174311927, 3000, 5000, "downloads-fixpacks-1"], "isController": false}, {"data": [0.9652482269503546, 3000, 5000, "products-sync-0"], "isController": false}, {"data": [0.9957173447537473, 3000, 5000, "solutions-portals-1"], "isController": false}, {"data": [0.48314606741573035, 3000, 5000, "resources-gartner"], "isController": false}, {"data": [0.5670949321912919, 3000, 5000, "solutions-portals-2"], "isController": false}, {"data": [0.33391730903994393, 3000, 5000, "products-dpx-long-es"], "isController": false}, {"data": [0.9958715596330275, 3000, 5000, "downloads-fixpacks-2"], "isController": false}, {"data": [0.9963302752293578, 3000, 5000, "downloads-fixpacks-3"], "isController": false}, {"data": [0.9725, 3000, 5000, "products-dxp-short-0"], "isController": false}, {"data": [0.45641259698767683, 3000, 5000, "downloads-community"], "isController": false}, {"data": [0.9673664993153811, 3000, 5000, "downloads-community-0"], "isController": false}, {"data": [0.3322672352523099, 3000, 5000, "solutions"], "isController": false}, {"data": [0.5666362391602008, 3000, 5000, "downloads-community-1"], "isController": false}, {"data": [0.4614285714285714, 3000, 5000, "products-dxp-short-1"], "isController": false}, {"data": [0.6466789667896679, 3000, 5000, "downloads-en-3"], "isController": false}, {"data": [0.9898097826086957, 3000, 5000, "downloads-en-2"], "isController": false}, {"data": [0.944954128440367, 3000, 5000, "downloads-fixpacks"], "isController": false}, {"data": [0.636535552193646, 3000, 5000, "careers"], "isController": false}, {"data": [0.9952445652173914, 3000, 5000, "downloads-en-1"], "isController": false}, {"data": [0.9725996376811594, 3000, 5000, "downloads-en-0"], "isController": false}, {"data": [0.44039971448965026, 3000, 5000, "solutions-portals"], "isController": false}, {"data": [0.442090395480226, 3000, 5000, "products-platform"], "isController": false}, {"data": [0.9725228975853455, 3000, 5000, "home-root-0"], "isController": false}, {"data": [0.9756707594361074, 3000, 5000, "download-thanks-0"], "isController": false}, {"data": [0.5709413369713506, 3000, 5000, "download-thanks-1"], "isController": false}, {"data": [0.6754571026722925, 3000, 5000, "products-trial-1"], "isController": false}, {"data": [0.9704641350210971, 3000, 5000, "products-trial-0"], "isController": false}, {"data": [0.9804100227790433, 3000, 5000, "download-ide-0"], "isController": false}, {"data": [0.9943052391799544, 3000, 5000, "download-ide-1"], "isController": false}, {"data": [0.9726651480637813, 3000, 5000, "download-ide-2"], "isController": false}, {"data": [0.361781848459617, 3000, 5000, "home-root-2"], "isController": false}, {"data": [0.9991673605328892, 3000, 5000, "home-root-1"], "isController": false}, {"data": [0.6441549127420512, 3000, 5000, "resources-gartner-2"], "isController": false}, {"data": [0.530569354222392, 3000, 5000, "subscription-services"], "isController": false}, {"data": [0.9735835524743007, 3000, 5000, "resources-gartner-0"], "isController": false}, {"data": [0.996294525460196, 3000, 5000, "resources-gartner-1"], "isController": false}, {"data": [0.4448669201520912, 3000, 5000, "our-story"], "isController": false}, {"data": [0.3798611111111111, 3000, 5000, "products-dxp-short"], "isController": false}, {"data": [0.975635593220339, 3000, 5000, "products-platform-0"], "isController": false}, {"data": [0.47638358778625955, 3000, 5000, "resources-home"], "isController": false}, {"data": [0.9965108164689462, 3000, 5000, "products-dxp-long-1"], "isController": false}, {"data": [0.979413817166783, 3000, 5000, "products-dxp-long-2"], "isController": false}, {"data": [0.9752267969295185, 3000, 5000, "products-dxp-long-0"], "isController": false}, {"data": [0.4687724335965542, 3000, 5000, "products-dxp-long-3"], "isController": false}, {"data": [0.36198347107438017, 3000, 5000, "home-fr"], "isController": false}, {"data": [0.5586115326251897, 3000, 5000, "gartner"], "isController": false}, {"data": [0.43591485507246375, 3000, 5000, "downloads-en"], "isController": false}, {"data": [0.2892533147243545, 3000, 5000, "products-dxp-long"], "isController": false}, {"data": [0.9641072239890959, 3000, 5000, "downloads-es-0"], "isController": false}, {"data": [0.8995444191343963, 3000, 5000, "download-ide"], "isController": false}, {"data": [0.649931849159473, 3000, 5000, "downloads-es-2"], "isController": false}, {"data": [0.25906526994359386, 3000, 5000, "home-root"], "isController": false}, {"data": [0.3327935222672065, 3000, 5000, "home"], "isController": false}, {"data": [0.9929577464788732, 3000, 5000, "downloads-es-1"], "isController": false}, {"data": [0.5720815752461322, 3000, 5000, "products-trial"], "isController": false}, {"data": [0.9493583868011, 3000, 5000, "downloads-enterprise"], "isController": false}, {"data": [0.9950564971751412, 3000, 5000, "products-platform-1"], "isController": false}, {"data": [0.9947033898305084, 3000, 5000, "products-platform-2"], "isController": false}, {"data": [0.5989643268124281, 3000, 5000, "partners"], "isController": false}, {"data": [0.6313559322033898, 3000, 5000, "products-platform-3"], "isController": false}, {"data": [0.48000908677873694, 3000, 5000, "downloads-es"], "isController": false}, {"data": [0.5339654344695152, 3000, 5000, "blog-awesome-examples"], "isController": false}, {"data": [0.36986863711001644, 3000, 5000, "home-it"], "isController": false}, {"data": [0.3538961038961039, 3000, 5000, "home-es"], "isController": false}, {"data": [0.3648424543946932, 3000, 5000, "home-zh"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 161453, 2, 0.0012387505961487244, 4055.5019045790477, 21, 526701, 9088.800000000003, 12968.850000000002, 38106.430000000095, 44.45837787349438, 7484.975471459669, 18.479900301461853], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["products-dpx-long-es-2", 1427, 0, 0.0, 7252.7133847232, 862, 104386, 14442.600000000004, 20022.19999999999, 53551.48, 0.3983704499017753, 161.69165183028122, 0.12137849645444716], "isController": false}, {"data": ["products-dpx-long-es-1", 1427, 0, 0.0, 453.53538892782035, 144, 27756, 853.2, 1315.0, 2460.360000000001, 0.4003295775667312, 0.15676968809009686, 0.07662558320613214], "isController": false}, {"data": ["products-dpx-long-es-0", 1427, 0, 0.0, 1262.3020322354605, 292, 63859, 1599.0000000000002, 2393.9999999999936, 24444.240000000013, 0.40050485503380157, 0.147060376457724, 0.12789559335552061], "isController": false}, {"data": ["home-1", 1195, 0, 0.0, 8344.455230125539, 1008, 107441, 16884.800000000003, 28531.80000000001, 53296.51999999991, 0.3413204216149797, 166.56767775671224, 0.1013295001669471], "isController": false}, {"data": ["home-0", 1195, 0, 0.0, 1169.403347280335, 298, 93041, 1584.2000000000003, 2178.4, 21606.439999999955, 0.3419476479581719, 0.08248151273991061, 0.10051390823770484], "isController": false}, {"data": ["products-sync", 1410, 0, 0.0, 6354.750354609921, 1140, 98032, 11806.7, 23761.65000000001, 43170.55000000011, 0.3974213274887031, 107.78821337965054, 0.25653857174807887], "isController": false}, {"data": ["download-thanks", 2199, 0, 0.0, 7095.117780809464, 1108, 208559, 12651.0, 20592.0, 50516.0, 0.6097603245400108, 181.38536725997446, 0.39360505324311246], "isController": false}, {"data": ["home-de", 1223, 0, 0.0, 10071.439901880607, 1222, 206795, 19852.600000000035, 34384.59999999999, 65666.88, 0.344264505485009, 167.16224979818793, 0.10220352506586204], "isController": false}, {"data": ["solutions-0", 1407, 0, 0.0, 1353.197583511013, 296, 91297, 1680.6000000000004, 2372.7999999999997, 27419.72000000003, 0.397747398457803, 0.09788314883922497, 0.11885810930477317], "isController": false}, {"data": ["home-pt", 1226, 0, 0.0, 9237.91598694943, 1224, 188238, 18191.299999999996, 30946.099999999915, 56597.01000000003, 0.3434782693962263, 166.20186688126353, 0.10197011122700467], "isController": false}, {"data": ["solutions-1", 1407, 0, 0.0, 291.11300639658856, 76, 33112, 541.2, 683.3999999999996, 2087.6800000000057, 0.3976526341731425, 0.27726951249963255, 0.11999478902295023], "isController": false}, {"data": ["solutions-2", 1407, 0, 0.0, 7708.137882018487, 835, 142490, 15069.000000000002, 24543.39999999998, 50741.48000000003, 0.39737029545484076, 161.52995801478872, 0.12495433118794796], "isController": false}, {"data": ["solutions-portals-0", 1401, 0, 0.0, 1401.8037116345458, 293, 63370, 1827.1999999999994, 2696.699999999998, 24584.56, 0.3982486157236285, 0.10111781258607756, 0.12211920443087829], "isController": false}, {"data": ["downloads-enterprise-2", 2182, 0, 0.0, 223.628780934922, 22, 30187, 317.70000000000005, 509.5499999999997, 1439.6800000000003, 0.6140787833247497, 0.18837735591522223, 0.1393811703379122], "isController": false}, {"data": ["products-sync-1", 1410, 0, 0.0, 4733.61773049645, 803, 65956, 9364.9, 12454.950000000003, 38209.40000000001, 0.39745874462796454, 107.69162220963172, 0.12886357735984788], "isController": false}, {"data": ["downloads-enterprise-3", 2182, 0, 0.0, 159.8162236480295, 61, 7231, 185.0, 261.6999999999998, 1401.5700000000015, 0.6140704880875392, 3.0961386035116836, 0.15891472592109165], "isController": false}, {"data": ["downloads-enterprise-0", 2182, 0, 0.0, 1440.7511457378566, 292, 124584, 1651.4, 2640.9499999999994, 26837.8500000001, 0.6142540726002146, 0.2441419995588744, 0.20635097751413461], "isController": false}, {"data": ["downloads-fixpacks-0", 2180, 0, 0.0, 1415.523394495414, 152, 110379, 1661.6000000000004, 2566.8999999999996, 27873.300000000003, 0.613986788018245, 0.2500317291050861, 0.21225715132661985], "isController": false}, {"data": ["downloads-enterprise-1", 2182, 0, 0.0, 273.19019248395955, 21, 26868, 347.70000000000005, 562.5499999999997, 1972.46000000001, 0.6140867331373809, 0.3262335769792336, 0.0995492165046926], "isController": false}, {"data": ["downloads-fixpacks-1", 2180, 0, 0.0, 228.54174311926624, 22, 27892, 355.9000000000001, 673.9499999999998, 1878.160000000009, 0.6137212877674367, 0.3260394341264508, 0.10548334633502819], "isController": false}, {"data": ["products-sync-0", 1410, 0, 0.0, 1621.1290780141867, 298, 96030, 1724.6000000000004, 2573.250000000001, 30461.590000000004, 0.39820362156309325, 0.10693944915024477, 0.12793846825611102], "isController": false}, {"data": ["solutions-portals-1", 1401, 0, 0.0, 302.077801570307, 76, 29838, 557.0, 714.9999999999986, 1867.3800000000015, 0.3982684278034004, 0.28314396039147993, 0.12329208165398234], "isController": false}, {"data": ["resources-gartner", 4183, 0, 0.0, 6588.509682046374, 1152, 172576, 11476.8, 19187.399999999998, 45454.31999999982, 1.166279440330852, 302.8931699847405, 1.2630897454364403], "isController": false}, {"data": ["solutions-portals-2", 1401, 0, 0.0, 6068.8551034975, 813, 186864, 10861.0, 15443.099999999995, 56271.96000000006, 0.39748401978057524, 119.51934119453027, 0.13042444399050124], "isController": false}, {"data": ["products-dpx-long-es", 1427, 0, 0.0, 8968.630693763123, 1387, 105171, 17775.800000000003, 30438.0, 55792.28000000003, 0.3983141847580486, 161.97105123176638, 0.3247972112040728], "isController": false}, {"data": ["downloads-fixpacks-2", 2180, 0, 0.0, 227.66376146788988, 23, 56880, 326.8000000000002, 565.5999999999985, 1504.1800000000012, 0.6136801696009305, 0.18698067667528354, 0.14023550750646266], "isController": false}, {"data": ["downloads-fixpacks-3", 2180, 0, 0.0, 188.50412844036757, 63, 29070, 181.9000000000001, 246.89999999999964, 1480.3300000000113, 0.6136660041138142, 3.094099198476194, 0.15881004989273514], "isController": false}, {"data": ["products-dxp-short-0", 1400, 0, 0.0, 1284.8557142857137, 300, 95940, 1673.3000000000006, 2311.75, 23057.55000000001, 0.3953705497514531, 0.09845653338537164, 0.11930615221992091], "isController": false}, {"data": ["downloads-community", 2191, 0, 0.0, 7490.282062984946, 1264, 526701, 13212.8, 24756.000000000025, 52457.39999999984, 0.6141881097554993, 173.7815075819714, 0.38086860321752153], "isController": false}, {"data": ["downloads-community-0", 2191, 0, 0.0, 1473.067092651759, 159, 66375, 1806.3999999999996, 2690.000000000001, 30786.719999999998, 0.615479174836537, 0.1574761169991921, 0.18993302660971262], "isController": false}, {"data": ["solutions", 1407, 0, 0.0, 9352.532338308445, 1214, 143490, 17755.600000000002, 31750.199999999975, 53040.56000000001, 0.39728558226056343, 161.8703054073794, 0.3635318267364726], "isController": false}, {"data": ["downloads-community-1", 2191, 0, 0.0, 6017.206754906428, 938, 526398, 10964.8, 14671.800000000007, 49342.799999999996, 0.6142426928668789, 173.6397918536238, 0.19135099514114684], "isController": false}, {"data": ["products-dxp-short-1", 1400, 0, 0.0, 7565.529285714285, 853, 315046, 14335.8, 21334.20000000002, 49221.01000000001, 0.3949831497367014, 160.31578726489687, 0.12034642843540122], "isController": false}, {"data": ["downloads-en-3", 2168, 0, 0.0, 4704.186808118083, 754, 117907, 8856.500000000002, 12574.599999999986, 40206.089999999924, 0.6107062897114018, 146.17242797281992, 0.19382767984004454], "isController": false}, {"data": ["downloads-en-2", 2208, 0, 0.0, 392.4483695652182, 77, 21815, 689.1000000000001, 1244.3999999999978, 3880.5099999999766, 0.6158944276616932, 2.7775485077007724, 0.19201373489203716], "isController": false}, {"data": ["downloads-fixpacks", 2180, 0, 0.0, 2060.359174311928, 407, 118307, 2614.3000000000025, 3863.0499999999965, 30174.960000000036, 0.6136017493842169, 3.856582870153144, 0.616597851676132], "isController": false}, {"data": ["careers", 2644, 0, 0.0, 5311.861195158842, 889, 180667, 10088.0, 16552.75, 42124.400000000125, 0.7377610904131239, 164.25563495900738, 0.2173660701330649], "isController": false}, {"data": ["downloads-en-1", 2208, 0, 0.0, 497.8025362318836, 142, 101665, 1163.0, 1304.5499999999997, 2303.459999999999, 0.6161200786780875, 0.24729038314130272, 0.12355363160651357], "isController": false}, {"data": ["downloads-en-0", 2208, 0, 0.0, 1381.4071557971, 291, 64568, 1721.3000000000004, 2494.0999999999995, 26757.67999999998, 0.6160977296184798, 0.24667975502302414, 0.18245059010610665], "isController": false}, {"data": ["solutions-portals", 1401, 0, 0.0, 7772.833690221277, 1246, 187514, 13658.4, 26948.399999999987, 58247.14000000002, 0.3974393670927013, 119.88938148161624, 0.3753162773228927], "isController": false}, {"data": ["products-platform", 1416, 0, 0.0, 6943.43079096045, 1386, 192286, 12306.799999999996, 21169.79999999994, 42408.43999999984, 0.39837577470161906, 102.78880867743182, 0.4629562225536394], "isController": false}, {"data": ["home-root-0", 1201, 0, 0.0, 1347.9417152373012, 299, 55387, 1632.0, 2591.7999999999997, 25168.540000000008, 0.34240277799556107, 0.08091940651848219, 0.09931018072722815], "isController": false}, {"data": ["download-thanks-0", 2199, 0, 0.0, 1369.9386084583905, 299, 99227, 1666.0, 2373.0, 28037.0, 0.6157526841524749, 0.16536326966985407, 0.19783460262320723], "isController": false}, {"data": ["download-thanks-1", 2199, 0, 0.0, 5725.172351068671, 794, 208245, 10785.0, 14178.0, 47481.0, 0.6098132512780011, 181.2373431664276, 0.19771289006278941], "isController": false}, {"data": ["products-trial-1", 1422, 0, 0.0, 4422.666666666663, 752, 165088, 8591.1, 12083.249999999982, 37156.099999999984, 0.3992318576915302, 95.558006283708, 0.12670932983373762], "isController": false}, {"data": ["products-trial-0", 1422, 0, 0.0, 1489.850210970462, 297, 210921, 1621.4, 2410.349999999999, 26093.09999999999, 0.39962622863285396, 0.10458967702500475, 0.1256637164255654], "isController": false}, {"data": ["download-ide-0", 2195, 0, 0.0, 1187.115717539863, 292, 100342, 1654.8000000000002, 2220.9999999999973, 19867.839999999956, 0.6156578479406456, 0.23928889011755558, 0.20141150298839477], "isController": false}, {"data": ["download-ide-1", 2195, 0, 0.0, 265.18997722095645, 22, 34172, 353.0, 572.7999999999993, 1550.8799999999983, 0.6156970490019116, 0.39082332212035403, 0.0943988639583009], "isController": false}, {"data": ["download-ide-2", 2195, 1, 0.04555808656036447, 1230.3571753986325, 462, 173141, 2010.0000000000005, 2796.2, 5543.759999999989, 0.615610364354393, 28.197383791361233, 0.17918784025093343], "isController": false}, {"data": ["home-root-2", 1201, 0, 0.0, 9329.786844296408, 972, 173458, 17921.4, 30333.099999999864, 67679.06000000008, 0.34203115815566315, 167.13029386040543, 0.1048806481063264], "isController": false}, {"data": ["home-root-1", 1201, 0, 0.0, 232.41881765195714, 74, 13665, 512.5999999999999, 655.7999999999997, 1577.3800000000006, 0.34239116180362883, 0.29156747372340264, 0.09997554431570803], "isController": false}, {"data": ["resources-gartner-2", 4183, 0, 0.0, 4785.6170212765965, 700, 171795, 9120.599999999999, 12244.199999999993, 39387.47999999985, 1.1664303411313788, 301.91059462755027, 0.41007316680400036], "isController": false}, {"data": ["subscription-services", 2617, 0, 0.0, 6744.09858616735, 1086, 223814, 13053.000000000007, 25625.899999999994, 50695.90000000001, 0.7365544338212736, 225.09644799429992, 0.22873467769059083], "isController": false}, {"data": ["resources-gartner-0", 4183, 0, 0.0, 1337.0542672722909, 290, 88941, 1625.6, 2222.5999999999967, 26445.159999999978, 1.1678456333098723, 0.5109324645730691, 0.5759394968959819], "isController": false}, {"data": ["resources-gartner-1", 4183, 0, 0.0, 465.7676308869236, 143, 24803, 1191.7999999999997, 1324.7999999999997, 2332.16, 1.167854436702178, 0.5120767989055448, 0.2782778149954408], "isController": false}, {"data": ["our-story", 2630, 0, 0.0, 8116.033079847923, 1101, 257094, 15946.400000000001, 28102.04999999995, 56790.89000000001, 0.7318148870069466, 275.45822532411677, 0.2244041743361145], "isController": false}, {"data": ["products-dxp-short", 1440, 0, 0.0, 8809.97361111111, 1156, 316118, 16830.7, 28848.850000000017, 52312.6299999999, 0.3981455266138165, 161.70929458376236, 0.23644210798149065], "isController": false}, {"data": ["products-platform-0", 1416, 0, 0.0, 1349.1751412429376, 294, 99365, 1612.6, 2179.749999999999, 27685.939999999897, 0.39868456617713305, 0.1522320950930264, 0.1253676077236688], "isController": false}, {"data": ["resources-home", 4192, 0, 0.0, 7453.319656488549, 1198, 218994, 13971.7, 25424.35, 52087.84999999978, 1.164892280810178, 391.3359444340894, 0.3464526362357084], "isController": false}, {"data": ["products-dxp-long-1", 1433, 0, 0.0, 452.4117236566642, 143, 16143, 1207.6000000000001, 1312.1999999999998, 2335.620000000001, 0.4005840196328101, 0.15569574200572112, 0.07550069901282455], "isController": false}, {"data": ["products-dxp-long-2", 1433, 0, 0.0, 479.41032798325205, 77, 28998, 690.2000000000003, 1569.7999999999988, 6757.040000000008, 0.40054303909026134, 4.6410318408306805, 0.12086699128797926], "isController": false}, {"data": ["products-dxp-long-0", 1433, 0, 0.0, 1352.7613398464755, 291, 79367, 1648.8000000000004, 2267.3999999999974, 26006.40000000004, 0.4005639761886659, 0.14590855773278552, 0.12674094559094506], "isController": false}, {"data": ["products-dxp-long-3", 1393, 0, 0.0, 7344.819095477386, 845, 261591, 14770.000000000015, 19812.4, 46744.51999999996, 0.3963050598739278, 160.8523293297537, 0.12074919793033737], "isController": false}, {"data": ["home-fr", 1210, 0, 0.0, 9553.799173553703, 1223, 326023, 20206.90000000002, 33969.100000000006, 53970.29000000006, 0.3425309983476418, 167.97664786293566, 0.10168889013445616], "isController": false}, {"data": ["gartner", 2636, 0, 0.0, 6310.746206373288, 1010, 121835, 11807.400000000001, 23065.100000000064, 45724.190000000024, 0.7363805221206082, 210.90321977869965, 0.2560072908934927], "isController": false}, {"data": ["downloads-en", 2208, 0, 0.0, 6890.760416666687, 1246, 119470, 11872.000000000002, 20365.949999999895, 48732.13999999996, 0.615424580247268, 147.90209096937943, 0.6893193419472335], "isController": false}, {"data": ["products-dxp-long", 1433, 0, 0.0, 9424.524773203073, 1397, 263958, 17899.000000000033, 29134.1, 51570.58000000001, 0.39998068481270826, 162.74827607548542, 0.44110799481978963], "isController": false}, {"data": ["downloads-es-0", 2201, 0, 0.0, 1643.253521126758, 290, 107776, 1771.3999999999996, 2782.6000000000004, 32475.540000000008, 0.6153803139809598, 0.24819538054114884, 0.1856958174024576], "isController": false}, {"data": ["download-ide", 2195, 1, 0.04555808656036447, 2682.753530751708, 792, 175684, 3578.0000000000005, 4672.599999999997, 27378.799999999992, 0.6155501139118251, 28.82460115305927, 0.47492289673957544], "isController": false}, {"data": ["downloads-es-2", 2201, 0, 0.0, 5019.715129486598, 748, 135230, 9336.999999999998, 14624.5, 44688.200000000004, 0.6147994890544183, 147.1521454832314, 0.19512679095965424], "isController": false}, {"data": ["home-root", 1241, 0, 0.0, 10808.912167606779, 1330, 174902, 21955.4, 33419.49999999997, 69136.27999999962, 0.34444045079788893, 168.54187354676174, 0.2978005449361564], "isController": false}, {"data": ["home", 1235, 0, 0.0, 9390.830769230774, 1309, 111486, 19061.200000000004, 30169.800000000007, 56560.08000000029, 0.3433044512827355, 167.49000501492054, 0.19953023885024976], "isController": false}, {"data": ["downloads-es-1", 2201, 0, 0.0, 512.4875056792375, 143, 98382, 1202.3999999999999, 1318.0, 2612.7400000000002, 0.6153975199563826, 0.24880329420111558, 0.1256035953817226], "isController": false}, {"data": ["products-trial", 1422, 0, 0.0, 5912.518987341768, 1072, 214295, 10527.600000000004, 19863.149999999998, 45392.75999999998, 0.39919543311441213, 95.65376482113055, 0.25222602072756317], "isController": false}, {"data": ["downloads-enterprise", 2182, 0, 0.0, 2097.5192483959713, 418, 124781, 2526.2000000000007, 3570.049999999997, 33665.24000000003, 0.613959388077764, 3.8541099667527763, 0.6040205995403464], "isController": false}, {"data": ["products-platform-1", 1416, 0, 0.0, 448.82838983050846, 143, 16160, 1185.8999999999999, 1324.0, 2331.129999999999, 0.3986988227403617, 0.16197139673827196, 0.08215376132638313], "isController": false}, {"data": ["products-platform-2", 1416, 0, 0.0, 341.5847457627119, 78, 28010, 607.0, 1002.4499999999996, 2383.699999999986, 0.39866346384494017, 0.10628430237272331, 0.12730757097392134], "isController": false}, {"data": ["partners", 2607, 0, 0.0, 5681.330264672039, 972, 292667, 10168.000000000005, 15151.399999999996, 45258.76000000008, 0.7347432964186126, 179.09018088826153, 0.22530214362836362], "isController": false}, {"data": ["products-platform-3", 1416, 0, 0.0, 4803.710451977409, 789, 190966, 9121.699999999999, 13223.449999999966, 37441.3699999999, 0.3984384364780518, 102.38474861341454, 0.1284030117556222], "isController": false}, {"data": ["downloads-es", 2201, 0, 0.0, 7175.536574284404, 1206, 136413, 12942.199999999999, 26802.4, 52880.460000000014, 0.6147235936277657, 147.6304412664912, 0.5060663959259829], "isController": false}, {"data": ["blog-awesome-examples", 4166, 0, 0.0, 6723.904464714353, 982, 521756, 12527.400000000014, 24037.699999999964, 49999.029999999926, 1.1625765330326894, 366.94570497597266, 0.4030416691666062], "isController": false}, {"data": ["home-it", 1218, 0, 0.0, 9567.012315270946, 1289, 130491, 19463.400000000023, 32392.999999999975, 61162.849999999984, 0.3439783039497351, 164.41623146033194, 0.10211855898507761], "isController": false}, {"data": ["home-es", 1232, 0, 0.0, 9380.38068181819, 1277, 99869, 19182.4, 30707.549999999977, 58005.940000000046, 0.34385073752075807, 169.94642050370504, 0.10208068770147505], "isController": false}, {"data": ["home-zh", 1206, 0, 0.0, 9850.904643449418, 1258, 99603, 21166.999999999996, 35073.34999999996, 56596.3, 0.342523140193074, 167.1546149006619, 0.10168655724481884], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 2, 100.0, 0.0012387505961487244], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 161453, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 2, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["download-ide-2", 2195, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["download-ide", 2195, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Operation timed out (Read failed)", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
