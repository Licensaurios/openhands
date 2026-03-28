import { UserButton } from "@clerk/nextjs";

export default function User() {
  return (
    <>
      <h1>Pagina del usuario</h1>
      <p>Usuario Juan carlos bodoque</p>
      <UserButton />
    </>
  );
}
