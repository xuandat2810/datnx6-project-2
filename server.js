import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";
 
// Init the Express application
const app = express();
 
// Set the network port
const port = process.env.PORT || 8082;
 
// Use the body parser middleware for post requests
//app.use(bodyParser.json());
 
// Endpoint to filter an image from a public URL
app.use("/filteredimage", async (req, res) => {
  // 1. Validate the image_url query parameter
  const imageUrl = req.query.image_url;
  if (!imageUrl) {
    return res.status(400).send("Image URL is required");
  }
 
  try {
    // 2. Call filterImageFromURL(image_url) to filter the image
    const filteredImagePath = await filterImageFromURL(imageUrl);
 
    // 3. Send the resulting filtered image file in the response
    res.sendFile(filteredImagePath, async (err) => {
      if (err) {
        console.error("Error sending file:", err);
        return res.status(500).send("Error sending file");
      }
 
      // 4. Delete any files on the server after sending the response
      await deleteLocalFiles([filteredImagePath]);
    });
  } catch (error) {
    console.error("Error filtering image:", error);
    res.status(500).send("Error filtering image");
  }
});
 
// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Press CTRL+C to stop server`);
});