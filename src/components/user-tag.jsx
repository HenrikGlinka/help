import capitalizeFirstLetters from "../utilities/capitalize-first-letters";
import { GroupBadge } from "./group-badge";
import LevelBadge from "./level-badge";

export default function UserTag({ username, level = null, group = null, maxLength = 0 }) {
    return (
        <div className="flex items-center whitespace-nowrap min-w-0">
            {group !== null && <GroupBadge group={group} />}

            <span 
                className="font-bold text-sm truncate mx-0.5 min-w-0"
                style={{ maxWidth: maxLength > 0 ? `${maxLength}ch` : undefined }}
            >
                {capitalizeFirstLetters(username)}
            </span>

           {level !== null && <LevelBadge level={level} />}
        </div>
    )
}