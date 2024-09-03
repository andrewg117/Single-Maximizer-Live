import crypto from "crypto";
import User from "../models/userModel";
const ENCEMAILKEY: string = process.env.ENCEMAILKEY as string;

export const EncUserEmails = async () => {
  try {
    let userList: Array<{
      _id: string;
      email: string;
      emailEncrypted: object;
    }> = [];

    const users = await User.find();
    users.forEach((user) => {
      const email = user.email;
      console.log("Original Email: " + email);
      const dataEMKey = Buffer.from(ENCEMAILKEY, "hex");
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(dataEMKey),
        iv
      );
      let encrypted = cipher.update(email.toString());
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      const emailEncrypted: { iv: Buffer; encryptedData: Buffer } = {
        iv: iv,
        encryptedData: encrypted,
      };
      console.log(
        "Test encrypted: " +
          JSON.stringify(emailEncrypted.encryptedData.toString("hex"))
      );
      userList.push({
        _id: user._id,
        email: email.toString(),
        emailEncrypted: emailEncrypted,
      });
    });

    userList.forEach(async (user) => {
      let updatedUser = await User.findByIdAndUpdate(
        user._id,
        { encEmail: user.emailEncrypted },
        {
          new: true,
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

interface emailType {
  iv?: any;
  encryptedData?: any;
}

export const DecUserEmails = async () => {
  try {
    const users = await User.find();
    users.forEach((user) => {
      const encEmail: emailType = user.encEmail;
      // console.log("Encrypted Email: " + Buffer.from(encEmail.iv.toString("binary"), "binary"));
      const dataEMKey = Buffer.from(ENCEMAILKEY, "hex");
      let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(dataEMKey),
        Buffer.from(encEmail.iv.toString("hex"), "hex")
      );
      let decrypted = decipher.update(
        Buffer.from(encEmail.encryptedData.toString("hex"), "hex")
      );
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      console.log("Email decrypted: " + decrypted.toString());
    });
  } catch (error) {
    console.log(error);
  }
};

const decodeEmail = (encEmail: emailType) => {
  const dataEMKey = Buffer.from(ENCEMAILKEY, "hex");
  let decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(dataEMKey),
    Buffer.from(encEmail.iv.toString("hex"), "hex")
  );
  let decrypted = decipher.update(
    Buffer.from(encEmail.encryptedData.toString("hex"), "hex")
  );
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export const FindUserByEncEmail = async (userEmail: string): Promise<void> => {
  try {
    let matchedUser: any;
    await User.find().then((users) => {
      users.forEach((user) => {
        let decodedEmail = decodeEmail(user.encEmail as emailType);
        userEmail.trim() === decodedEmail ? (matchedUser = user) : null;
      });
    });

    matchedUser ? console.log(matchedUser) : console.log("User not found");
  } catch (error) {
    console.log(error);
  }
};

// Test crypto for encryption
// import crypto from "crypto";
// const email = "test@email.com";
// const algorithm = "aes-256-cbc"; //Using AES encryption
// const dataEMKey = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// const cipher = crypto.createCipheriv(algorithm, Buffer.from(dataEMKey), iv);
// let encrypted = cipher.update(email);
// encrypted = Buffer.concat([encrypted, cipher.final()]);
// const emailEncrypted = {
//   iv: iv,
//   encryptedData: encrypted,
// };
// // console.log("Test encrypted: " + JSON.stringify(emailEncrypted));
// console.log("Test encrypted: " + JSON.stringify(emailEncrypted.encryptedData.toString("hex")));

// let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(dataEMKey), emailEncrypted.iv);
// let decrypted = decipher.update(emailEncrypted.encryptedData);
// decrypted = Buffer.concat([decrypted, decipher.final()]);
// const userEmail = " test@email.com ".trim();
// userEmail != decrypted.toString() ? console.log("Wrong Email") : console.log("Test decrypted: " + decrypted.toString());
