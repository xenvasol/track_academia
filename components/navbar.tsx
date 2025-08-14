"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { MdOutlineTrackChanges } from "react-icons/md";

export default function Navbar() {
  const { user, userData, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="flex items-center text-xl font-bold text-indigo-700 transition-colors"
            >
              <span>
                <MdOutlineTrackChanges />
              </span>{" "}
              Track Academia
            </Link>

            {user && userData?.degree && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className={`flex items-center text-sm font-medium transition-colors hover:text-black ${
                    isActive("/dashboard")
                      ? "text-indigo-700 border-b-2 border-indigo-800 pb-0.5"
                      : "text-gray-600"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/books"
                  className={`flex items-center text-sm font-medium transition-colors hover:text-[#5044e5] ${
                    isActive("/books")
                      ? "text-indigo-700 border-b-2 border-indigo-800 pb-0.5"
                      : "text-gray-600"
                  }`}
                >
                  My Books
                </Link>
              </div>
            )}
          </div>

          {/* Right section - User/Auth controls */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 text-indigo-700 hover:bg-gray-100 h-10"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-700 text-white rounded-full text-sm font-medium">
                      {userData?.displayName?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"}
                    </div>
                    <span className="hidden sm:block flex items-center">
                      {userData?.displayName || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex flex-col px-2 py-1.5">
                    <p className="text-sm font-medium text-black">
                      {userData?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-600">{user.email}</p>
                    {userData?.degree && (
                      <p className="text-xs text-gray-500 mt-1">
                        {userData.degree}
                      </p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link href="/dashboard" className="w-full cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link href="/books" className="w-full cursor-pointer">
                      My Books
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="flex items-center">
                    <Link href="/books/add" className="w-full cursor-pointer">
                      Add Book
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center cursor-pointer hover:bg-red-50 hover:text-red-600"
                  >
                    {isSigningOut ? "Signing out..." : "Sign Out"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login" className="flex items-center">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-black hover:bg-gray-50 h-10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" className="flex items-center">
                  <Button className="bg-black text-white hover:bg-gray-800 h-10">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
