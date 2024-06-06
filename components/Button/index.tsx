import React from "react";
import LoadingBtn from "../Loading/LoadingBtn";

export interface ButtonProps {
  /**
   * Button contents
   */
  label?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Set the loading status of button
   */
  loading?: boolean;
  /**
   * html submit form
   */
  submit?: boolean;
}

const Button = ({
  label,
  loading = false,
  className,
  submit,
  onClick,
}: ButtonProps): JSX.Element => {
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={onClick}
      className={`flex items-center space-x-2 ${
        loading && "pointer-events-none"
      } ${className}`}
    >
      <p>{label}</p>
      {loading && <LoadingBtn />}
    </button>
  );
};

export default Button;
