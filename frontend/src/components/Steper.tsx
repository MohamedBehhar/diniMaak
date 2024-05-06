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
    <div>
        <header className="flex justify-between gap-1  p-2 w-[96%] mx-auto mb-4 ">
          <div></div>
          {steps &&
            steps.map((step, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    index + 1 == steps.length ? "" : "flex-1"
                  } flex items-center text-sm   gap-1 `}
                >
                  <div className="flex flex-col relative">
                    <div
                      className={`${
                        index + 1 == stepNumber
                          ? "bg-gradient-to-r bg-indigo-500   transition ease-in duration-500 text-white"
                          : index + 1 < stepNumber
                          ? "bg-gradient-to-r bg-indigo-500   transition ease-in duration-500 text-white"
                          : "bg-gray-300 text-gray-500 transition ease-in duration-500"
                      }  sm:w-10 w-7 sm:h-10 h-7 rounded-full flex justify-center items-center text-lg sm:text-xl`}
                    >
                      {step.icon}
                    </div>
                    <h1 className="text-center text-sm absolute top-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 text-gray-700 hidden md:block">
                      {step.title}
                    </h1>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`${
                        index + 1 == stepNumber
                          ? " bg-gradient-to-r from-indigo-500 transition ease-in duration-500"
                          : index + 1 < stepNumber
                          ? " bg-indigo-500  transition ease-in duration-500"
                          : "bg-gray-300 transition ease-in duration-500"
                      } flex-1 h-1 rounded-full  justify-center items-center `}
                    ></div>
                  )}
                </div>
              );
            })}
        </header>
        <main>{children}</main>
        <footer className="flex justify-between">
          <button
            className="btn btn-primary"
            onClick={() => {
              decreament();
            }}
          >
            Back
          </button>
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
