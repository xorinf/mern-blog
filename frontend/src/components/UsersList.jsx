import { useEffect, useState } from "react";
import axios from "axios";
import {
  loadingClass,
  errorClass,
  emptyStateClass,
  primaryBtn,
  headingClass,
} from "../styles/common";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/admin-api/users", { withCredentials: true });
        // filter only role=USER
        const filtered = res.data.payload.filter((u) => u.role === "USER");
        setUsers(filtered);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleStatus = async (userId) => {
    try {
      const res = await axios.patch(`/admin-api/users/status/${userId}`, {}, { withCredentials: true });
      // update local state
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isUserActive: res.data.payload.isUserActive } : u))
      );
    } catch (err) {
      console.log("Toggle error:", err);
    }
  };

  if (loading) return <p className={loadingClass}>Loading users...</p>;
  if (error) return <p className={errorClass}>{error}</p>;
  if (users.length === 0) return <div className={emptyStateClass}>No users found.</div>;

  return (
    <div>
      <h2 className={`${headingClass} mb-6`}>Users</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e8e8ed] text-left text-[#6e6e73]">
              <th className="py-3 px-2 sm:px-4 font-medium">Name</th>
              <th className="py-3 px-2 sm:px-4 font-medium">Email</th>
              <th className="py-3 px-2 sm:px-4 font-medium">Status</th>
              <th className="py-3 px-2 sm:px-4 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-[#f5f5f7] hover:bg-[#f5f5f7] transition">
                <td className="py-3 px-2 sm:px-4 text-[#1d1d1f] font-medium">
                  {user.firstName} {user.lastName || ""}
                </td>
                <td className="py-3 px-2 sm:px-4 text-[#6e6e73]">{user.email}</td>
                <td className="py-3 px-2 sm:px-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      user.isUserActive
                        ? "bg-[#34c759]/20 text-[#248a3d]"
                        : "bg-[#ff3b30]/20 text-[#cc2f26]"
                    }`}
                  >
                    {user.isUserActive ? "Active" : "Blocked"}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <button
                    onClick={() => toggleStatus(user._id)}
                    className={`text-xs font-medium px-4 py-1.5 rounded-full transition ${
                      user.isUserActive
                        ? "bg-[#ff3b30] text-white hover:bg-[#d62c23]"
                        : "bg-[#34c759] text-white hover:bg-[#248a3d]"
                    }`}
                  >
                    {user.isUserActive ? "Block" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersList;