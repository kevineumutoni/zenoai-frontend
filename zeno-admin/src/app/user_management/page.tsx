import UserStatsContainer from "./components/UserCard";
import UsersTable from "./components/UsersTable";




export default function UserManagementPage() {
  return (
    <div className="">
      <h1 className="pt-13 pl-10 ml-20 text-3xl md:text-4xl sm:text-[50px xl:text-[50px] 2xl:font-semibold text-[#9FF8F8] mb-2">User Management</h1>
      <p className="sm:text-[24px] pl-10 ml-20 lg:text-[20px] xl:text-[34px]">Aggregated List list of Admins and Users</p>
      <div className="flex ">
        <UserStatsContainer />
      </div>

      <UsersTable />
    </div>
  );
}