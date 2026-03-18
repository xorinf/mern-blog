function User(props) {
    const { userObj } = props;

    return (
        <div className="shadow-2xl p-2 font-mono">
               
                <h2 className="">{userObj.name}</h2>
                <img src={userObj.image} alt="" />
                <p className="font-bold">{userObj.email}</p>
            </div>
    )

}

export default User;