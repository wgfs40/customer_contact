"use client";
interface UserTableRow {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
  };
  selectedUsers: number[];
  handleUserSelect: (id: number) => void;
  getColor: (status: string) => string;
}

const UserTableRow = ({
  user,
  selectedUsers,
  handleUserSelect,
  getColor,
}: UserTableRow) => {
  return (
    <>
      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <input
            type="checkbox"
            checked={selectedUsers.includes(user.id)}
            onChange={() => handleUserSelect(user.id)}
            className="rounded border-gray-300 text-[#F9A825] focus:ring-[#F9A825]"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F9A825] rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
              user.role === "VIP"
                ? "bg-purple-100 text-purple-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {user.role}
          </span>
        </td>
        <td className="px-6 py-4">
          <span
            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getColor(
              user.status
            )}`}
          >
            {user.status === "active" ? "Activo" : "Inactivo"}
          </span>
        </td>
        <td className="px-6 py-4 text-gray-600">{user.lastLogin}</td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button className="text-[#F9A825] hover:text-[#FF8F00] p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserTableRow;
