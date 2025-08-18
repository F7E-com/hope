export default function NavBar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between">
      <span className="font-bold text-xl">Midnight UI</span>
      <div className="space-x-4">
        <a href="/" className="hover:text-blue-400">Home</a>
        <a href="/profile" className="hover:text-blue-400">Profile</a>
      </div>
    </nav>
  );
}
