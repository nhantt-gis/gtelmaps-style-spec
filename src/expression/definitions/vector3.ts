import {array, type Type, ValueType} from '../types';

import type {Expression} from '../expression';
import type {ParsingContext} from '../parsing_context';
import type {EvaluationContext} from '../evaluation_context';

export class MakeVector3 implements Expression {
    type: Type;
    args: Array<Expression>;

    constructor(type: Type, args: Array<Expression>) {
        this.type = type;
        this.args = args;
    }

    static parse(args: ReadonlyArray<unknown>, context: ParsingContext): Expression {
        if (args.length !== 4) {
            return context.error('Expected exactly 3 arguments.') as null;
        }

        const expected = context.expectedType;
        const itemType = expected && expected.kind === 'array' ? expected.itemType : ValueType;

        const parsed: Array<Expression> = [];
        for (let i = 1; i < args.length; i++) {
            const input = context.parse(args[i], i, itemType);
            if (!input) return null;
            parsed.push(input);
        }

        const outputType = array(itemType, 3);
        return new MakeVector3(outputType, parsed);
    }

    evaluate(ctx: EvaluationContext) {
        return this.args.map((arg) => arg.evaluate(ctx));
    }

    eachChild(fn: (_: Expression) => void) {
        this.args.forEach(fn);
    }

    outputDefined(): boolean {
        return this.args.every((arg) => arg.outputDefined());
    }
}
