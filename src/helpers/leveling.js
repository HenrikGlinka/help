const EXP_TO_FIRST_LEVEL = 10;
const GROWTH_RATE = 1.2;

export function getLevel(exp) {
    if (isNaN(exp) || exp < EXP_TO_FIRST_LEVEL) return 1;

    return Math.floor(
        Math.log(1 + (exp * (GROWTH_RATE - 1)) / EXP_TO_FIRST_LEVEL) / Math.log(GROWTH_RATE)
    ) + 1;
}

export function getExpToPreviousLevel(exp) {
    const level = getLevel(exp);
    if (level === 1) return 0;
    return Math.floor(
        EXP_TO_FIRST_LEVEL * (Math.pow(GROWTH_RATE, level - 1) - 1) / (GROWTH_RATE - 1)
    );
}

export function getExpToNextLevel(exp) {
    if (exp < EXP_TO_FIRST_LEVEL) return EXP_TO_FIRST_LEVEL - exp;

    return Math.floor(
        EXP_TO_FIRST_LEVEL * Math.pow(GROWTH_RATE, getLevel(exp) - 1)
    );
}