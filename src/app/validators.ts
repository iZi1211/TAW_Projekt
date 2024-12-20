export const returnMsgs = {
    empty: "This field cannot be empty",
    good: "Input is valid",
    notMail: "Invalid email format",
    different: "Passwords do not match"
  };
  
  export const ValidateLogin = (login: string) => {
    if (login.length === 0) {
      return returnMsgs.empty;
    }
    return returnMsgs.good;
  };
  
  export const ValidatePassword = (pass: string) => {
    if (pass.length === 0) {
      return returnMsgs.empty;
    }
    return returnMsgs.good;
  };
  
  export const ValidateMail = (control: any) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    const mail = control.value;
    if (mail.length === 0) {
      return { 'empty': returnMsgs.empty };
    }
    if (!emailRegex.test(mail)) {
      return { 'notMail': returnMsgs.notMail };
    }
    return null;
  };
  
  export const ValidatePasswordRepeat = (control: any, password: string) => {
    const passRe = control.value;
    if (passRe.length === 0) {
      return { 'empty': returnMsgs.empty };
    }
    if (passRe !== password) {
      return { 'different': returnMsgs.different };
    }
    return null;
  };
  