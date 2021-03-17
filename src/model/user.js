import {Model} from "objectmodel";

const User = new Model({
  name: String,
  email: String,
  password: [String],
  address: [String],
  type: ["Local", "Google"],
  avatar: String
});

export default User;
