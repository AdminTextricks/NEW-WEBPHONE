const MyProfile = ({ basicDetails }: any) => {
  const fullName = basicDetails ? `${basicDetails.agent_name}` : "-";

  return (
    <>
      <div
        className="user-profile-img"
        style={{
          backgroundColor: "greenyellow",
        }}
      >
        <img
          src={
            "https://images.pexels.com/photos/6044235/pexels-photo-6044235.jpeg?auto=compress&cs=tinysrgb&w=600"
          }
          className="profile-img"
          style={{ height: "160px" }}
          alt=""
        />

        <div className="overlay-content">
          <div>
            <div className="user-chat-nav p-2 ps-3">
              <div className="d-flex w-100 align-items-center">
                <div className="flex-grow-1">
                  <h5 className="text-white mb-0">My Profile</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-3 p-lg-4 border-bottom pt-2 pt-lg-2 mt-n5 position-relative">
        <div className="mb-lg-3 mb-2">
          {basicDetails && (
            <img
              src={
                "https://images.pexels.com/photos/6044235/pexels-photo-6044235.jpeg?auto=compress&cs=tinysrgb&w=600"
              }
              className="rounded-circle avatar-lg img-thumbnail"
              alt=""
            />
          )}
        </div>
        <h5 className="font-size-16 mb-1 text-truncate">{fullName}</h5>
      </div>
    </>
  );
};
export default MyProfile;
