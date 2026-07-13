import React from "react";

type StepperProps = {
  value: number;
  onDec: () => void;
  onInc: () => void;
  /* 22px buttons for ability rows instead of the default 40px. */
  small?: boolean;
  /* Extra class for the value readout (pool/counter values differ in size). */
  valueClassName?: string;
};

const Stepper: React.FC<StepperProps> = ({
  value,
  onDec,
  onInc,
  small,
  valueClassName,
}) => (
  <div className={small ? "cs-mini-stepper" : "cs-stepper"}>
    <button
      type="button"
      className={small ? "cs-mini-stepper-btn" : "cs-stepper-btn"}
      onClick={onDec}
      aria-label="Decrease"
    >
      −
    </button>
    <div
      className={
        (small ? "cs-mini-stepper-val" : "cs-stepper-val") +
        (valueClassName ? ` ${valueClassName}` : "")
      }
    >
      {value}
    </div>
    <button
      type="button"
      className={small ? "cs-mini-stepper-btn" : "cs-stepper-btn"}
      onClick={onInc}
      aria-label="Increase"
    >
      +
    </button>
  </div>
);

export default Stepper;
