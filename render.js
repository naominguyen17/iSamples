// helper file to render images related to front end
// param data: [{PlantName: "PlantA", Leaf_Color: "Green",...},...]
// param columnNames: array of columns we want to display (["PlantName", "Leaf_Color",...])
// param tableID: the tableID of the space we created in index.html
// return [table, theadJoined, rows, cells]: each are d3.selection
// table selects the whole table
// headers selects the whole header row (d: <colName:str>)
// rows selects the whole rows of data values (d: {PlantName: "PlantA", Leaf_Color: "Green",...})
// cells selects each cell of the data (d: {col: <colname>, val: <cell_val>})
function makeTable(data, columnNames, tableID) {
    var table = d3.select(tableID)
                  .append("table");
    let thead = table.append("thead");
    let tbody = table.append("tbody");

    // make the column names
    var theadJoined = thead.append("tr")
         .selectAll("th")
         .data(columnNames);
    theadJoined.exit().remove(); // if there is a column deleted, remove.
    theadJoined.join("th")
               .text((col)=>col);
    
    // make data
    // make a row for each obj in data
    var rows = tbody.selectAll("tr")
                    .data(data);
    rows.exit().remove();
    rows = rows.join("tr");
    
    // for each row, append a cell
    var cells = rows.selectAll("td").data(function(row) {
        // we make sure that each cell is accessed by column name
        // and by the order declared by columnNames.
        return columnNames.map(function(col) {
            return {col: col, val: row[col], "row": row};
        });
    }).join("td")
      .text((d) => {return d.val? d.val: ""});
    return [table, theadJoined, rows, cells];
}

function makeTreeList(data, treeID) {
    var treeul = d3.select(treeID).append("ul")
                   .classed("treelist", "true");
    var leaves = [];
    const rootKey = "AllPlants";
    const depth = 4;
    let nodes

}