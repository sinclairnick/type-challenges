type ParseUrlParams<T> = T extends `${infer TPart}/${infer TRest}`
    ? ParseUrlParams<TPart> | ParseUrlParams<TRest>
    : T extends `:${infer TParam}`
    ? TParam
    : never;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
    Expect<Equal<ParseUrlParams<"">, never>>,
    Expect<Equal<ParseUrlParams<":id">, "id">>,
    Expect<Equal<ParseUrlParams<"posts/:id">, "id">>,
    Expect<Equal<ParseUrlParams<"posts/:id/">, "id">>,
    Expect<Equal<ParseUrlParams<"posts/:id/:user">, "id" | "user">>,
    Expect<Equal<ParseUrlParams<"posts/:id/:user/like">, "id" | "user">>
];
