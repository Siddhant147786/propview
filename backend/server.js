

const express = require("express");
const app = express();

app.listen(3000, () => {
    console.log("server started: ");
})

app.get("/searchhomes", (req,res) => {
    
    const arr = [
        {title : "firsthome" },
        {title : "secondhome"}
    ];

    res.json(arr);

} )

