## Database Entity Relationship Diagram
![erd NODE TRUE](https://github.com/user-attachments/assets/85ef72db-f1f7-404d-99d3-cf9d6a980ae4)



## Implement password encryption using bcrypt:

1. First install bcrypt:

```sh
npm install bcrypt
```

2. Create a new file called auth.js in  utils or helper folder to handle password hashing:

```javascript
import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash); 
};
```

3. Modify UserController:

```javascript
import { comparePassword } from '../utils/auth.js';
import UserModel from "../models/user.model.js";

class UserController {
    processLogin = async (req, res) => {
        let redirect_url = "/login";
        
        try {
            const { username, password } = req.body;
            const userModel = new UserModel();
            const [userData] = await userModel.fetchUserByUsername(username);

            if (userData && await comparePassword(password, userData.password)) {
                req.session.user = {
                    id: userData.id,
                    username: userData.username
                };
                redirect_url = "/";
            } else {
                req.flash("error", "Incorrect username or password.");
            }
        } catch(error) {
            console.log(error);
            req.flash("error", "Something went wrong.");
        }

        res.redirect(redirect_url);
    }
}

export default new UserController();
```

4. Generate a hashed password for your test user. Create a script called generate-password.js:

```javascript
import { hashPassword } from './utils/auth.js';

const password = 'password'; // your test password

const generateHash = async () => {
  const hash = await hashPassword(password);
  console.log('Hashed password:', hash);
};

generateHash();
```

5. Run the script to get the hashed password:

```sh
node generate-password.js
```

6. Update your user's password in the database:

```sql
UPDATE users 
SET password = 'the_hashed_password_from_step_5'
WHERE username = 'user';
```