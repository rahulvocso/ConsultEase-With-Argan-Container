module.exports.formatMongoData=(data)=>{
    if(Array.isArray(data)){
        let dataArray=[];
        for(d of data){
            dataArray.push(d.toObject());
        }
        return dataArray;
    }
    return data.toObject();
}