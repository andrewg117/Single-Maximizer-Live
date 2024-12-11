import fs from "fs";
import { parse } from "csv-parse";
import { encodeEmail, decodeEmail, type emailType } from "./encodeData";
import Distro from "../models/distroModel";

const DISTRO_FILE: string = process.env.DISTRO_FILE as string;

interface distroType {
  email: string;
  fname: string;
  lname: string;
  tags: Array<string>;
}

const addDistrosToCollection = async (distroData: distroType) => {
  await Distro.create({
    email: await encodeEmail(distroData.email),
    fname: distroData.fname,
    lname: distroData.lname,
    tags: distroData.tags,
  });
};

export const getDataFromFile = () => {
  const distroArray: Array<distroType> = [];
  fs.createReadStream(DISTRO_FILE)
    .pipe(
      parse({
        delimiter: ",",
        columns: true,
      })
    )
    .on("data", async (row) => {
      const renamedColumns: distroType = {
        // email: await encodeEmail(row["Email Address"]),
        email: row["Email Address"],
        fname: row["First Name"],
        lname: row["Last Name"],
        tags: row.TAGS.toString()
          .replace(/"/g, "")
          .replace(/ Standard/g, "")
          .split(","),
      };
      distroArray.push(renamedColumns);
    })
    .on("end", function () {
      Distro.find({}).then((data) => {
        if (data.length < 0) {
          distroArray.forEach((dist: distroType) => {
            addDistrosToCollection(dist);
          });
        } else {
          distroArray.forEach((dist: distroType) => {
            if (
              data.find(
                (item) => decodeEmail(item.email as emailType) === dist.email
              ) === undefined
            ) {
              console.log("Distro Added");
              addDistrosToCollection(dist);
            }
          });
        }
      });
    })
    .on("error", function (err) {
      console.error(err);
    });
};

export const findDistro = (email: string) => {
  Distro.find({}).then((data) => {
    const emailFound = data.find(
      (item) => decodeEmail(item.email as emailType) === email
    );

    emailFound ? console.log(emailFound) : console.log("Email not found");
  });
};

// Find Distros if email contains string
export const findDistrosByComapany = async (company: string) => {
  let emailArray: string[] = [];

  await Distro.find({}).then((data) => {
    data.forEach((item) => {
      let email = decodeEmail(item.email as emailType);
      if (email.toLocaleLowerCase().includes(company.toLocaleLowerCase())) {
        emailArray.push(email);
      }
    });
  });

  return emailArray.length > 0 ? emailArray : [];
};

// Find Distros if email does not contains string
export const findDefaultDistros = async (company: string) => {
  let emailArray: string[] = [];

  await Distro.find({}).then((data) => {
    data.forEach((item) => {
      let email = decodeEmail(item.email as emailType);
      if (!email.toLocaleLowerCase().includes(company.toLocaleLowerCase())) {
        emailArray.push(email);
      }
    });
  });

  return emailArray.length > 0 ? emailArray : [];
};

// Update tags
export const updateDistroTags = async (oldTag: string, newTag: string) => {
  await Distro.updateMany(
    { "tags": oldTag },
    { $set: { "tags": newTag } }
  );
}


export const deleteDistro = async (email: string) => {
  await Distro.find({}).then(async (data) => {
    const emailFound = data.find(
      (item) => decodeEmail(item.email as emailType) === email
    );

    if (emailFound) {
      console.log("Distro Deleted");
      await Distro.findByIdAndDelete(emailFound._id);
    } else {
      console.log("Email not found");
    }
  });
};
