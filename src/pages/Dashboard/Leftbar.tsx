import React from "react";

import { TabContent, TabPane } from "reactstrap";
import { useRedux } from "../../hooks/index";
import { createSelector } from "reselect";
import { TABS } from "../../constants/index";
import Profile from "./Profile/index";
import Contacts from "./Contacts/index";
import Calls from "./Calls/index";

const Leftbar = () => {

  const { useAppSelector } = useRedux();

  const errorData = createSelector(
    (state: any) => state.Layout,
    state => ({
      activeTab: state.activeTab,
    }),
  );

  const { activeTab } = useAppSelector(errorData);

  return (
    <>
      <div className="chat-leftsidebar">
        <TabContent activeTab={activeTab}>
          <TabPane tabId={TABS.USERS} role="tabpanel">
            <Profile />
          </TabPane>
          <TabPane tabId={TABS.CONTACTS} role="tabpanel">
            <Contacts />
          </TabPane>
          <TabPane tabId={TABS.CALLS} role="tabpanel">
            <Calls />
          </TabPane>
        </TabContent>
      </div>
    </>
  );
};

export default Leftbar;
