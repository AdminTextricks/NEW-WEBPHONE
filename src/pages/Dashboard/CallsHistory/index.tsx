import { useEffect, useState } from "react";
import { useRedux } from "../../../hooks/index";
import History from "./History";
import UserHead from "./UserHead";

const Index = () => {
  const { useAppSelector } = useRedux();

  const [userCalls, setAllUserCalls] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const { user, allCalls, contacts } = useAppSelector((state: any) => ({
    user: state.Chats.selectedChat,
    allCalls: state.CallHistory.call_list,
    contacts: state.Contacts.contacts,
  }));

  useEffect(() => {
    if (contacts.length > 0) {
      const filterByNumber = allCalls.filter(
        (item: any) => item.number === user,
      );

      const findByNumber = contacts.find(
        (item: any) => item.callbackextension === user,
      );

      setUserDetails(findByNumber);
      setAllUserCalls(filterByNumber);
    }
  }, [user, allCalls]);

  return (
    <>
      <UserHead callUserDetails={userDetails} />
      <History callUserHistory={userCalls} callUserDetails={userDetails} />
    </>
  );
};

export default Index;
