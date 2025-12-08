import React, { useState } from "react";
import {
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Dialog, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const ConfirmationModal = ({
  onClick,
  buttonText,
  isLoading,
}: {
  onClick: () => void;
  buttonText: string;
  isLoading: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button>{buttonText}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{buttonText}</DialogTitle>
            <DialogDescription>
              Are you sure you?
              <DialogFooter>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onClick} disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : buttonText}
                </Button>
              </DialogFooter>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConfirmationModal;
