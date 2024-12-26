import { Button, Fade } from "reactstrap";
import { MdDialpad } from "react-icons/md";

const FabButtonWithFade = ({ onChangeClick }: any) => {
  const handleClickDial = () => {
    onChangeClick();
  };
  return (
    <Fade>
      <Button
        className="btn btn-soft-primary btn-sm"
        style={{
          backgroundColor: "#35473b",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "56px",
          height: "56px",
          opacity: 1,
        }}
        aria-label={"Dial pad"}
        onClick={handleClickDial}
      >
        <MdDialpad size={22} />
      </Button>
    </Fade>
  );
};

export default FabButtonWithFade;
