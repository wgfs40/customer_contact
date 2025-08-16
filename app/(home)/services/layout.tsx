interface ServicesLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const ServicesLayout = ({ children }: ServicesLayoutProps) => {
  return (
    <>
      {children}
      {/* {modal} */}
    </>
  );
};

export default ServicesLayout;
