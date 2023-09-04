import React, { useState } from "react";
interface ILoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (props: any) => void;
}

const LoginModal = (props: ILoginModalProps) => {
    const { isOpen, onClose, onSubmit } = props;
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  return (
    <div className={`modal ${isOpen ? "open" : "closed"}`}>
      <div className="modal-content">
        <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Type your name"  className="TextField"/>
        <button onClick={handleSubmit} className="SubmitButton">Submit</button>
      </div>
    </div>
  );
};

export default LoginModal;
