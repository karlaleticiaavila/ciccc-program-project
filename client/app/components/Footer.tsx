"use client";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-10 py-12">
        <p className="text-center text-sm">
          &copy; {new Date().getFullYear()} WHO ARE YOU BECOMING? All rights reserved.
        </p>
      </div>
    </footer>
  );
}
    