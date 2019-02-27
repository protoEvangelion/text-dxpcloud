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

    var data = {"OkPercent": 99.99574953852132, "KoPercent": 0.004250461478674828};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7732075196735646, 3000, 5000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5755540631296172, 3000, 5000, "products-dpx-long-es-2"], "isController": false}, {"data": [0.9889187374076561, 3000, 5000, "products-dpx-long-es-1"], "isController": false}, {"data": [0.9445936870382807, 3000, 5000, "products-dpx-long-es-0"], "isController": false}, {"data": [0.519277108433735, 3000, 5000, "home-1"], "isController": false}, {"data": [0.9670682730923694, 3000, 5000, "home-0"], "isController": false}, {"data": [0.5965986394557823, 3000, 5000, "products-sync"], "isController": false}, {"data": [0.5850773430391265, 3000, 5000, "download-thanks"], "isController": false}, {"data": [0.4850863422291994, 3000, 5000, "home-de"], "isController": false}, {"data": [0.9631147540983607, 3000, 5000, "solutions-0"], "isController": false}, {"data": [0.4913860610806578, 3000, 5000, "home-pt"], "isController": false}, {"data": [0.9921448087431693, 3000, 5000, "solutions-1"], "isController": false}, {"data": [0.5587431693989071, 3000, 5000, "solutions-2"], "isController": false}, {"data": [0.9756348661633494, 3000, 5000, "solutions-portals-0"], "isController": false}, {"data": [0.7037414965986395, 3000, 5000, "products-sync-1"], "isController": false}, {"data": [0.989010989010989, 3000, 5000, "downloads-enterprise-2"], "isController": false}, {"data": [0.9880952380952381, 3000, 5000, "downloads-enterprise-3"], "isController": false}, {"data": [0.9720695970695971, 3000, 5000, "downloads-enterprise-0"], "isController": false}, {"data": [0.9585052728106374, 3000, 5000, "downloads-fixpacks-0"], "isController": false}, {"data": [0.9639455782312926, 3000, 5000, "products-sync-0"], "isController": false}, {"data": [0.9722985347985348, 3000, 5000, "downloads-enterprise-1"], "isController": false}, {"data": [0.9750114626318203, 3000, 5000, "downloads-fixpacks-1"], "isController": false}, {"data": [0.9962251201098147, 3000, 5000, "solutions-portals-1"], "isController": false}, {"data": [0.5578007518796992, 3000, 5000, "resources-gartner"], "isController": false}, {"data": [0.650308853809197, 3000, 5000, "solutions-portals-2"], "isController": false}, {"data": [0.4274680993955675, 3000, 5000, "products-dpx-long-es"], "isController": false}, {"data": [0.9864740944520862, 3000, 5000, "downloads-fixpacks-2"], "isController": false}, {"data": [0.9896836313617606, 3000, 5000, "downloads-fixpacks-3"], "isController": false}, {"data": [0.9521679284239505, 3000, 5000, "products-dxp-short-0"], "isController": false}, {"data": [0.5417236662106704, 3000, 5000, "downloads-community"], "isController": false}, {"data": [0.9619243046055631, 3000, 5000, "downloads-community-0"], "isController": false}, {"data": [0.44398907103825136, 3000, 5000, "solutions"], "isController": false}, {"data": [0.6511627906976745, 3000, 5000, "downloads-community-1"], "isController": false}, {"data": [0.5767377838953889, 3000, 5000, "products-dxp-short-1"], "isController": false}, {"data": [0.7024356617647058, 3000, 5000, "downloads-en-3"], "isController": false}, {"data": [0.9916516245487365, 3000, 5000, "downloads-en-2"], "isController": false}, {"data": [0.9108207244383311, 3000, 5000, "downloads-fixpacks"], "isController": false}, {"data": [0.717391304347826, 3000, 5000, "careers"], "isController": false}, {"data": [0.9921028880866426, 3000, 5000, "downloads-en-1"], "isController": false}, {"data": [0.9634476534296029, 3000, 5000, "downloads-en-0"], "isController": false}, {"data": [0.5459533607681756, 3000, 5000, "solutions-portals"], "isController": false}, {"data": [0.521974306964165, 3000, 5000, "products-platform"], "isController": false}, {"data": [0.9632, 3000, 5000, "home-root-0"], "isController": false}, {"data": [0.964968152866242, 3000, 5000, "download-thanks-0"], "isController": false}, {"data": [0.7410533423362593, 3000, 5000, "products-trial-1"], "isController": false}, {"data": [0.6897179253867152, 3000, 5000, "download-thanks-1"], "isController": false}, {"data": [0.9662390276839973, 3000, 5000, "products-trial-0"], "isController": false}, {"data": [0.968094804010939, 3000, 5000, "download-ide-0"], "isController": false}, {"data": [0.969690063810392, 3000, 5000, "download-ide-1"], "isController": false}, {"data": [0.9758432087511395, 3000, 5000, "download-ide-2"], "isController": false}, {"data": [0.484, 3000, 5000, "home-root-2"], "isController": false}, {"data": [0.9952, 3000, 5000, "home-root-1"], "isController": false}, {"data": [0.7197414806110458, 3000, 5000, "resources-gartner-2"], "isController": false}, {"data": [0.6119235095613048, 3000, 5000, "subscription-services"], "isController": false}, {"data": [0.9647473560517039, 3000, 5000, "resources-gartner-0"], "isController": false}, {"data": [0.9945945945945946, 3000, 5000, "resources-gartner-1"], "isController": false}, {"data": [0.5302464525765497, 3000, 5000, "our-story"], "isController": false}, {"data": [0.48459477561955794, 3000, 5000, "products-dxp-short"], "isController": false}, {"data": [0.9621365787694388, 3000, 5000, "products-platform-0"], "isController": false}, {"data": [0.5626610447411572, 3000, 5000, "resources-home"], "isController": false}, {"data": [0.9969839142091153, 3000, 5000, "products-dxp-long-1"], "isController": false}, {"data": [0.9902815013404825, 3000, 5000, "products-dxp-long-2"], "isController": false}, {"data": [0.9668230563002681, 3000, 5000, "products-dxp-long-0"], "isController": false}, {"data": [0.5550964187327824, 3000, 5000, "products-dxp-long-3"], "isController": false}, {"data": [0.48019017432646594, 3000, 5000, "home-fr"], "isController": false}, {"data": [0.6313732787495347, 3000, 5000, "gartner"], "isController": false}, {"data": [0.5092509025270758, 3000, 5000, "downloads-en"], "isController": false}, {"data": [0.4024798927613941, 3000, 5000, "products-dxp-long"], "isController": false}, {"data": [0.9655172413793104, 3000, 5000, "downloads-es-0"], "isController": false}, {"data": [0.8835460346399271, 3000, 5000, "download-ide"], "isController": false}, {"data": [0.7216424682395645, 3000, 5000, "downloads-es-2"], "isController": false}, {"data": [0.3988372093023256, 3000, 5000, "home-root"], "isController": false}, {"data": [0.4599221789883268, 3000, 5000, "home"], "isController": false}, {"data": [0.9941016333938294, 3000, 5000, "downloads-es-1"], "isController": false}, {"data": [0.6431465226198515, 3000, 5000, "products-trial"], "isController": false}, {"data": [0.9223901098901099, 3000, 5000, "downloads-enterprise"], "isController": false}, {"data": [0.995605138607167, 3000, 5000, "products-platform-1"], "isController": false}, {"data": [0.9922244759972955, 3000, 5000, "products-platform-2"], "isController": false}, {"data": [0.6568369646882044, 3000, 5000, "partners"], "isController": false}, {"data": [0.6974306964164977, 3000, 5000, "products-platform-3"], "isController": false}, {"data": [0.565562613430127, 3000, 5000, "downloads-es"], "isController": false}, {"data": [0.6049033474776049, 3000, 5000, "blog-awesome-examples"], "isController": false}, {"data": [0.48539857932123126, 3000, 5000, "home-it"], "isController": false}, {"data": [0.4765990639625585, 3000, 5000, "home-es"], "isController": false}, {"data": [0.4872611464968153, 3000, 5000, "home-zh"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 164688, 7, 0.004250461478674828, 3976.9230119984777, 21, 442877, 11613.800000000003, 24763.700000000004, 61654.85000000002, 43.93995342612534, 7444.871844366358, 18.266635194805318], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["products-dpx-long-es-2", 1489, 0, 0.0, 6361.926124916047, 796, 109679, 12542.0, 19750.0, 60097.19999999968, 0.4118450964572194, 167.1456316280888, 0.12548405282680905], "isController": false}, {"data": ["products-dpx-long-es-1", 1489, 0, 0.0, 565.049026192076, 145, 88468, 1167.0, 1308.5, 5106.999999999979, 0.4122607281925426, 0.16144194531758752, 0.07890928000560386], "isController": false}, {"data": ["products-dpx-long-es-0", 1489, 0, 0.0, 2007.4264607118866, 298, 97059, 1820.0, 4828.5, 36827.39999999998, 0.4122374443382551, 0.15136843659295304, 0.13164223076036075], "isController": false}, {"data": ["home-1", 1245, 0, 0.0, 7042.329317269072, 914, 162335, 14711.600000000008, 20378.30000000001, 54193.23999999995, 0.3476240801573662, 169.64526806973353, 0.1032008987967181], "isController": false}, {"data": ["home-0", 1245, 0, 0.0, 1745.595983935743, 307, 115752, 1550.2000000000003, 2210.0000000000014, 33146.37999999999, 0.350988872384111, 0.08466235495983926, 0.10317153377697011], "isController": false}, {"data": ["products-sync", 1470, 0, 0.0, 6158.710204081642, 1048, 208838, 11171.50000000001, 22987.45000000004, 50078.47, 0.3958159827262674, 107.36108240028803, 0.25550230916217065], "isController": false}, {"data": ["download-thanks", 2198, 0, 0.0, 6574.543676069153, 1048, 422341, 11429.200000000006, 20653.399999999805, 62231.81999999901, 0.6085790261185062, 181.04536047872438, 0.39284251588313734], "isController": false}, {"data": ["home-de", 1274, 0, 0.0, 8985.426216640515, 1149, 325969, 17270.5, 29750.0, 90771.75, 0.34889456017513737, 169.4136132451939, 0.10357807255199392], "isController": false}, {"data": ["solutions-0", 1464, 0, 0.0, 1705.5710382513676, 295, 118569, 1618.5, 2755.25, 34396.29999999979, 0.40798502494310085, 0.10040256473209122, 0.12191740003182505], "isController": false}, {"data": ["home-pt", 1277, 0, 0.0, 8926.05716523102, 1156, 332425, 16586.6, 30511.999999999978, 93564.32000000002, 0.3528392368283482, 170.73143836498457, 0.10474914843341589], "isController": false}, {"data": ["solutions-1", 1464, 0, 0.0, 327.3340163934421, 77, 43698, 519.5, 629.5, 2845.9499999999966, 0.40798388798055496, 0.2844731406426917, 0.12311232557225732], "isController": false}, {"data": ["solutions-2", 1464, 0, 0.0, 6720.750683060107, 794, 200544, 13160.0, 20105.75, 56544.24999999977, 0.4069670309447834, 165.41606438114533, 0.12797205465255884], "isController": false}, {"data": ["solutions-portals-0", 1457, 0, 0.0, 1291.882635552504, 303, 51782, 1591.2, 2198.2999999999997, 26393.700000000026, 0.40641221970248503, 0.10319060265883409, 0.12462249705720732], "isController": false}, {"data": ["products-sync-1", 1470, 0, 0.0, 4666.0401360544165, 737, 208306, 8880.500000000002, 13290.050000000001, 43210.76999999998, 0.39585051715042563, 107.2641420016619, 0.12834215985736455], "isController": false}, {"data": ["downloads-enterprise-2", 2184, 0, 0.0, 288.7783882783881, 21, 56793, 265.0, 362.75, 4689.65000000002, 0.6084412870873381, 0.18664681710544645, 0.13810245159492965], "isController": false}, {"data": ["downloads-enterprise-3", 2184, 0, 0.0, 358.1652930402929, 63, 68835, 176.5, 285.25, 5822.200000000106, 0.6084319644078445, 3.0677092111696296, 0.15745553766413944], "isController": false}, {"data": ["downloads-enterprise-0", 2184, 0, 0.0, 1428.3910256410272, 297, 130130, 1581.0, 2210.75, 27367.65000000005, 0.6089835106003284, 0.24204715704524768, 0.2045803980922978], "isController": false}, {"data": ["downloads-fixpacks-0", 2181, 0, 0.0, 2045.539660706098, 298, 240902, 1801.3999999999996, 2901.600000000005, 35868.89999999943, 0.6075461070668393, 0.2474089127410859, 0.2100305877945909], "isController": false}, {"data": ["products-sync-0", 1470, 0, 0.0, 1492.6727891156477, 302, 71781, 1617.5000000000005, 2663.3500000000004, 30793.869999999944, 0.40935011353200085, 0.10993289181767602, 0.13151971421096512], "isController": false}, {"data": ["downloads-enterprise-1", 2184, 0, 0.0, 535.3772893772907, 23, 59751, 300.5, 523.75, 14257.300000000007, 0.60902851307529, 0.3235463975712478, 0.09872923161181459], "isController": false}, {"data": ["downloads-fixpacks-1", 2181, 0, 0.0, 507.5635029802852, 23, 143180, 304.0, 503.40000000000055, 9980.379999999772, 0.6075919745485545, 0.32278323647891954, 0.1044298706255328], "isController": false}, {"data": ["solutions-portals-1", 1457, 0, 0.0, 239.81537405627992, 77, 26380, 470.20000000000005, 588.0, 1694.8800000000192, 0.4064100658038426, 0.28893215615741935, 0.1258124910740411], "isController": false}, {"data": ["resources-gartner", 4256, 1, 0.023496240601503758, 6772.253054511283, 1101, 442877, 11405.6, 27283.249999999985, 60518.38000000005, 1.1394052711415095, 295.8448911433427, 1.2336948702099333], "isController": false}, {"data": ["solutions-portals-2", 1457, 0, 0.0, 5349.877144818118, 725, 271410, 9871.0, 14319.699999999999, 50382.820000000094, 0.40166886936691804, 120.76331804021154, 0.13179759776101999], "isController": false}, {"data": ["products-dpx-long-es", 1489, 0, 0.0, 8934.460040295498, 1288, 137129, 17896.0, 32930.0, 74110.99999999862, 0.41178655352354054, 167.4343313531143, 0.3357829806564027], "isController": false}, {"data": ["downloads-fixpacks-2", 2181, 0, 0.0, 429.0985786336546, 23, 131320, 287.79999999999995, 408.0, 9038.139999999907, 0.6075923130796991, 0.1851257828914708, 0.13884433716860312], "isController": false}, {"data": ["downloads-fixpacks-3", 2181, 0, 0.0, 308.06831728564873, 63, 64124, 171.0, 223.9000000000001, 4937.4999999999545, 0.607581141751104, 3.0634193699813967, 0.1572353540664478], "isController": false}, {"data": ["products-dxp-short-0", 1453, 0, 0.0, 1958.7591190640064, 301, 120968, 1813.4000000000005, 3170.0999999999985, 40533.94000000004, 0.41002781868022403, 0.1021065368783761, 0.12372909762909104], "isController": false}, {"data": ["downloads-community", 2193, 0, 0.0, 6673.679434564534, 1164, 114844, 11971.600000000002, 26454.39999999984, 57048.699999999815, 0.6098856540877634, 172.57583407225422, 0.3782005765095018], "isController": false}, {"data": ["downloads-community-0", 2193, 0, 0.0, 1642.3219334245334, 298, 84943, 1670.2000000000003, 2708.399999999998, 31860.479999999996, 0.6102408600917782, 0.15613584506254483, 0.18831651541894717], "isController": false}, {"data": ["solutions", 1464, 0, 0.0, 8753.771174863392, 1215, 203684, 17027.5, 32331.5, 61976.19999999993, 0.4069233674909922, 165.78219188106235, 0.3723507766983005], "isController": false}, {"data": ["downloads-community-1", 2193, 0, 0.0, 5031.337437300489, 845, 114434, 9393.200000000003, 13479.69999999998, 48183.93999999998, 0.6099541852925666, 172.43916345630066, 0.1900150245198523], "isController": false}, {"data": ["products-dxp-short-1", 1453, 0, 0.0, 6060.388850653821, 802, 132734, 12011.2, 15966.299999999994, 49730.280000000006, 0.4062830996296756, 164.88730052317686, 0.12378938191841679], "isController": false}, {"data": ["downloads-en-3", 2176, 0, 0.0, 4426.241268382348, 692, 114417, 8269.9, 12483.700000000008, 41753.670000000006, 0.6052940418871267, 144.8883240011953, 0.19210992540362903], "isController": false}, {"data": ["downloads-en-2", 2216, 0, 0.0, 365.6502707581229, 77, 29883, 607.5999999999999, 1041.7500000000005, 3333.099999999995, 0.6116493251018288, 2.749013285052323, 0.1906962023918911], "isController": false}, {"data": ["downloads-fixpacks", 2181, 0, 0.0, 3290.385602934435, 433, 242100, 3172.199999999999, 11541.000000000018, 46768.259999999944, 0.6075176760902937, 3.8183435188643853, 0.6104840709930783], "isController": false}, {"data": ["careers", 2691, 0, 0.0, 5437.361204013383, 875, 293572, 8226.2, 13861.400000000012, 80489.7999999997, 0.7456983100276056, 166.0226647403371, 0.2197338555346], "isController": false}, {"data": ["downloads-en-1", 2216, 0, 0.0, 497.612815884476, 146, 48172, 1063.7999999999984, 1297.15, 2631.9199999999983, 0.6116773512383292, 0.24550721812397786, 0.1226641157108058], "isController": false}, {"data": ["downloads-en-0", 2216, 0, 0.0, 1789.6033393501832, 293, 126210, 1634.7999999999997, 2567.2000000000025, 35435.00999999999, 0.6135487398855133, 0.2456591634307231, 0.18170169099680905], "isController": false}, {"data": ["solutions-portals", 1458, 1, 0.06858710562414266, 6884.000685871048, 1121, 271871, 12282.40000000001, 20489.999999999978, 54829.97000000002, 0.4019001220309904, 121.13820771367415, 0.3792684207495961], "isController": false}, {"data": ["products-platform", 1479, 0, 0.0, 7265.093982420553, 1315, 171008, 12230.0, 30873.0, 60076.6000000003, 0.4099352335591442, 105.77994728761945, 0.476389578061896], "isController": false}, {"data": ["home-root-0", 1250, 0, 0.0, 1682.0311999999985, 304, 110114, 1609.0, 2558.9500000000025, 30690.31, 0.34813229807143065, 0.08227345325516232, 0.10097196535860829], "isController": false}, {"data": ["download-thanks-0", 2198, 0, 0.0, 1694.0705186533216, 304, 110391, 1640.6000000000008, 2490.899999999995, 32408.76999999984, 0.6094916540128287, 0.16368184067727334, 0.1958230021193561], "isController": false}, {"data": ["products-trial-1", 1481, 0, 0.0, 4426.043889264025, 679, 307187, 7473.5999999999985, 10626.099999999999, 51692.120000000024, 0.4112331914333545, 98.4391990095139, 0.13051834689046898], "isController": false}, {"data": ["download-thanks-1", 2198, 0, 0.0, 4880.464513193803, 739, 421803, 8905.400000000001, 12096.699999999997, 49275.509999999704, 0.6086364908866516, 180.8990034131271, 0.19733136227965656], "isController": false}, {"data": ["products-trial-0", 1481, 0, 0.0, 1645.625253207293, 304, 94446, 1587.6, 2535.7999999999956, 33810.180000000095, 0.41515073111099215, 0.10865273040795498, 0.1305454447438862], "isController": false}, {"data": ["download-ide-0", 2194, 0, 0.0, 1460.299908842296, 297, 90637, 1604.5, 2334.75, 28127.00000000014, 0.610276624430369, 0.23719735988602236, 0.19965104412516957], "isController": false}, {"data": ["download-ide-1", 2194, 0, 0.0, 564.2306289881496, 22, 129067, 295.0, 496.0, 9839.850000000464, 0.6103238193474876, 0.38741258064049505, 0.09357503870855034], "isController": false}, {"data": ["download-ide-2", 2194, 0, 0.0, 1301.5328167730154, 453, 217180, 1897.0, 2617.0, 6310.250000000154, 0.610250313886727, 27.96377966686772, 0.17770863245519222], "isController": false}, {"data": ["home-root-2", 1250, 0, 0.0, 8705.673599999984, 917, 332818, 17103.80000000001, 32556.950000000023, 88584.76000000001, 0.34724672240763654, 169.68017066343015, 0.10647995198827917], "isController": false}, {"data": ["home-root-1", 1250, 0, 0.0, 279.48080000000004, 74, 30747, 513.9000000000001, 602.45, 1811.5500000000027, 0.34812968025542135, 0.29645418084250724, 0.10165114687145604], "isController": false}, {"data": ["resources-gartner-2", 4255, 0, 0.0, 4631.063689776744, 667, 441154, 8363.4, 12580.399999999994, 43031.519999999524, 1.139281821372927, 294.8836621292916, 0.4005287653264196], "isController": false}, {"data": ["subscription-services", 2667, 0, 0.0, 6029.427071616057, 995, 247187, 11042.400000000001, 16274.399999999981, 55085.040000000794, 0.7400763996379258, 226.0470357232027, 0.22982841316880903], "isController": false}, {"data": ["resources-gartner-0", 4255, 0, 0.0, 1672.4119858989404, 289, 119921, 1582.4, 2503.19999999999, 32949.63999999989, 1.1742994289675797, 0.5137560001733161, 0.5791222769810818], "isController": false}, {"data": ["resources-gartner-1", 4255, 0, 0.0, 467.1623971797886, 145, 48090, 1146.4, 1305.0, 2350.319999999999, 1.1743529053297683, 0.5149262250908847, 0.27982627822310885], "isController": false}, {"data": ["our-story", 2678, 0, 0.0, 7927.278566094093, 1047, 266264, 14990.199999999999, 31189.39999999998, 63378.360000000015, 0.7353506507770882, 276.7891001487932, 0.22548838314844308], "isController": false}, {"data": ["products-dxp-short", 1493, 0, 0.0, 7869.2196918955215, 1058, 133909, 14619.600000000008, 28012.999999999985, 62336.55999999999, 0.4133345662312581, 167.86262840917965, 0.24564693408808652], "isController": false}, {"data": ["products-platform-0", 1479, 0, 0.0, 1890.664638269102, 296, 100542, 1575.0, 2653.0, 39696.800000000105, 0.4100761732434585, 0.1565818200568284, 0.12894973416444694], "isController": false}, {"data": ["resources-home", 4269, 0, 0.0, 7145.388615600856, 1137, 236983, 12662.0, 24396.5, 64745.5000000006, 1.1761467844411402, 395.11781616572983, 0.3498299052125977], "isController": false}, {"data": ["products-dxp-long-1", 1492, 0, 0.0, 414.97386058981226, 145, 24896, 761.4000000000001, 1297.35, 2339.6999999999994, 0.41731289096861623, 0.16219778379444263, 0.07865369917670208], "isController": false}, {"data": ["products-dxp-long-2", 1492, 0, 0.0, 425.24463806970493, 77, 57619, 628.4000000000001, 1287.1499999999974, 4210.5799999999945, 0.417320711526219, 4.64769456485575, 0.1259297850210954], "isController": false}, {"data": ["products-dxp-long-0", 1492, 0, 0.0, 1708.9021447721157, 297, 267252, 1570.4, 2262.7, 31486.799999999977, 0.41741586566371225, 0.15204699012945766, 0.13207298874515894], "isController": false}, {"data": ["products-dxp-long-3", 1452, 0, 0.0, 6475.678374655654, 803, 120904, 13513.0, 17876.94999999998, 57491.75000000011, 0.40563735350122027, 164.6252414561061, 0.12359263114490304], "isController": false}, {"data": ["home-fr", 1262, 1, 0.07923930269413629, 9063.290808240876, 1144, 267630, 18354.600000000002, 33197.799999999945, 74193.33999999997, 0.3497618875390815, 171.39599335866404, 0.10375328178918448], "isController": false}, {"data": ["gartner", 2687, 0, 0.0, 6438.781540751772, 956, 282993, 10648.400000000005, 21386.19999999999, 66385.83999999994, 0.722022630720491, 206.7910336106976, 0.25101568021142073], "isController": false}, {"data": ["downloads-en", 2216, 0, 0.0, 6999.362364620932, 1180, 129848, 12366.1, 30328.350000000013, 61080.40999999999, 0.6114493335864483, 146.95814756409456, 0.6848927521731837], "isController": false}, {"data": ["products-dxp-long", 1492, 0, 0.0, 8851.339142091156, 1268, 272351, 16575.7, 28903.4, 67318.1199999999, 0.4127134554268085, 167.91362151752276, 0.4552887936125677], "isController": false}, {"data": ["downloads-es-0", 2204, 0, 0.0, 1617.1656079854788, 291, 92651, 1645.0, 2602.25, 32037.949999999993, 0.6090118837450473, 0.24562686326826616, 0.1837740938254098], "isController": false}, {"data": ["download-ide", 2194, 0, 0.0, 3326.1640838650856, 791, 267444, 3855.0, 8047.5, 40556.85000000007, 0.6101927780875713, 28.58563734891193, 0.4708704390245259], "isController": false}, {"data": ["downloads-es-2", 2204, 0, 0.0, 4368.544010889292, 699, 232767, 7787.5, 10792.5, 46533.749999999935, 0.6037059437096252, 144.5081946995837, 0.1916058903375275], "isController": false}, {"data": ["home-root", 1290, 0, 0.0, 10433.735658914724, 1207, 334709, 20490.6, 36537.150000000016, 95646.72999999995, 0.3547184566612414, 173.57794451292483, 0.307011273241277], "isController": false}, {"data": ["home", 1285, 0, 0.0, 8585.998443579772, 1159, 162915, 17220.0, 30858.30000000005, 65506.32000000064, 0.3552980328378331, 173.34791156213763, 0.20663389857402448], "isController": false}, {"data": ["downloads-es-1", 2204, 0, 0.0, 459.584392014519, 146, 24038, 1164.0, 1316.5, 2399.849999999992, 0.6090398199850725, 0.24623289597052733, 0.12430597888367201], "isController": false}, {"data": ["products-trial", 1481, 0, 0.0, 6071.687373396361, 985, 307557, 9859.8, 17526.199999999997, 69757.60000000011, 0.4111950561082734, 98.53768779862659, 0.259807813771536], "isController": false}, {"data": ["downloads-enterprise", 2184, 0, 0.0, 2610.8315018315006, 431, 130520, 2796.0, 8993.75, 39189.400000000016, 0.6083701029549404, 3.819022255370593, 0.5985226516189776], "isController": false}, {"data": ["products-platform-1", 1479, 0, 0.0, 407.98985801217077, 146, 14059, 703.0, 1284.0, 2372.600000000005, 0.41009459348922844, 0.16660092860499903, 0.08450191330686249], "isController": false}, {"data": ["products-platform-2", 1479, 0, 0.0, 363.80256930358433, 79, 81598, 554.0, 783.0, 2798.2000000000016, 0.4100761732434585, 0.10932694853072675, 0.13095205922911224], "isController": false}, {"data": ["partners", 2662, 0, 0.0, 5920.9421487603295, 966, 161037, 9971.300000000008, 23262.59999999994, 68414.83999999988, 0.7329036862137017, 178.6434409112234, 0.22473804440537337], "isController": false}, {"data": ["products-platform-3", 1479, 0, 0.0, 4602.509127789058, 748, 169242, 8121.0, 11739.0, 39760.000000000095, 0.40999784882805484, 105.3636849650788, 0.13212821300122862], "isController": false}, {"data": ["downloads-es", 2204, 0, 0.0, 6445.36932849365, 1161, 234539, 10350.5, 17518.0, 61424.4499999997, 0.6036260837676346, 144.97657754400734, 0.4969304576329258], "isController": false}, {"data": ["blog-awesome-examples", 4242, 0, 0.0, 6618.494813767103, 941, 248244, 11866.1, 23310.35, 67834.8299999997, 1.1610453678066917, 366.4572757624219, 0.40251084528454645], "isController": false}, {"data": ["home-it", 1267, 1, 0.07892659826361484, 9114.479084451463, 1148, 159825, 18846.4, 36328.2, 93858.35999999956, 0.3507503344170513, 167.52342877752506, 0.10404682004819149], "isController": false}, {"data": ["home-es", 1282, 1, 0.078003120124805, 8398.324492979713, 1147, 156275, 15677.800000000003, 25394.94999999994, 87742.75000000033, 0.35284571999793024, 174.2647679768461, 0.10466936401898431], "isController": false}, {"data": ["home-zh", 1256, 2, 0.1592356687898089, 8535.085987261145, 1153, 268197, 17060.399999999998, 29461.899999999896, 63678.2000000003, 0.3452995955101155, 168.24268421396644, 0.10234758363136959], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, 85.71428571428571, 0.003643252696006995], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 505350; received: 491057", 1, 14.285714285714286, 6.072087826678325E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 164688, 7, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 6, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 505350; received: 491057", 1, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["resources-gartner", 4256, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["solutions-portals", 1458, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["home-fr", 1262, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["home-it", 1267, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["home-es", 1282, 1, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 505350; received: 491057", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["home-zh", 1256, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Connection reset", 2, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
