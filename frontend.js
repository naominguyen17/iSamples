// verify d3 is imported dynamically
const div = d3.selectAll("div");

// shared memory
var tableElements;
var treeElements;
var dataTable;
var dataHierarchy;

function handleTableNodeOnClick(cells, colNames) {
    // see funExamplePlantName on how flexible cells can be.
    
    // filter out non-plantname cells
    let nodes = cells.filter((d)=> {
        return (d.col != colNames[0]);
    });
    nodes.on("click", (d) => {
        let datum = d.target.__data__;
        let self = nodes.filter((d)=>d == datum);
        // unset style of others
        nodes.style("color", null)
             .style("border-color", null);
        self.style("color", "blue")
            .style("border-color", "blue");
        // dispatch event of corresponding tree
    });
}

// example on how to get the database in JSON
getDatabaseJSON((err, dataJSON)=> {
    if(err) {throw err;}
    let data = JSON.parse(dataJSON);
    dataTable = data;
    // 0: {PlantName: 'PlantA', Leaf_Color: 'Green', Leaf_Shape: 'Toothed', Stem_Color: 'Green'}
    // 1: {PlantName: 'PlantB', Leaf_Color: 'Red', Leaf_Shape: null, Stem_Color: null}
    let colNames = data["colnames"];
    data = data["data"];
    console.log("db",data);
    // table selects the whole table
    // headers selects the whole header row (d: <colName:str>)
    // rows selects the whole rows of data values (d: {PlantName: "PlantA", Leaf_Color: "Green",...})
    // cells selects each cell of the data (d: {col: <colname>, val: <cell_val>, row: <row>})
    let [table, headers, rows, cells] = makeTable(data, colNames, "#table");
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
    makeTreeList(data, "#tree");
    console.log("Done hierarchy");
})