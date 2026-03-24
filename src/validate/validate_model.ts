import {ValidationError} from '../error/validation_error';
import {getType} from '../util/get_type';

import v8 from '../reference/v8.json' with {type: 'json'};
import type {StyleSpecification} from '../types.g';

// Allow any URL, use dummy base, if it's a relative URL
export function isValidUrl(str: string, allowRelativeUrls: boolean): boolean {
    const isRelative = str.indexOf('://') === -1;
    try {
        new URL(str, isRelative && allowRelativeUrls ? 'http://example.com' : undefined);
        return true;
    } catch (_: unknown) {
        return false;
    }
}

type ModelValidatorOptions = {
    key: string;
    value: unknown;
    style: Partial<StyleSpecification>;
    styleSpec: typeof v8;
};

export function validateModel(options: ModelValidatorOptions): ValidationError[] {
    const url = options.value;

    if (!url) {
        return [];
    }

    if (getType(url) !== 'string') {
        return [new ValidationError(options.key, url, `string expected, "${getType(url)}" found`)];
    }

    if (!isValidUrl(url as string, true)) {
        return [new ValidationError(options.key, url, `invalid url "${url}"`)];
    }

    return [];
}
