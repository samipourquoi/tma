import Image from "next/image";

export default function ProfilePicture() {
  return (
    <div className="profile-picture">
      <div className="avatar">
        <Image src="/images/default-user.png" width={50} height={50}/>
      </div>

      <div className="names">
        <h1 className="tma">TMA</h1>
        <h2 className="name">samipourquoi</h2>
      </div>
    </div>
  );
}
