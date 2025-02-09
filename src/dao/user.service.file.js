import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "data", "users.json");

class UserService {
  get = ()=> {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  write = (data)=> {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

add = (user)=> {
    const users = this.get();
    users.push(user);
    this.write(users);
    return "Usuario guardado correctamente."
  }

  async getOne(username) {
    if (!username) {
      console.error("ID no proporcionado.");
      return null;
    }
    const users = await this.get();
    const user = users.find(user => user.username === username);
    return user || null;
  }
}

export default UserService;
