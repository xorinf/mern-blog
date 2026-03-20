function User(props) {
    const { userObj } = props;

    return (
        <div className="flex flex-col items-center bg-white shadow-lg rounded-xl p-4 border border-gray-100">
                <img className="w-24 h-24 rounded-full border-2  mb-3" src={userObj.image} alt={userObj.name} />
                <h2 className="text-xl font-bold text-gray-800">{userObj.name}</h2>
                <p className="text-sm text-gray-500 font-mono">{userObj.email}</p>
        </div>
    )

}

export default User;