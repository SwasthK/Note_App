import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./dark-mode";

const Header = () => {
  return (
    <div>
      <h1>Header</h1>

      <Link href={"/register"}>
        <Button>Register</Button>
      </Link>
      <Link href={"/login"}>
        <Button>Login</Button>
      </Link>
      <Link href={"/logout"}>
        <Button>Logout</Button>
      </Link>
      <ModeToggle></ModeToggle>
    </div>
  );
};

export default Header;
