// verify d3 is imported dynamically
const div = d3.selectAll("div");

// shared memory
var dataTable;
var dataHierarchy;
var cells;
var leaves;
var colNames;
var leafElems = [];
var leafLookup = {};
var cellLookup = {};
var nodes;
var selectedKey = null;

function updateHighlighting(selectedKey, nodes, leaves) {
    console.log(selectedKey);
    leaves.map((leaf)=> {
        let key = keyfn(leaf.parent[2].name,
            leaf.parent[3].name, leaf.parent[4].name);
        function highlight(color) {return selectedKey == key? color: null;}
        leaf.elem.style("color", highlight("blue"));
    });
    function highlight(color, key) {return selectedKey == key? color: null;}
    nodes.style("color", (d)=> {
        return highlight("blue", keyfn(d.row.PlantName,
            d.col));
    });
}

function handleTableNodeOnClick(cells, colNames) {
    // filter out non-plantname cells
    nodes = cells.filter((d)=> {
        return (d.col != colNames[0]);
    });
    nodes.on("click", (d) => {
        let datum = d.target.__data__;
        selectedKey = keyfn(datum.row.PlantName, datum.col);
        updateHighlighting(selectedKey, nodes, leaves);
    });
}
function keyfn(plant, part, char=null) {
    return char? plant+"__"+part+"_"+char:
        plant+"__"+part;
}
function handleTreeOnClick(leaves) {
    leaves.map((leaf)=> {
        leafElems.push(leaf.elem);
        let key = keyfn(leaf.parent[2].name,
            leaf.parent[3].name, leaf.parent[4].name);
        leaf.elem.on("click", (d) => {
            selectedKey = key;
            updateHighlighting(selectedKey, nodes, leaves);
        });
    });
}

// example on how to get the database in JSON
getDatabaseJSON((err, dataJSON)=> {
    if(err) {throw err;}
    let data = JSON.parse(dataJSON);
    dataTable = data;
    // 0: {PlantName: 'PlantA', Leaf_Color: 'Green', Leaf_Shape: 'Toothed', Stem_Color: 'Green'}
    // 1: {PlantName: 'PlantB', Leaf_Color: 'Red', Leaf_Shape: null, Stem_Color: null}
    colNames = data["colnames"];
    data = data["data"];
    console.log("db",data);
    // table selects the whole table
    // headers selects the whole header row (d: <colName:str>)
    // rows selects the whole rows of data values (d: {PlantName: "PlantA", Leaf_Color: "Green",...})
    // cells selects each cell of the data (d: {col: <colname>, val: <cell_val>, row: <row>})
    [table, headers, rows, cells] = makeTable(data, colNames, "#table");

    handleTableNodeOnClick(cells, colNames);
    console.log("Done table");
});

getDatabaseHiearchyJSON((err, hierarchyJSON)=> {
    if(err) {throw err;}
    let data = JSON.parse(hierarchyJSON);
    dataHierarchy = data;
    let colNames = data["colnames"];
    // {AllPlants: {
    //   PlantA: {
    //      Leaf: {Color: Green, Shape: Toothed},
    //      Stem: {Color: Green}
    //   },
    //   PlantB: {...}
    //}}
    data = data["data"];
    console.log("hierarchy", data);
    [leaves, visitOrder, treeul] = makeTreeList(data, "#tree");

    handleTreeOnClick(leaves);
    console.log("Done hierarchy");

})
// join cells with leaves
