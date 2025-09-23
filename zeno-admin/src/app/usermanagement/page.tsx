import UserStatsContainer from "./components/UserCard";
import UsersTable from "./components/UsersTable";




export default function UserManagementPage() {
  return (
    <div className="">
      <h1 className="text-5xl pt-10 ml-70 font-black">User Management</h1>
      <div className="flex ">
        <UserStatsContainer />
      </div>

      <UsersTable />
    </div>
  );
}