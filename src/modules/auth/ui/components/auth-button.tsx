import { UserCircleIcon } from "lucide-react";

import { Button } from "zentube/ui/button";

export function AuthButton() {
  return (
    <Button
      variant="outline"
      className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500
        border-blue-500/20 rounded-lg shadow-none [&_svg]:size-3"
    >
      <UserCircleIcon />

      Sign In
    </Button>
  );
}
