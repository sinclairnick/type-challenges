type LowerCase = keyof LowerToUpperMap;
type UpperCase = LowerToUpperMap[LowerCase];
type Letter = UpperCase | LowerCase;
type LowerToUpperMap = {
    a: "A";
    b: "B";
    c: "C";
    d: "D";
    e: "E";
    f: "F";
    g: "G";
    h: "H";
    i: "I";
    j: "J";
    k: "K";
    l: "L";
    m: "M";
    n: "N";
    o: "O";
    p: "P";
    q: "Q";
    r: "R";
    s: "S";
    t: "T";
    u: "U";
    v: "V";
    w: "W";
    x: "X";
    y: "Y";
    z: "Z";
};

type IsDelim<T> = T extends Letter ? false : true;

type ToUpperCase<S extends string> = S extends LowerCase
    ? LowerToUpperMap[S]
    : S;

type CapitalizeWord<TWord extends string> =
    TWord extends `${infer TFirstLetter}${infer TRestLetters}`
        ? TFirstLetter extends LowerCase
            ? `${ToUpperCase<TFirstLetter>}${TRestLetters}`
            : TWord
        : TWord;

type CapitalizeWords<
    TWords extends string,
    TActive extends string = ""
> = TWords extends `${infer TFirst}${infer TRest}`
    ? IsDelim<TFirst> extends true
        ? `${CapitalizeWord<TActive>}${TFirst}${CapitalizeWords<TRest>}`
        : CapitalizeWords<TRest, `${TActive}${TFirst}`>
    : CapitalizeWord<TActive>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
    Expect<Equal<CapitalizeWords<"foobar">, "Foobar">>,
    Expect<Equal<CapitalizeWords<"FOOBAR">, "FOOBAR">>,
    Expect<Equal<CapitalizeWords<"foo bar">, "Foo Bar">>,
    Expect<
        Equal<CapitalizeWords<"foo bar hello world">, "Foo Bar Hello World">
    >,
    Expect<
        Equal<CapitalizeWords<"foo bar.hello,world">, "Foo Bar.Hello,World">
    >,
    Expect<
        Equal<
            CapitalizeWords<"aa!bb@cc#dd$ee%ff^gg&hh*ii(jj)kk_ll+mm{nn}oo|pp🤣qq">,
            "Aa!Bb@Cc#Dd$Ee%Ff^Gg&Hh*Ii(Jj)Kk_Ll+Mm{Nn}Oo|Pp🤣Qq"
        >
    >,
    Expect<Equal<CapitalizeWords<"">, "">>
];
