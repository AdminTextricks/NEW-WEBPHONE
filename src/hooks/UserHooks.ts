import { useState, useEffect } from "react";

// hooks
import { useRedux } from "../hooks/index";

// api
import { createSelector } from "reselect";
//utils
import { divideByKey } from "../utils";

const useProfile = () => {
  // global store

  const [loading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    setUserProfile(null);
  }, []);

  return { userProfile, loading };
};

const useContacts = () => {
  // global store
  const { useAppSelector } = useRedux();

  // const { contactsList } = useAppSelector(state => ({
  //   contactsList: state.Contacts.contacts,
  // }));

  const errorData = createSelector(
    (state: any) => state.Contacts,
    state => ({
      contactsList: state.contacts,
    }),
  );
  // Inside your component
  const { contactsList } = useAppSelector(errorData);

  const [contacts, setContacts] = useState<Array<any>>([]);
  const [categorizedContacts, setCategorizedContacts] = useState<Array<any>>(
    [],
  );
  useEffect(() => {
    if (contactsList.length > 0) {
      setContacts(contactsList);
    }
  }, [contactsList]);

  useEffect(() => {
    if (contacts.length > 0) {
      const formattedContacts = divideByKey("firstName", contacts);
      setCategorizedContacts(formattedContacts);
    }
  }, [contacts]);

  const totalContacts = (categorizedContacts || []).length;
  return { categorizedContacts, totalContacts };
};

export { useProfile, useContacts };
