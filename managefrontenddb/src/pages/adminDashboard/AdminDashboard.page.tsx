import AddUserForm from "@/components/addUserForm/AddUserForm.component";
import { AdminDashboardContainer, AdminDashboardSecondContainer } from "./AdminDashboard.styles";
import RetrieveUsers from "@/components/retrieveUsers/RetrieveUsers.component";
import { useContext } from "react";
import { RegenerateContext } from "@/context/regenerate.context";
import FloatPanel from "@/components/floatContainer/FloatContainer.component";
import { useSelectored } from "@/store/hooks";
const AdminDashboard = () => {

  const { refreshAdminTable, refreshEmployeeTable, setRefreshAdminTable, setRefreshEmployeeTable } = useContext(RegenerateContext)
  const { showfloat } = useSelectored(state => state.adminDashboard)
  return (
    <AdminDashboardContainer>
      <AdminDashboardSecondContainer>
        <AddUserForm
          url="http://localhost:8626/admin/addEmployeeUser"
          content="employee"
          refresh={refreshEmployeeTable}
          setRefresh={setRefreshEmployeeTable}
        />
        <RetrieveUsers
          url="http://localhost:8626/admin/getEmployeeUser"
          content="Employee"
          refresh={refreshEmployeeTable}
        />
      </AdminDashboardSecondContainer>
      <AdminDashboardSecondContainer>
        <AddUserForm
          url="http://localhost:8626/admin/addAdminAccount"
          content="admin"
          refresh={refreshAdminTable}
          setRefresh={setRefreshAdminTable}
        />
        <RetrieveUsers
          url="http://localhost:8626/admin/getAdminUser"
          content="Admin"
          refresh={refreshAdminTable}
        />
      </AdminDashboardSecondContainer>
      {
        showfloat
        &&
        <FloatPanel />
      }
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;