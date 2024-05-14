const Message = require("../model/mesage");


async function add(req, res, next) {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(200).send("message added successfully");
    } catch (err) {
        console.error(err);
    }
}
async function show(req, res, next) {
    try {
        const data = await Message.find();
        const formattedData = data.map(message => {
            const { timestamp, ...rest } = message.toObject(); // Extracting timestamp and other fields
            const date = timestamp.toDateString(); // Extracting date
            const time = timestamp.toLocaleTimeString(); // Extracting time
            return { ...rest, date, time }; // Combining all fields
        });
        res.json(formattedData);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
async function update(req, res, next) {
    try {
        // Get the current date and time
        const currentTime = new Date();

        // Construct the update object including timestamp and other fields from req.body
        const updateData = {
            ...req.body,
            timestamp: currentTime
        };

        // Update the document with the new timestamp and other fields
        const data = await Message.findByIdAndUpdate(req.params.id, updateData, { new: true });

        res.send("updated");
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


async function deletemessage(req, res, next) {
    try {
        const data = await Message.findByIdAndDelete(req.params.id, req.body);
        res.send("removed");
    }
    catch (err) { }
}

module.exports = {
    add,
    show,
    update,
    deletemessage
}