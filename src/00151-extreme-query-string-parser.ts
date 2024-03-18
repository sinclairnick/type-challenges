type ParseItem<T extends string> = T extends `${infer TKey}=`
    ? { [Key in TKey]: true } // Case: { [key]: true} when `<key>=`
    : T extends `${infer TKey}=${infer TValue}`
    ? { [Key in TKey]: TValue } // Case: { [key]: <value> } when `<key>=<value>
    : T extends `${infer TKey}`
    ? { [Key in TKey]: true } // Case: { [key]: true } when `<key>`
    : never;

type RemoveDuplicatesFromEnd<TArr extends any[]> = TArr["length"] extends 1
    ? TArr
    : TArr extends [...infer TRest, infer TLast]
    ? TLast extends TRest[number]
        ? RemoveDuplicatesFromEnd<TRest>
        : [...RemoveDuplicatesFromEnd<TRest>, TLast]
    : [];

type MergeMaybeTuple<TFirst, TSecond> = TSecond extends any[]
    ? RemoveDuplicatesFromEnd<[TFirst, ...TSecond]>
    : TFirst extends TSecond
    ? TSecond
    : [TFirst, TSecond];

type MergeItems<TFirst, TSecond> = {
    [TKey in keyof TFirst | keyof TSecond]: TKey extends keyof TFirst
        ? TKey extends keyof TSecond
            ? MergeMaybeTuple<TFirst[TKey], TSecond[TKey]>
            : TFirst[TKey]
        : TKey extends keyof TSecond
        ? TSecond[TKey]
        : never;
};

type Simplify<T> = {
    [TKey in keyof T]: T[TKey];
};

type ParseQueryString<T extends string> = T extends ""
    ? {}
    : T extends `${infer TStart}&${infer TRest}`
    ? Simplify<MergeItems<ParseItem<TStart>, ParseQueryString<TRest>>>
    : ParseItem<T>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
    Expect<Equal<ParseQueryString<"">, {}>>,
    Expect<Equal<ParseQueryString<"k1">, { k1: true }>>,
    Expect<Equal<ParseQueryString<"k1&k1">, { k1: true }>>,
    Expect<Equal<ParseQueryString<"k1&k2">, { k1: true; k2: true }>>,
    Expect<Equal<ParseQueryString<"k1=v1">, { k1: "v1" }>>,
    Expect<Equal<ParseQueryString<"k1=v1&k1=v2">, { k1: ["v1", "v2"] }>>,
    Expect<Equal<ParseQueryString<"k1=v1&k2=v2">, { k1: "v1"; k2: "v2" }>>,
    Expect<
        Equal<
            ParseQueryString<"k1=v1&k2=v2&k1=v2">,
            { k1: ["v1", "v2"]; k2: "v2" }
        >
    >,
    Expect<Equal<ParseQueryString<"k1=v1&k2">, { k1: "v1"; k2: true }>>,
    Expect<Equal<ParseQueryString<"k1=v1&k1=v1">, { k1: "v1" }>>,
    Expect<Equal<ParseQueryString<"k1=v1&k1=v2&k1=v1">, { k1: ["v1", "v2"] }>>,
    Expect<
        Equal<
            ParseQueryString<"k1=v1&k2=v1&k1=v2&k1=v1">,
            { k1: ["v1", "v2"]; k2: "v1" }
        >
    >,
    Expect<
        Equal<
            ParseQueryString<"k1=v1&k2=v2&k1=v2&k1=v3">,
            { k1: ["v1", "v2", "v3"]; k2: "v2" }
        >
    >,
    Expect<Equal<ParseQueryString<"k1=v1&k1">, { k1: ["v1", true] }>>,
    Expect<Equal<ParseQueryString<"k1&k1=v1">, { k1: [true, "v1"] }>>
];
