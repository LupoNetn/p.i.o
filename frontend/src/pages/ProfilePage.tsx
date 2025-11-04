import useAuthStore from "../stores/useAuthStore";
import UserDashboard from "../components/dashboardComponent/UserDashboard";
import AdminDashboard from "../components/dashboardComponent/AdminDashboard";

const ProfilePage = () => {
  const user = useAuthStore((state: any) => state.user);
 

  
  return (
    <div className="min-h-screen bg-dark text-white p-6 font-audio app-container">
      {user.isAdmin ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
};

export default ProfilePage;
