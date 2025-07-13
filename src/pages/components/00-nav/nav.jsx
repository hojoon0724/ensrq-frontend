export default function Navbar({}) {
  const navigation = [
    { name: "about", href: "#" },
    { name: "donate", href: "#" },
    { name: "streaming", href: "#" },
    { name: "tickets", href: "#" },
  ];

  return (
    <div className="nav-container flex items-center justify-center min-w-full bg-slate-300">
      <nav className=" justify-between bg-slate-300 px-4 py-2 flex w-full max-w-[1200px] items-center">
        <div className="logo min-h-[60px] aspect-[2/1] bg-red-600"></div>
        <ul className="flex w-full justify-end">
          {navigation.map((item) => (
            <li key={item.name} className="ml-[3ch]">
              <a href={item.href}>{item.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
