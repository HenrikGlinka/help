import capitalizeFirstLetters from "../utilities/capitalize-first-letters";
import { GroupBadge } from "./group-badge";
import LevelBadge from "./level-badge";

export default function UserTag({ username, level = null, group = null, maxLength = 0, shorten = false }) {

    if (shorten) {
        const parts = username.split(' ');
        username = parts[0] + parts.slice(1).map(name => ` ${name[0].toUpperCase()}.`).join('');
    }

    return (
        <div className="flex items-center whitespace-nowrap min-w-0 mx-0.5">
            {group !== null && <GroupBadge group={group} />}

            <span 
                className="font-bold truncate mx-0.5 min-w-0"
                style={{ maxWidth: maxLength > 0 ? `${maxLength}ch` : undefined }}
            >
                {capitalizeFirstLetters(username)}
            </span>

           {level !== null && <LevelBadge level={level} />}
        </div>
    )
}