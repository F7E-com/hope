import NavBar from "../components/NavBar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto p-4">{children}</main>
    </div>
  );
}
