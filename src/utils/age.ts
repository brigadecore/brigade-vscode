export type AgeUnit = 's' | 'm' | 'h' | 'd' | 'y';

export interface Age {
    readonly unit: AgeUnit;
    readonly quantity: number;
}

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

export module Age {
    export function fromKubernetesShort(age: string): Age {
        const unitText = age[age.length - 1];
        const unit = unitText as AgeUnit;
        const quantityText = age.substr(0, age.length - 1);
        const quantity = Number.parseInt(quantityText);
        return { unit, quantity };
    }

    export function asAgo(age: Age): string {
        const unitText = age.quantity === 1 ? singulars[age.unit] : plurals[age.unit];
        return `${age.quantity} ${unitText} ago`;
    }
}
