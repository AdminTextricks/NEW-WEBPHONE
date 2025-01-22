import React, { useEffect, useState } from "react";
import { useRedux } from "../../../hooks/index";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import EmptyStateResult from "../../../components/EmptyStateResult";
import ListHeader from "./ListHeader";
import Contact from "./Contact";

const Index = React.memo(() => {
  const { useAppSelector } = useRedux();

  const { contacts, getContactsLoading, isContactsFetched } = useAppSelector(
    (state: any) => ({
      getContactsLoading: state.Contacts.getContactsLoading,
      contacts: state.Contacts.contacts,
      isContactsFetched: state.Contacts.isContactsFetched,
    }),
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<Array<any>>([]);

  const totalContacts = filteredData?.length || 0;

  const onChangeSearch = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    if (isContactsFetched) {
      setFilteredData(
        contacts?.length > 0
          ? contacts.filter(
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
    }
  }, [isContactsFetched, searchQuery]);

  return (
    <>
      {getContactsLoading && <Loader />}
      <div className="position-relative">
        <ListHeader search={searchQuery} onChangeSearch={onChangeSearch} />
        <AppSimpleBar className="chat-message-list chat-group-list">
          <div>
            {totalContacts === 0 ? (
              <EmptyStateResult searchedText={searchQuery} />
            ) : (
              <Contact
                letterContacts={filteredData}
              />
            )}
          </div>
        </AppSimpleBar>
      </div>
    </>
  );
});

export default Index;
