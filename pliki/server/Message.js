const mongoose=require('mongoose')
mongoose.connect('mongodb://' + process.env.MONGODB_URI + '/' + process.env.NAME_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const messageSchema = new mongoose.Schema({
    content:String,
    name:String
},{
    timestamps:true
});
module.exports = mongoose.model("Message",messageSchema)