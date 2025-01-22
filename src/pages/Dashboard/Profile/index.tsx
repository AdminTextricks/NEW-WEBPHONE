import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import MyProfile from "./MyProfile";
import UserDescription from "./UserDescription";
import { useSelector } from "react-redux";

const Index = () => {
  const userData = useSelector((state: any) => state.Login);

  return (
    <div className="position-relative">
      {userData.loading && <Loader />}
      <MyProfile basicDetails={userData?.user} />
      <AppSimpleBar className="p-4 profile-desc">
        <UserDescription basicDetails={userData?.user} />
      </AppSimpleBar>
    </div>
  );
};

export default Index;
