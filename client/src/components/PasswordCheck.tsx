import styles from "../css/sign_in_style.module.css";

export interface passwordReqTypes {
  length: boolean;
  numbers: boolean;
  specialCharacters: boolean;
  uppercase: boolean;
  lowercase: boolean;
}

// Password Safety Requirements
export const PasswordRequirementsList = ({
  passwordReq,
}: {
  passwordReq: passwordReqTypes;
}) => {
  return (
    <ul id={styles.password_requirements_list}>
      <li>{passwordReq.length ? "✅" : "❌"} 8-12 characters</li>
      <li>{passwordReq.numbers ? "✅" : "❌"} At least one number</li>
      <li>
        {passwordReq.specialCharacters ? "✅" : "❌"} At least one special
        character
      </li>
      <li>
        {passwordReq.uppercase ? "✅" : "❌"} At least one uppercase letter
      </li>
      <li>
        {passwordReq.lowercase ? "✅" : "❌"} At least one lowercase letter
      </li>
    </ul>
  );
};
