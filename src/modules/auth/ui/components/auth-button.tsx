"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { ClapperboardIcon, UserCircleIcon } from "lucide-react";

import { Button } from "zentube/ui/button";

export function AuthButton() {
  return (
    <>

      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            {/* TODO: Add menu items for User Profile */}
            <UserButton.Link
              label="Studio"
              href="/studio"
              labelIcon={<ClapperboardIcon className="size-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>

      <SignedOut>

        <Button
          variant="outline"
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500
        border-blue-500/20 rounded-lg shadow-none [&_svg]:size-3"
        >
          <UserCircleIcon />

          <SignInButton />
        </Button>
      </SignedOut>
    </>
  );
}
