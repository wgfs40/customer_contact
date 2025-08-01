"use client";
import UserTableRow from "./UserTableRow";

interface UserTableProps {
  users: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    lastLogin: string;
  }>;
  selectedUsers: number[];
  handleUserSelect: (id: number) => void;
  getColor: (status: string) => string;
}

const UserTable = ({
  users,
  selectedUsers,
  handleUserSelect,
  getColor,
}: UserTableProps) => {
  return (
    <>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-[#F9A825] focus:ring-[#F9A825]"
              />
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-800">
              Usuario
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-800">
              Rol
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-800">
              Estado
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-800">
              Último Acceso
            </th>
            <th className="px-6 py-4 text-left font-semibold text-gray-800">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Aquí se mapearán los usuarios */}
          {users.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              selectedUsers={selectedUsers}
              handleUserSelect={handleUserSelect}
              getColor={getColor}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default UserTable;
