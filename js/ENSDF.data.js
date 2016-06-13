function parseENSDFFile(data){

    var rows = data.split('\n');
    var instance =[];

    for(var i=0; i < rows.length; i++){
        //if(i % 100 ==0 )$.toaster('Processed ' + i + 'records', 'Fail', 'info');
        var row = parseENSDFRow(rows[i]);
        if(row) addRow(row);
    }
}

function parseENSDFRow(row){

    if((/^\s*$/g).test(row))return null;

    var config = ENSDF.selector(row);
    var ar = row.split('');

    var row={
        meta:{
            level: config.level
        }};
    for(var i=0; i < config.fields.length; i++){
        row[config.fields[i].key]= ar.slice(config.fields[i].start,config.fields[i].end).join('');
    }

    return row;
}

function addRow(row){
    var key = uuid.v4();
    ENSDF.data[key]=row;
    return key;
}

function deleteRow(id){
    delete ENSDF.data[id];
}
