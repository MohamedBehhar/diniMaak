import MyDialog from "./MyDialog";

interface Props {
  children: React.ReactNode;
  steps: {
    title: string;
    icon: React.ReactNode;
  }[];
  increament: () => void;
  decreament: () => void;
  stepNumber: number;
}

const Steper = ({
  children,
  steps,
  increament,
  decreament,
  stepNumber,
}: Props) => {
  return (
    <div className="w-[90%] mx-auto">
      <header className="flex justify-center items-center gap-1  p-2   mb-4 ">
        <div></div>
        {steps &&
          steps.map((step, index) => {
            return (
              <div
                key={index}
                className={`${
                  index == steps.length - 1 ? "" : "flex-1"
                } flex items-center text-sm   gap-1 `}
              >
                <div className="flex flex-col relative">
                  <div
                    className={`${
                      index == stepNumber
                        ? "bg-gradient-to-r bg-cyan-600   transition ease-in duration-500 text-white"
                        : index < stepNumber
                        ? "bg-gradient-to-r bg-cyan-600   transition ease-in duration-500 text-white"
                        : "bg-gray-300 text-gray-500 transition ease-in duration-500"
                    }  sm:w-10 w-7 sm:h-10 h-7 rounded-full flex justify-center items-center text-lg sm:text-xl`}
                  >
                    {step.icon}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`${
                      index == stepNumber
                        ? " bg-gradient-to-r from-cyan-600 transition ease-in duration-500"
                        : index < stepNumber
                        ? " bg-cyan-600  transition ease-in duration-500"
                        : "bg-gray-300 transition ease-in duration-500"
                    } flex-1 h-1 rounded-full  justify-center items-center `}
                  ></div>
                )}
              </div>
            );
          })}
      </header>
      <main
        // transition ease-in duration-500 opacity-0

        className="p-4 bg-white shadow-md rounded-md container"
      >
        {steps[stepNumber] && (
          <h1
            className="text-2xl font-bold text-center mb-4"
            style={{ color: "#333" }}
          >
            {steps[stepNumber].title}
          </h1>
        )}
        {children}
      </main>
      <footer className="flex justify-between">
        {stepNumber > 0 && stepNumber < steps.length && (
          <button
            className="btn btn-primary"
            onClick={() => {
              decreament();
            }}
          >
            Back
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={() => {
            increament();
          }}
        >
          Next
        </button>
      </footer>
    </div>
  );
};

export default Steper;
