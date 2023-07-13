import numeral from "numeral";

if (!numeral.locales["pt-br"]) {
  numeral.register("locale", "pt-br", {
    abbreviations: {
      thousand: "k",
      million: "M",
      billion: "B",
      trillion: "T",
    },
    delimiters: {
      thousands: ".",
      decimal: ",",
    },
    currency: {
      symbol: "R$",
    },
    ordinal: (num: number) => num.toString(),
  });

  numeral.locale("pt-br");
}

export default numeral;
