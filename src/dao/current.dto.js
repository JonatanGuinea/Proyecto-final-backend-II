class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.firstname = user.firstname;
        this.lastname = user.lastname;
    }
}

export default UserDTO;
