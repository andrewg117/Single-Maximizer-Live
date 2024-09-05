import fs from "fs";
import { parse } from "csv-parse";
import { encodeEmail, decodeEmail } from "./encodeData";
  
const DISTRO_FILE: string = process.env.DISTRO_FILE as string;

// TODO: Create Distro Model to import data

export const getDataFromFile = () => {
  const dataArray: Array<{email: any, fname: string, lname: string, tags: Array<string>}> = [];
  fs.createReadStream(DISTRO_FILE)
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
      })
    )
    .on("data", async (row) => {
      const renamedColumns = {
        email: await encodeEmail(row["Email Address"]),
        fname: row["First Name"],
        lname: row["Last Name"],
        tags: row.TAGS.toString().replace(/"/g, '').replace(/ Standard/g, '').split(","),
      };
      dataArray.push(renamedColumns);
    })
    .on("end", function () {
      console.log(dataArray.at(0));
      console.log(dataArray.at(-1));
      console.log("File end");
    })
    .on("error", function (err) {
      console.error(err);
    });
};
