import patterns from "./patterns.yml"

document.addEventListener("DOMContentLoaded", () => {
  const nameTarget = document.querySelector("[data-conference-name]");

  const updateName = () => {
    nameTarget.innerText = generateName();
  };

  nameTarget.addEventListener("click", e => {
    e.preventDefault();
    updateName()
  });

  updateName();
});

const generateName = () => {
  return new RandomText(patterns).toString();
}

class RandomText {
  constructor(patterns) {
    this.patterns = copy(patterns);
  }

  toString() {
    const text = this.pick("start");
    const result = this.applyReplacements(text);
    return capitalize(fixWhitespace(result));
  }

  applyReplacements(text) {
    let replaced = false
    text = text.replace(/<(.*?)>/, (match, tag) => {
      replaced = true
      return this.pick(tag)
    })
    text = text.replace(/\((.*?)\)/, (match, tag) => {
      replaced = true;
      return (randomInteger(0, 3) == 0) ? this.pick(tag) : "";
    })

    return replaced ? this.applyReplacements(text) : text;
  }

  typoFix(text) {
    return capitalize(text)
  }

  pick(tag) {
    if (!this.patterns[tag]) throw new Error("No such tag: " + tag)

    const index = Math.floor(Math.random() * this.patterns[tag].length);
    return this.patterns[tag].splice(index, 1).toString();
  }
}

const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const fixWhitespace = (text) => {
  return text
    .replace(/ +/, " ")
    .replace(/ +([…,])/, "$1")
    .replace(/ +([:?])/, "\xa0$1");
}

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const copy = (object) => {
  return JSON.parse(JSON.stringify(object))
}