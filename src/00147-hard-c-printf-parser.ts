type Control = keyof ControlsMap;
type ControlName = ControlsMap[Control];
type ControlsMap = {
    c: "char";
    s: "string";
    d: "dec";
    o: "oct";
    h: "hex";
    f: "float";
    p: "pointer";
};

type SanitisePct<T extends string> = T extends `%%${infer TRest}`
    ? SanitisePct<TRest>
    : T;

type ParsePrintFormat<
    T extends string,
    TControls extends ControlName[] = []
> = T extends `${string}%${infer TRest}`
    ? SanitisePct<TRest> extends `${infer TFirstLetter}${infer TRest2}`
        ? TFirstLetter extends Control
            ? ParsePrintFormat<
                  TRest2,
                  [...TControls, ControlsMap[TFirstLetter]]
              >
            : TControls
        : TControls
    : TControls;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
    Expect<Equal<ParsePrintFormat<"">, []>>,
    Expect<Equal<ParsePrintFormat<"Any string.">, []>>,
    Expect<Equal<ParsePrintFormat<"The result is %d.">, ["dec"]>>,
    Expect<Equal<ParsePrintFormat<"The result is %%d.">, []>>,
    Expect<Equal<ParsePrintFormat<"The result is %%%d.">, ["dec"]>>,
    Expect<Equal<ParsePrintFormat<"The result is %f.">, ["float"]>>,
    Expect<Equal<ParsePrintFormat<"The result is %h.">, ["hex"]>>,
    Expect<Equal<ParsePrintFormat<"The result is %q.">, []>>,
    Expect<
        Equal<ParsePrintFormat<"Hello %s: score is %d.">, ["string", "dec"]>
    >,
    Expect<Equal<ParsePrintFormat<"The result is %">, []>>
];
