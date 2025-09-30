"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <NavigationMenu className="w-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">Mystery Message</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu className="w-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              {session ? (
                <Button
                  className="cursor-pointer"
                  onClick={() => signOut()}
                  variant={"outline"}
                >
                  Logout
                </Button>
              ) : (
                <Button className="cursor-pointer" variant={"outline"}>
                  <Link href="/sign-in">Login</Link>
                </Button>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
