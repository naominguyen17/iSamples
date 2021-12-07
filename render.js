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
    // data:
    // root{
    //   AllPlants: {
    //     PlantA: {}
    //     PlantB: {}
    //}
    //}
    let marginXPerDepth = 10;
    var treeul = d3.select(treeID).append("ul")
                   .classed("treelist", "true");
    var leaves = [];
    const depth = 4;
    var root = {name: "root", data: data, parent: [], children: undefined, leafParent: false};
    var nodes = [root,
                 {name: "AllPlants", data: data, parent: [root], children: Object.entries(data["AllPlants"]),
                leafParent: false}];
    let visitOrder = [];
    while(nodes.length > 1) {
        let v = nodes.pop();
        let vName=v.name;
        let vParent=v.parent;
        let vData=v.data[v.name];
        let vChildren = v.children;
        visitOrder.push(v);
        if(vParent[vParent.length-1].leafParent) {
            // is leaf
            console.log(v, "isLeaf");
            leaves.push(v);
            continue;
        }
        for(let entry of vChildren) {
            let key=entry[0];
            let value=entry[1];
            let parentOfLeaf = typeof(value) == 'string';
            let nChildren = (parentOfLeaf)? [value]: Object.entries(value);
            // push children
            var child = v.leafParent?
                {name:entry, data: vData, children: [], leafParent:false}
                :{name: key, data: vData, children: nChildren,
                leafParent: parentOfLeaf};
            child.parent = vParent.slice();
            child.parent.push(v);
            nodes.push(child);
        }

    }
    console.log(visitOrder);
    console.log("leaves", leaves);
    var ulSelects = treeul.selectAll("li").data(visitOrder);
    ulSelects.exit().remove();
    ulSelects.join("li").text((d)=>d.name)
        .attr("transform", (d)=>{
            let txt = "translate("+(marginXPerDepth*d.parent.length)+")";
            console.log(d.name, txt);
            return txt;
        });
}