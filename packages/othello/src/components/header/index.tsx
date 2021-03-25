import ProfilePicture from "./profile-picture";
import SearchBar from "./search-bar";
import TagList from "./tag-list";
import HeaderLink from "./header-link";
import { LightsButton } from "./lights-button";

export default function Header() {
  return (
    <header className="header">
      <ProfilePicture/>

      <div className="header-links">
        <HeaderLink href="/archive" icon="home" name="Home"/>
        <HeaderLink href="/submit" icon="add_to_photos" name="Submit"/>
        <HeaderLink href="/saved" icon="bookmark" name="Saved"/>
      </div>

      <div className="section">
        <h1>Search</h1>
        <SearchBar/>
      </div>

      <div className="section">
        <h1>Tags</h1>
        <TagList/>
      </div>

      <LightsButton/>
    </header>
  );
}
