"use client";

import { useState } from "react";

import { twMerge } from "tailwind-merge";

import ButtonActionWhite from "@/app/_ui/buttons/ButtonActionWhite";

import UpdateWeightForm from "./UpdateWeightForm";

function UpdateWeightToggleForm({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props;

  const [showForm, setShowForm] = useState(false);

  function toggleForm() {
    setShowForm((prev) => !prev);
  }

  return (
    <>
      <ButtonActionWhite
        className={twMerge("text-secondary-app", className)}
        onClick={toggleForm}
        {...rest}
      >
        Actualizar peso
      </ButtonActionWhite>

      <UpdateWeightForm show={showForm} onClose={toggleForm} />
    </>
  );
}

export default UpdateWeightToggleForm;
