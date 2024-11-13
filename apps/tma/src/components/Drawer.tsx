import { PropsWithChildren } from "react";

const Drawer = ({
  children,
  isOpen,
  onClose,
}: PropsWithChildren<{ isOpen: boolean; onClose: () => void }>) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="relative bg-white w-64 h-full shadow-xl">
        <div className="w-full h-full bg-darkM flex flex-col">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
