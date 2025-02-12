class UserDTO{
    constructor(data){
        this.firsstname = data.firstname?.trim();
        this.email = data.email?.toLowerCase().trim()
    }
}

export default UserDTO