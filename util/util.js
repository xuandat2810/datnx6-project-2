import fs from "fs";
import axios from "axios";
import Jimp from "jimp";

/**
 
Function to filter an image from a URL
@param {string} imageUrl - The URL of the image to filter
@returns {Promise<string>} - The path to the filtered image file
*/
export async function filterImageFromURL(imageUrl) {
  try {
    // Fetch the image data from the URL as a buffer
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageData = response.data;

    // Read the image from the buffer using Jimp
    const image = await Jimp.read(imageData);

    // Define the output path for the filtered image
    const outpath =
      "/tmp/filtered_" + Math.floor(Math.random() * 2000) + ".jpg";

    // Apply image processing operations
    await image
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .writeAsync(outpath); // write the filtered image to the defined path

    // Return the path to the filtered image
    return outpath;
  } catch (error) {
    console.error("Error filtering image:", error);
    throw error;
  }
}
// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}