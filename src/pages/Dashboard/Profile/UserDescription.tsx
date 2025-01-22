const UserDescription = ({ basicDetails }: any) => {
  return (
    <>
      <div>
        <div className="d-flex py-2">
          <div className="flex-shrink-0 me-3">
            <i className="bx bx-user align-middle text-muted"></i>
          </div>
          <div className="flex-grow-1">
            <p className="mb-0">
              {basicDetails && basicDetails.company
                ? basicDetails.company.company_name
                : "-"}
            </p>
          </div>
        </div>

        <div className="d-flex py-2">
          <div className="flex-shrink-0 me-3">
            <i className="bx bx-message-rounded-dots align-middle text-muted"></i>
          </div>
          <div className="flex-grow-1">
            <p className="mb-0">
              {basicDetails && basicDetails.company
                ? basicDetails.company.email
                : "-"}
            </p>
          </div>
        </div>

        <div className="d-flex py-2">
          <div className="flex-shrink-0 me-3">
            <i className="bx bx-location-plus align-middle text-muted"></i>
          </div>
          <div className="flex-grow-1">
            <p className="mb-0">
              {basicDetails && basicDetails.name ? basicDetails.name : "-"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDescription;
