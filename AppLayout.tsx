import "./App.css";
import CustomSidebar from "./components/Sidebar/CustomSidebar";
import ProtectedLayout from "./ProtectedLayout";

const AppLayout = ({ children }: any) => {

  return (
    <ProtectedLayout>
        <div className="flex sm:h-[100vh] w-[100vw] bg-gray-100">
          {/* Sidebar */}
          <CustomSidebar children={children} />
          {/* Main Content */}
        </div>
      </ProtectedLayout>
  );
};

export default AppLayout;
