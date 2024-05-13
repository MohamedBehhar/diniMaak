import { useState } from "react";
import { Button, Modal } from "antd";
import { PiSeatbeltFill } from "react-icons/pi";

interface MyModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  showModal: () => void;
  className?: string;
  data: any;
}

const MyModal = ({
  open,
  onOk,
  onCancel,
  children,
  showModal,
  className,
  data,
}: MyModalProps) => {
  return (
    <>
      <div className={className} onClick={showModal}>
        {children}
      </div>
      <Modal
        centered
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        okText="Accept"
        cancelText="Decline"
        footer={null}
      >
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 bg-gray-300 rounded-full">
            <img src={data.profile_picture} alt="" />
          </div>
          <div className="">
            <p className="text-l mb-0">Name: {data.username}</p>
            <p>Rating: {data.rating}</p>
            <p>Phone: {data.phone_number}</p>
            <div className="flex items-center ">
              <p>{data.requested_seats}</p>
              <PiSeatbeltFill className="text-cyan-500 " />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-5">
          <Button
            type="primary"
            onClick={onOk}
            className="bg-cyan-500 text-white px-3 py-1 rounded-md"
          >
            Accept
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default MyModal;
