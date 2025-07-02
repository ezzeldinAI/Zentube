import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "zentube/ui/avatar";

const avatarVariants = cva("", {
  variants: {
    size: {
      default: "size-9",
      xs: "size-4",
      sm: "size-6",
      lg: "size-10",
      xl: "size-[160px]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type UserAvatarProps = VariantProps<typeof avatarVariants> & {
  imageUrl: string;
  name: string;
  className?: string;
  onClick?: () => void;
};

export function UserAvatar({ imageUrl, name, size, className, onClick }: UserAvatarProps) {
  return (
    <Avatar className={cn(avatarVariants({ size, className }))} onClick={onClick}>
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
    </Avatar>
  );
}
