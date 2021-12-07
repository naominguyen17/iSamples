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


function handleTableNodeOnClick(cells, colNames) {
    // filter out non-plantname cells
    let nodes = cells.filter((d)=> {
        return (d.col != colNames[0]);
    });
    nodes.each((d)=> {
        let self = d3.select(this);
        let key = keyfn(d.row.PlantName,
            d.col);
        cellLookup[key] = self;
    });
    nodes.on("click", (d) => {
        let datum = d.target.__data__;
        let self = nodes.filter((d)=>d == datum);
        // unset style of others
        nodes.style("color", null)
             .style("border-color", null);
        self.style("color", "blue")
            .style("border-color", "blue");
        // dispatch
        let leaf = leafLookup[keyfn(datum.row.PlantName, datum.col)];
        leaf.dispatch("click");
        console.log("dispatch", leaf);
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
        console.log(key, leaf.elem);
        leafLookup[key] = leaf.elem;
        leaf.elem.on("click", (d) => {
            let self = leaf.elem;
            let datum = leaf;
            leafElems.forEach((elem)=>elem.style("color",null));
            self.style("color", "blue");
            cellLookup[key]
                .dispatch("click");
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
