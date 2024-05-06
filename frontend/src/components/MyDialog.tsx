import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

interface Props {
  open: boolean;
  handleClose: () => void;
  title?: string;
  children: React.ReactNode;
  width: {
    type: string;
    default: 'sm'
  }
}

const MyDialog = ({ open, handleClose, title, children, width }: Props) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth='sm'
      
      >
        <div className="text-xl flex flex-col gap-5 p-2 h-full">
          <h1>{title}</h1>
          <div>{children}</div>
        </div>
      </Dialog>
    </React.Fragment>
  );
};

export default MyDialog;
