export type AgeUnit = 's' | 'm' | 'h' | 'd' | 'y';

export interface KnownAge {
    readonly unit: AgeUnit;
    readonly quantity: number;
}

export interface UnknownAge {
    readonly age: 'unknown';
}

export type Age = KnownAge | UnknownAge;

const singulars: { [key in AgeUnit]: string } = {
    s: 'second',
    m: 'minute',
    h: 'hour',
    d: 'day',
    y: 'year'
};

const plurals: { [key in AgeUnit]: string } = {
    s: 'seconds',
    m: 'minutes',
    h: 'hours',
    d: 'days',
    y: 'years'
};

const UNKNOWN_AGE = { age: 'unknown' } as const;

const seconds: { [key in AgeUnit]: number } = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    y: 366 * 60 * 60  // doesn't need to be exact - just needs to be bigger than the maximum '???d' value can be
};

export module Age {
    export function isUnknown(age: Age): age is UnknownAge {
        return (age as any).age === 'unknown';
    }

    export function fromKubernetesShort(age: string): Age {
        if (age === '???') {
            return UNKNOWN_AGE;
        }

        const unitText = age[age.length - 1];
        const unit = unitText as AgeUnit;
        const quantityText = age.substr(0, age.length - 1);
        const quantity = Number.parseInt(quantityText);
        return { unit, quantity };
    }

    export function asAgo(age: Age): string {
        if (isUnknown(age)) {
            return 'Unknown time ago';
        }
        const unitText = age.quantity === 1 ? singulars[age.unit] : plurals[age.unit];
        return `${age.quantity} ${unitText} ago`;
    }

    export function sortIndex(age: Age): number {
        if (isUnknown(age)) {
            return 0;
        }
        return age.quantity * seconds[age.unit];
    }
}
