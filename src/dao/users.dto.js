import { createHash } from '../utils.js';

class UserDTO {
    constructor(data) {
        if (!data.password) {
            throw new Error("Password is required");
        }
        if (!data.username) {
            throw new Error("username is required");
        }

        this.firstname = data.firstname?.trim() || "";
        this.lastname = data.lastname?.toUpperCase().trim() || "";
        this.username = data.username.toLowerCase().trim();
        this.password = createHash(data.password);
    }
}

export default UserDTO;
