import React, { useEffect, useState, useCallback } from "react";
import { useRedux } from "../../../hooks/index";
import { createSelector } from "reselect";
import { debounce } from "lodash"; // Import for debouncing
// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import EmptyStateResult from "../../../components/EmptyStateResult";
import ListHeader from "./ListHeader";
import Contact from "./Contact";

// actions
import {
  inviteContact,
  resetContacts,
  getChannelDetails,
  getChatUserDetails,
  getChatUserConversations,
  changeSelectedChat,
} from "../../../redux/actions";

// utils
import { useSelector } from "react-redux";
import { getContacts } from "../../../api";

const contactCache = new Map(); // Cache for contacts to reduce API calls

const Index = React.memo(() => {
  const { dispatch } = useRedux();
  const userData = useSelector((state: any) => state.Login.user);

  const [contacts, setContacts] = useState<Array<any>>([]);
  const [contactsData, setContactsData] = useState<Array<any>>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Array<any>>([]);

  const [isLoader, setIsLoader] = useState(false);

  const totalContacts = filteredData.length;

  // Fetch contacts with caching
  const fetchContacts = useCallback(async () => {
    const req_params = { name: userData.name };
    if (contactCache.has(req_params.name)) {
      setContacts(contactCache.get(req_params.name));
    } else {
      try {
        setIsLoader(true);
        const res = await getContacts(req_params);
        contactCache.set(req_params.name, res.data); // Cache the response
        setContacts(res.data);
        setIsLoader(false);
      } catch (err) {
        setIsLoader(false);
      }
    }
  }, [userData]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Format contacts (if needed)
  useEffect(() => {
    setContactsData(contacts); // Direct assignment; format here if required
  }, [contacts]);

  const onChangeSearch = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    setFilteredData(
      contactsData.length > 0
        ? contactsData.filter(
            (item: any) =>
              item.agent_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.callbackextension
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          )
        : [],
    );
  }, [contactsData, searchQuery]);

  // Select chat handling
  const onSelectChat = (id: string | number) => {
    dispatch(getChatUserDetails(id));
    dispatch(getChatUserConversations(id));
    dispatch(changeSelectedChat(id));
  };

  return (
    <>
      {isLoader && <Loader />}
      <div className="position-relative">
        <ListHeader search={searchQuery} onChangeSearch={onChangeSearch} />

        <AppSimpleBar className="chat-message-list chat-group-list">
          <div>
            {totalContacts === 0 ? (
              <EmptyStateResult searchedText={searchQuery} />
            ) : (
              <Contact
                letterContacts={filteredData}
                onSelectChat={onSelectChat}
              />
            )}
          </div>
        </AppSimpleBar>
      </div>
    </>
  );
});

export default Index;
