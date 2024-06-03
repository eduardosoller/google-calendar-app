import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Header() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading</p>;

  return (
    <header className="flex items-center justify-between">
      <h1 className="py-4 text-center font-bold">Google Calendar App</h1>
      {session && session.user && (
        <Popover>
          <PopoverTrigger>
            <div className="flex items-center justify-between">
              <p className="px-2">{session.user.name}</p>
              <Image
                className="rounded-full"
                src={session.user.image ?? ""}
                alt=""
                width="30"
                height="30"
              />
            </div>
          </PopoverTrigger>
          <PopoverContent align="end">
            <a
              href="https://calendar.google.com/calendar/u/0/r/day"
              target="_blank"
            >
              <Button className="w-full mt-1 text-md">Abrir agenda</Button>
            </a>

            <Button className="w-full mt-1 text-md" onClick={() => signOut()}>
              Fazer logout{" "}
              <Image
                style={{ marginLeft: ".8em" }}
                src="/google.svg"
                width={"24"}
                height={"24"}
                alt="Google"
              />
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </header>
  );
}
