import React from "react";
import { Form, Input } from "reactstrap";

interface ListHeaderProps {
  onChangeSearch: (value: string) => void;
  search: string;
}
const ListHeader = ({ search, onChangeSearch }: ListHeaderProps) => {
  return (
    <div className="px-4 pt-4">
      <div className="d-flex align-items-start">
        <div className="flex-grow-1">
          <h4 className="mb-4">Contacts</h4>
        </div>
      </div>

      <Form>
        <div className="input-group mb-4">
          <Input
            type="text"
            className="form-control bg-light border-0 pe-0"
            placeholder="Search Contacts.."
            value={search || ""}
            onChange={(e: any) => onChangeSearch(e.target.value)}
          />
          <button
            className="btn btn-light"
            type="button"
            id="button-searchcontactsaddon"
          >
            <i className="bx bx-search align-middle"></i>
          </button>
        </div>
      </Form>
    </div>
  );
};

export default ListHeader;
