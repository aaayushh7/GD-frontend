import React from 'react';

const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="flex justify-center items-center my-8 w-full sm:w-auto">
      <div className="flex items-center bg-white p-4 rounded-lg shadow-lg">
        <StepItem step={1} completed={step1} label="Login" />
        <Connector completed={step1} />
        <StepItem step={2} completed={step2} label="Shipping" />
        <Connector completed={step1 && step2} />
        <StepItem step={3} completed={step3} label="Summary" />
      </div>
    </div>
  );
};

const StepItem = ({ step, completed, label }) => (
  <div className="flex flex-col items-center">
    <div
      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-lg font-semibold border-2 ${
        completed
          ? 'bg-amber-500 border-amber-600 text-white'
          : 'bg-white border-amber-300 text-amber-500'
      }`}
    >
      {completed ? '✓' : step}
    </div>
    <span
      className={`mt-2 text-xs sm:text-sm font-medium ${
        completed ? 'text-amber-700' : 'text-amber-500'
      }`}
    >
      {label}
    </span>
  </div>
);

const Connector = ({ completed }) => (
  <div
    className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 bg-amber-300 ${
      completed ? 'bg-amber-500' : 'bg-amber-200'
    }`}
  ></div>
);

export default ProgressSteps;