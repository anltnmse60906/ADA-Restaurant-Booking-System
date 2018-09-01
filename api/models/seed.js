const User = require("./User");

User.create([
  {
    firstName: "Adam",
    lastName: "Smith",
    email: "abc@abc.com",
    password:"adsfasdfasfasfkjaskfajdksfhkasf"
  },
  {
    firstName: "Adam",
    lastName: "Smith",
    email: "abc@abc.com",
    password:"adsfasdfasfasfkjaskfajdksfhkasf"
  },
  {
    firstName: "Adam",
    lastName: "Smith",
    email: "abc@abc.com",
    password:"adsfasdfasfasfkjaskfajdksfhkasf"
  },
  {
    firstName: "Adam",
    lastName: "Smith",
    email: "abc@abc.com",
    password:"adsfasdfasfasfkjaskfajdksfhkasf"

  }
]).then((user) => {
  console.log(`created ${user} user`);
}).catch((error) => {
  console.error(error);
});
