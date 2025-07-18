import React from "react";
import { Link } from "react-router-dom";

import { Collapse, Card, CardBody, Input, Label } from "reactstrap";

// swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";
import "swiper/css/effect-flip";

interface MoreMenuProps {
  isOpen: boolean;
  onSelectImages: (images: Array<any>) => void;
  onToggle: () => any;
  onSelectFiles: (files: Array<any>) => void;
}
const MoreMenu = ({
  isOpen,
  onSelectImages,
  onToggle,
  onSelectFiles,
}: MoreMenuProps) => {
  const onSelect = (e: any) => {
    const files = [...e.target.files];
    if (files) {
      onSelectImages(files);
      onToggle();
    }
  };

  const onSelectF = (e: any) => {
    const files = [...e.target.files];
    if (files) {
      onSelectFiles(files);
      onToggle();
    }
  };

  return (
    <Collapse
      isOpen={isOpen}
      className="chat-input-collapse"
      id="chatinputmorecollapse"
    >
      <Card className="mb-0">
        <CardBody className="py-3">
         
        </CardBody>
      </Card>
    </Collapse>
  );
};

export default MoreMenu;
