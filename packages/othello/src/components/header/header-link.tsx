import Link from "next/link";

interface HeaderLinkProps {
  href: string,
  icon: string,
  name: string
}

export default function HeaderLink({ href, icon, name }: HeaderLinkProps) {
  return (
    <Link href={href}>
      <a className="header-link">
        <span className="material-icons">{icon}</span>
        <span className="name">{name}</span>
      </a>
    </Link>
  );
}
