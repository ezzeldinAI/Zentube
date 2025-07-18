type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      {children}
    </div>
  );
}
