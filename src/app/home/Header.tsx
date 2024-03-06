import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  async function signInGoogle() {
    await signIn("google");
  }
  return (
    <header className="flex items-center justify-between">
      <h1 className="py-4 text-center font-bold">Google Calendar App</h1>
      {session && session.user ? (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center justify-between">
              <p className="px-2">{session.user.name}</p>
              <Image
                src={session.user.image ?? ""}
                alt=""
                width="30"
                height="30"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="end">
            <Button className="w-full mt-1 text-md" onClick={() => signOut()}>
              Fazer logout
            </Button>
          </PopoverContent>
        </Popover>
      ) : (
        <Button className="w-auto text-md" onClick={signInGoogle}>
          Fazer login
        </Button>
      )}
    </header>
  );
}
