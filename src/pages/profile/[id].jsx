import { useParams } from "react-router";
import ProfilePage from "./index.jsx";

export default function ProfileIdPage() {

   return <ProfilePage id={useParams()?.id} />

}
