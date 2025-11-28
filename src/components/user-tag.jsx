import capitalizeFirstLetters from "../utilities/capitalize-first-letters";
import { GroupBadge } from "./group-badge";
import LevelBadge from "./level-badge";

export default function UserTag({ username, level, group }) {
    return (
        <>
            <GroupBadge group={group} />

            <span className="font-bold text-sm truncate max-w-[10ch] mx-0.5">
                {capitalizeFirstLetters(username)}
            </span>

            <LevelBadge level={level} />
        </>
    )
}