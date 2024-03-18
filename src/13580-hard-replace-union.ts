type TwoTuple = [any, any];

// Strategy; Greedily exclude existing type, selectively include new type
type UnionReplace<T, U extends TwoTuple[]> = U extends [
    infer TFirst,
    ...infer TRest
]
    ? TFirst extends [infer TTupleA, infer TTupleB]
        ? TRest extends TwoTuple[]
            ? TTupleA extends T
                ? // Append Tuple.B if Tuple.A is part of T
                  UnionReplace<Exclude<T, TTupleA> | TTupleB, TRest>
                : // Otherwise: Ignore Tuple.B and move on
                  UnionReplace<Exclude<T, TTupleA>, TRest>
            : // If no more tuples to iterate, return
              Exclude<T, TTupleA> | TTupleB
        : T
    : T;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
    // string -> null
    Expect<
        Equal<UnionReplace<number | string, [[string, null]]>, number | null>
    >,

    // string -> null
    Expect<
        Equal<
            UnionReplace<number | string, [[string, null], [Date, Function]]>,
            number | null
        >
    >,

    // Date -> string; Function -> undefined
    Expect<
        Equal<
            UnionReplace<
                Function | Date | object,
                [[Date, string], [Function, undefined]]
            >,
            undefined | string | object
        >
    >
];
