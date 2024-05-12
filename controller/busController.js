const Bus = require("../model/Bus");

async function add(req, res, next){
  try{
      const bus = new Bus(req.body);
      await bus.save();
      
      res.status(200).send ("Bus add");
  }catch(err){
      console.log (err);
  }
}
async function show(req, res, next) {
  try {
    const data = await Bus.find();
    res.json(data);
  } catch (err) {
    console.log(err);
  }
}

async function update(req, res, next) {
  try {
    await Bus.findByIdAndUpdate(req.params.id, req.body);
    res.send("updated");
  } catch (err) {
    console.log(err);
  }
}

async function deleteBus(req, res, next) {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.send("Removed");
  } catch (err) {
    console.log(err);
  }
}
module.exports = { add,update,show,deleteBus };
