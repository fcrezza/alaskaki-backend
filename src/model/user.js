import {Model} from "objectmodel";

const User = new Model({
  name: String,
  email: String,
  password: [String],
  gender: ["Male", "Female", "Other"],
  address: String,
  type: ["Local", "Google"],
  avatar: [
    {
      url: String,
      publicId: Number
    }
  ]
});

export default User;
