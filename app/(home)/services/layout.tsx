interface ServicesLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const ServicesLayout = ({ children, modal }: ServicesLayoutProps) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default ServicesLayout;
