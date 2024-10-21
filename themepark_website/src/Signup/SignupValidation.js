function Validation(values) {
    alert("");
    let error = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern =
      /^( ?=.* \d)( ?=.* [a-z])( ?=.* [A-Z])[a-zA-Z0-9]{8,}$/;
  
      if(values.email === ""){
          error.email = "Email cannot be empty"
      } else if (!email_pattern.test(values.email)) {
          error.email = "No match for email found"
      } else {
          error.email = ""
      }
  
      if(values.password === ""){
          error.password = "Password cannot be empty"
      } else if (!password_pattern.test(values.email)) {
          error.password = "Wrong password"
      } else {
          error.password = ""
      }
  
      return error;
  }
  
  
  export default Validation;